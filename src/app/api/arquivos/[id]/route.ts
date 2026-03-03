import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import path from "path";
import fs from "fs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }
  if ((session.user as any).role === "COLETA") {
    return NextResponse.json({ error: "Permissao insuficiente" }, { status: 403 });
  }

  const { id } = await params;

  const arquivo = await prisma.arquivo.findUnique({ where: { id } });
  if (!arquivo) {
    return NextResponse.json({ error: "Arquivo nao encontrado" }, { status: 404 });
  }

  const filePath = path.join(process.cwd(), "uploads", "arquivos", arquivo.url);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Arquivo nao encontrado no disco" }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);
  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": arquivo.tipo,
      "Content-Disposition": `attachment; filename="${arquivo.nome}"`,
    },
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }
  if ((session.user as any).role === "COLETA") {
    return NextResponse.json({ error: "Permissao insuficiente" }, { status: 403 });
  }

  const { id } = await params;

  const arquivo = await prisma.arquivo.findUnique({ where: { id } });
  if (!arquivo) {
    return NextResponse.json({ error: "Nao encontrado" }, { status: 404 });
  }

  const filePath = path.join(process.cwd(), "uploads", "arquivos", arquivo.url);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  await prisma.arquivo.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
