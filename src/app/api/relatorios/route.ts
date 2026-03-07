import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createRelatorioComparativoFromBuffers, createRelatorioFromBuffer } from "@/lib/report-service";

type SessionLike = {
  user?: {
    id?: string | null;
    email?: string | null;
  } | null;
} | null;

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
    const fileAntes = formData.get("fileAntes") as File;
    const fileDepois = formData.get("fileDepois") as File;
    const tipoForm = String(formData.get("tipo") ?? "").toUpperCase() || null;

    const usuarioId = await resolveUsuarioIdFromSession(session);
    if (!usuarioId) {
      return NextResponse.json(
        { error: "Sessao invalida para gerar relatorio. Faca logout e login novamente." },
        { status: 401 }
      );
    }

    let result:
      | { relatorio: any; alertasProcessamento: string[] }
      | { relatorio: any; alertasProcessamento: string[] };

    if (tipoForm === "COMPARATIVO" && fileAntes && fileDepois) {
      const bufferAntes = Buffer.from(await fileAntes.arrayBuffer());
      const bufferDepois = Buffer.from(await fileDepois.arrayBuffer());
      const { relatorio, alertasProcessamento } = await createRelatorioComparativoFromBuffers({
        bufferAntes,
        bufferDepois,
        usuarioId,
      });
      result = { relatorio, alertasProcessamento };
    } else {
      if (!file) {
        return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      const { relatorio, alertasProcessamento } = await createRelatorioFromBuffer({
        buffer,
        usuarioId,
        tipoPreferido: tipoForm,
      });
      result = { relatorio, alertasProcessamento };
    }

    return NextResponse.json({
      success: true,
      relatorio: result.relatorio,
      alertasProcessamento: result.alertasProcessamento,
      downloadUrl: `/api/relatorios/${result.relatorio.id}/pdf`,
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
