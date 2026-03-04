import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildSaudeWorkbookFromColeta } from "@/lib/coleta-workbook";
import { readPlanilhaMetadata } from "@/lib/report-service";
import fs from "fs";
import path from "path";

const PLANILHAS_DIR = path.join(process.cwd(), "uploads", "planilhas");

function ensureDir() {
  if (!fs.existsSync(PLANILHAS_DIR)) {
    fs.mkdirSync(PLANILHAS_DIR, { recursive: true });
  }
}

function safeChunk(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 48);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }

  const role = (session.user as { role?: string }).role;
  if (role === "CLIENTE") {
    return NextResponse.json({ error: "Permissao insuficiente" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const empresa = body?.empresa as {
      nome?: string;
      endereco?: string;
      profissional?: string;
      dataColeta?: string;
      horario?: string;
      qtdColaboradores?: number;
    };
    const participantes = (body?.participantes ?? []) as Array<{
      nome: string;
      idade: number;
      altura: number;
      peso: number;
      pa: string;
      fc: number;
      glicemia: number;
      comorbidades: string;
      sexo: number;
    }>;

    if (!empresa?.nome || !empresa?.dataColeta) {
      return NextResponse.json({ error: "Empresa e data da coleta sao obrigatorias" }, { status: 400 });
    }
    if (!Array.isArray(participantes) || participantes.length === 0) {
      return NextResponse.json({ error: "Adicione ao menos um participante" }, { status: 400 });
    }

    ensureDir();

    const buffer = await buildSaudeWorkbookFromColeta({
      empresa: {
        nome: String(empresa.nome),
        endereco: String(empresa.endereco || ""),
        profissional: String(empresa.profissional || ""),
        dataColeta: String(empresa.dataColeta),
        horario: String(empresa.horario || ""),
        qtdColaboradores: Number(empresa.qtdColaboradores || 0),
      },
      participantes: participantes as any,
    });

    const fileName = `${Date.now()}_${safeChunk(String(empresa.nome))}_coleta.xlsx`;
    const filePath = path.join(PLANILHAS_DIR, fileName);
    fs.writeFileSync(filePath, buffer);

    const meta = await readPlanilhaMetadata(buffer);
    const profSuffix = empresa.profissional ? `_${safeChunk(String(empresa.profissional))}` : "";

    const planilha = await prisma.planilha.create({
      data: {
        nome: `Coleta_${empresa.nome}${profSuffix}.xlsx`,
        tipo: "SAUDE",
        tamanho: buffer.byteLength,
        arquivoPath: fileName,
        empresaNome: meta.empresaNome || String(empresa.nome),
        dataColetaTexto: meta.dataColetaTexto || String(empresa.dataColeta),
        usuarioId: session.user.id,
      },
    });

    return NextResponse.json(planilha, { status: 201 });
  } catch (error) {
    console.error("Erro ao iniciar coleta:", error);
    return NextResponse.json({ error: "Erro ao criar planilha da coleta" }, { status: 500 });
  }
}
