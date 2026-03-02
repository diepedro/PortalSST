import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import path from "path";
import fs from "fs";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const relatorio = await prisma.relatorio.findUnique({ where: { id } });
  if (!relatorio) {
    return NextResponse.json({ error: "Nao encontrado" }, { status: 404 });
  }

  // Delete PDF file from disk
  if (relatorio.pdfUrl) {
    const filePath = path.join(process.cwd(), "uploads", "relatorios", relatorio.pdfUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  await prisma.relatorio.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
