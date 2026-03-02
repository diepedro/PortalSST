import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generatePdfBuffer } from "@/lib/render-pdf";
import { DadosRelatorioAny } from "@/types";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const relatorio = await prisma.relatorio.findUnique({
    where: { id },
    include: { empresa: true },
  });

  if (!relatorio) {
    return NextResponse.json(
      { error: "Relatorio nao encontrado" },
      { status: 404 }
    );
  }

  const dados = relatorio.dados as unknown as DadosRelatorioAny;
  const pdfBuffer = await generatePdfBuffer(dados);

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Relatorio_${relatorio.empresa.nome.replace(/\s+/g, "_")}.pdf"`,
    },
  });
}
