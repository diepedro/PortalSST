import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  let { id } = await context.params;
  if (id.endsWith(".pdf")) id = id.slice(0, -4);
  const role = (session.user as any).role;

  const relatorio = await prisma.relatorio.findUnique({
    where: { id },
    include: { empresa: true },
  });

  if (!relatorio) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }

  // Security: Check ownership
  if (role !== "ADMIN" && relatorio.usuarioId !== session.user.id) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  return NextResponse.json({
    ...relatorio,
    pdfUrl: `/api/relatorios/${relatorio.id}/pdf`,
  });
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  let { id } = await context.params;
  if (id.endsWith(".pdf")) id = id.slice(0, -4);
  const role = (session.user as any).role;

  const relatorio = await prisma.relatorio.findUnique({ where: { id } });
  if (!relatorio) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }

  // Security: Check ownership for deletion
  if (role !== "ADMIN" && relatorio.usuarioId !== session.user.id) {
    return NextResponse.json({ error: "Acesso negado para exclusão" }, { status: 403 });
  }

  await prisma.relatorio.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
