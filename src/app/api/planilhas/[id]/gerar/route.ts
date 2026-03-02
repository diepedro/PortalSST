import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createRelatorioFromBuffer } from "@/lib/report-service";
import fs from "fs";
import path from "path";

function canAccess(role: string, userId: string, ownerId: string | null) {
  if (role === "ADMIN") return true;
  return ownerId === userId;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }

  const role = (session.user as any).role as string;
  if (role === "CLIENTE" || role === "COLETA") {
    return NextResponse.json({ error: "Permissao insuficiente" }, { status: 403 });
  }

  const { id } = await params;
  const planilha = await prisma.planilha.findUnique({ where: { id } });
  if (!planilha) {
    return NextResponse.json({ error: "Planilha nao encontrada" }, { status: 404 });
  }

  if (!canAccess(role, session.user.id, planilha.usuarioId)) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const filePath = path.join(process.cwd(), "uploads", "planilhas", planilha.arquivoPath);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Arquivo nao encontrado no disco" }, { status: 404 });
  }

  try {
    const buffer = fs.readFileSync(filePath);

    const { relatorio } = await createRelatorioFromBuffer({
      buffer,
      usuarioId: session.user.id,
      tipoPreferido: planilha.tipo,
    });

    return NextResponse.json({
      success: true,
      relatorio,
      downloadUrl: `/api/relatorios/${relatorio.id}/pdf`,
    });
  } catch (error) {
    console.error("Erro ao gerar relatorio da planilha:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao gerar relatorio" },
      { status: 500 }
    );
  }
}
