import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generatePdfBuffer } from "@/lib/render-pdf";
import { DadosRelatorioAny } from "@/types";

function toDadosRelatorioAny(value: unknown): DadosRelatorioAny {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Dados do relatório inválidos para geração de PDF.");
  }
  return value as DadosRelatorioAny;
}

function safeFileName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "_");
}

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await context.params;
  const role = (session.user as any).role;

  const relatorio = await prisma.relatorio.findUnique({
    where: { id },
    include: { empresa: true },
  });

  if (!relatorio || !relatorio.pdfUrl) {
    return NextResponse.json(
      { error: "Relatório não encontrado" },
      { status: 404 }
    );
  }

  // Security check
  if (role !== "ADMIN" && relatorio.usuarioId !== session.user.id) {
    return NextResponse.json({ error: "Acesso negado ao documento" }, { status: 403 });
  }

  try {
    let pdfBuffer: ArrayBuffer;
    
    if (relatorio.pdfUrl === "internal:generate") {
      console.log(`[PDF] Gerando PDF local para o relatório: ${id}`);
      const dados = toDadosRelatorioAny(relatorio.dados);
      const buffer = await generatePdfBuffer(dados);
      pdfBuffer = Uint8Array.from(buffer).buffer;
    } else {
      const response = await fetch(relatorio.pdfUrl);
      if (!response.ok) throw new Error("Failed to fetch from blob storage");
      pdfBuffer = await response.arrayBuffer();
    }
    
    const nomeEmpresa = safeFileName(relatorio.empresa.nome);
    const nomeArquivo = `Relatorio_${nomeEmpresa || "empresa"}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${nomeArquivo}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[PDF] Erro crítico ao processar o arquivo:", error);
    const msg = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: `Erro na criação do PDF: ${msg}` }, { status: 500 });
  }
}
