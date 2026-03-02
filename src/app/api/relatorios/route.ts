import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseExcel } from "@/lib/excel-parser";
import { parseExcelComparativo } from "@/lib/excel-parser-comparativo";
import { parseExcelNPS } from "@/lib/excel-parser-nps";
import ExcelJS from "exceljs";
import { DadosRelatorioAny, DadosRelatorioComparativo, DadosRelatorioNPS } from "@/types";
import { auth } from "@/lib/auth";

type TipoRelatorio = "SAUDE" | "COMPARATIVO" | "NPS";

function parseDateOrNow(input: string): Date {
  if (!input) return new Date();
  const parts = input.split("/");
  if (parts.length === 3) {
    const iso = `${parts[2]}-${parts[1]}-${parts[0]}`;
    const dt = new Date(iso);
    if (!Number.isNaN(dt.getTime())) return dt;
  }
  const dt = new Date(input);
  if (!Number.isNaN(dt.getTime())) return dt;
  return new Date();
}

async function detectTipoRelatorio(buffer: Buffer): Promise<TipoRelatorio> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer as unknown as ArrayBuffer);
  const ws = workbook.worksheets[0];
  const cellA3 = String(ws.getCell("A3").value ?? "").toLowerCase();
  if (cellA3.includes("primeira data")) return "COMPARATIVO";
  return "SAUDE";
}

function getDataColeta(dados: DadosRelatorioAny): Date {
  if ((dados as DadosRelatorioComparativo).tipo === "COMPARATIVO") {
    return parseDateOrNow((dados as DadosRelatorioComparativo).empresa.segundaData);
  }
  if ((dados as DadosRelatorioNPS).tipo === "NPS") {
    return parseDateOrNow((dados as DadosRelatorioNPS).empresa.data);
  }
  return parseDateOrNow((dados as { empresa: { dataColeta: string } }).empresa.dataColeta);
}

async function resolveUsuarioIdFromSession(session: Awaited<ReturnType<typeof auth>>): Promise<string | null> {
  const sessionUserId = session?.user?.id;
  const sessionUserEmail = session?.user?.email;

  if (sessionUserId) {
    const userById = await prisma.user.findUnique({
      where: { id: sessionUserId },
      select: { id: true },
    });
    if (userById) return userById.id;
  }

  if (sessionUserEmail) {
    const userByEmail = await prisma.user.findUnique({
      where: { email: sessionUserEmail },
      select: { id: true },
    });
    if (userByEmail) return userByEmail.id;
  }

  return null;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const role = (session.user as any).role;
  const empresaId = (session.user as any).empresaId;

  // ACCESS RULES:
  // ADMIN/TECNICO/USER can see their own (TECNICO/USER only see theirs)
  // CLIENTE only sees reports for their Empresa
  let where: any = {};
  if (role === "CLIENTE") {
    where = { empresaId: empresaId };
  } else if (role === "ADMIN") {
    where = {};
  } else {
    where = { usuarioId: session.user.id };
  }

  const relatorios = await prisma.relatorio.findMany({
    where,
    include: { empresa: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(relatorios);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const role = (session.user as any).role;
  // Clients cannot upload reports
  if (role === "CLIENTE") {
    return NextResponse.json({ error: "Permissão insuficiente para gerar relatórios" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const tipoForm = String(formData.get("tipo") ?? "").toUpperCase();
    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let tipo: TipoRelatorio;
    
    if (tipoForm === "COMPARATIVO" || tipoForm === "SAUDE" || tipoForm === "NPS") {
      tipo = tipoForm as TipoRelatorio;
    } else {
      tipo = await detectTipoRelatorio(buffer);
    }

    const dados: DadosRelatorioAny = tipo === "COMPARATIVO"
      ? await parseExcelComparativo(buffer)
      : tipo === "NPS"
        ? await parseExcelNPS(buffer)
        : await parseExcel(buffer);

    console.log(`[Relatorios] Dados parseados com sucesso para empresa: ${dados.empresa.nome}`);

    // Basic validation check
    if (!dados.empresa.nome) {
      console.error("[Relatorios] Erro: Nome da empresa não encontrado na planilha.");
      return NextResponse.json(
        { error: "Não foi possível identificar o nome da empresa na planilha. Verifique se o nome está na célula B1." },
        { status: 400 }
      );
    }

    // Find or create empresa
    let empresa = await prisma.empresa.findFirst({
      where: { nome: dados.empresa.nome },
    });
    if (!empresa) {
      empresa = await prisma.empresa.create({
        data: {
          nome: dados.empresa.nome,
          endereco: (dados as any).empresa.endereco || "",
        },
      });
    }

    const usuarioId = await resolveUsuarioIdFromSession(session);

    if (!usuarioId) {
      return NextResponse.json(
        { error: "Sessão inválida para gerar relatório. Faça logout e login novamente." },
        { status: 401 }
      );
    }

    const relatorio = await prisma.relatorio.create({
      data: {
        empresaId: empresa.id,
        usuarioId,
        dataColeta: getDataColeta(dados),
        dados: JSON.parse(JSON.stringify(dados)),
        pdfUrl: "internal:generate"
      },
      include: { empresa: true },
    });

    return NextResponse.json({
      success: true,
      relatorio,
      downloadUrl: `/api/relatorios/${relatorio.id}/pdf`,
    });
  } catch (error) {
    console.error("Erro ao gerar relatorio:", error);
    return NextResponse.json(
      {
        error: `Erro ao processar arquivo: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      },
      { status: 500 }
    );
  }
}
