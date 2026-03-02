import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  AJUDA_CUSTO_VALOR,
  PALESTRA_VALOR,
  calcularFolha,
  parsePeriodo,
} from "@/lib/financeiro";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const role = (session.user as any).role;
  if (role !== "ADMIN") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  try {
    const { dataInicio, dataFimExclusiva, rawInicio, rawFim } = parsePeriodo(
      req.nextUrl.searchParams
    );

    const folha = await calcularFolha({ dataInicio, dataFimExclusiva });

    return NextResponse.json({
      dataInicio: rawInicio ?? null,
      dataFim: rawFim ?? null,
      regras: {
        palestra: PALESTRA_VALOR,
        ajudaCusto: AJUDA_CUSTO_VALOR,
        blitz: {
          ate6h: 100,
          ate8h: 150,
          ate12h: 200,
        },
        carroProprio: {
          londrina: 20,
          ibiporaOuCambe: 35,
          demaisPorKm: 0.75,
        },
      },
      folha,
    });
  } catch (error) {
    console.error("Erro no financeiro:", error);
    return NextResponse.json(
      { error: "Erro ao calcular folha de pagamento" },
      { status: 500 }
    );
  }
}
