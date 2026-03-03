import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { readPlanilhaMetadata } from "@/lib/report-service";
import fs from "fs";
import path from "path";

const PLANILHAS_DIR = path.join(process.cwd(), "uploads", "planilhas");

function ensureDir() {
  if (!fs.existsSync(PLANILHAS_DIR)) {
    fs.mkdirSync(PLANILHAS_DIR, { recursive: true });
  }
}

function getSafeFileName(name: string) {
  return `${Date.now()}_${name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }

  const role = (session.user as any).role;
  if (role === "CLIENTE") {
    return NextResponse.json({ error: "Permissao insuficiente" }, { status: 403 });
  }

  const where = role === "ADMIN" ? {} : { usuarioId: session.user.id };

  const planilhas = await prisma.planilha.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      usuario: { select: { id: true, name: true, email: true } },
    },
  });

  return NextResponse.json(planilhas);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }

  const role = (session.user as any).role;
  if (role === "CLIENTE") {
    return NextResponse.json({ error: "Permissao insuficiente" }, { status: 403 });
  }

  try {
    ensureDir();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "Nenhuma planilha enviada" }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith(".xlsx")) {
      return NextResponse.json({ error: "Apenas arquivos .xlsx sao aceitos" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const detected = await readPlanilhaMetadata(buffer);

    const fileName = getSafeFileName(file.name);
    const filePath = path.join(PLANILHAS_DIR, fileName);
    fs.writeFileSync(filePath, buffer);

    const tipoForm = String(formData.get("tipo") ?? "").toUpperCase();
    const tipo =
      tipoForm === "SAUDE" || tipoForm === "COMPARATIVO" || tipoForm === "NPS"
        ? tipoForm
        : detected.tipo;

    const created = await prisma.planilha.create({
      data: {
        nome: file.name,
        tipo,
        tamanho: file.size,
        arquivoPath: fileName,
        empresaNome: detected.empresaNome || null,
        dataColetaTexto: detected.dataColetaTexto || null,
        usuarioId: session.user.id,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar planilha:", error);
    return NextResponse.json({ error: "Erro ao salvar planilha" }, { status: 500 });
  }
}
