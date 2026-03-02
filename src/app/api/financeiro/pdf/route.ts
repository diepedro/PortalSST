import { NextRequest, NextResponse } from "next/server";
import { calcularFolha, parsePeriodo } from "@/lib/financeiro";
import { gerarFolhaProfissionalPdf } from "@/lib/folha-pdf";

function slug(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export async function GET(req: NextRequest) {
  try {
    const profissionalId = req.nextUrl.searchParams.get("profissionalId");
    if (!profissionalId) {
      return NextResponse.json(
        { error: "profissionalId e obrigatorio" },
        { status: 400 }
      );
    }

    const { dataInicio, dataFimExclusiva, rawInicio, rawFim } = parsePeriodo(
      req.nextUrl.searchParams
    );

    const folha = await calcularFolha({
      profissionalId,
      dataInicio,
      dataFimExclusiva,
    });

    const profissional = folha[0];
    if (!profissional || profissional.itens.length === 0) {
      return NextResponse.json(
        { error: "Nenhum pagamento encontrado para este profissional no periodo" },
        { status: 404 }
      );
    }

    const pdf = await gerarFolhaProfissionalPdf({
      profissional,
      dataInicio: rawInicio ?? null,
      dataFim: rawFim ?? null,
    });

    const nomeArquivo = `folha_${slug(profissional.profissionalNome)}_${rawInicio ?? "inicio"}_${rawFim ?? "fim"}.pdf`;

    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${nomeArquivo}"`,
      },
    });
  } catch (error) {
    console.error("Erro ao gerar PDF da folha:", error);
    return NextResponse.json(
      { error: "Erro ao gerar PDF da folha de pagamento" },
      { status: 500 }
    );
  }
}

