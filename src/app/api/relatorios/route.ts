import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import type { Session } from "next-auth";
import { createRelatorioFromBuffer } from "@/lib/report-service";

type SessionLike = {
  user?: {
    id?: string | null;
    email?: string | null;
  } | null;
} | null;

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

async function resolveUsuarioIdFromSession(session: Session | null): Promise<string | null> {
async function resolveUsuarioIdFromSession(session: SessionLike): Promise<string | null> {
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
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
  }

  const role = (session.user as any).role;
  const empresaId = (session.user as any).empresaId;

  // ACCESS RULES:
  // ADMIN can see all
  // CLIENTE sees reports from their company
  // TECNICO/USER see only own records
  // COLETA has no access to reports list
  if (role === "COLETA") {
    return NextResponse.json({ error: "Permissao insuficiente" }, { status: 403 });
  }

  let where: any = {};
  if (role === "CLIENTE") {
    where = { empresaId };
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
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
  }

  const role = (session.user as any).role;
  if (role === "CLIENTE" || role === "COLETA") {
    return NextResponse.json({ error: "Permissao insuficiente para gerar relatorios" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const tipoForm = String(formData.get("tipo") ?? "").toUpperCase() || null;

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    const usuarioId = await resolveUsuarioIdFromSession(session);
    if (!usuarioId) {
      return NextResponse.json(
        { error: "Sessao invalida para gerar relatorio. Faca logout e login novamente." },
        { status: 401 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { relatorio } = await createRelatorioFromBuffer({
      buffer,
      usuarioId,
      tipoPreferido: tipoForm,
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
