import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { gerarTriagemColetaPdf } from "@/lib/coleta-triagem-pdf";

function safeFileName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "_");
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }

  const role = (session.user as { role?: string }).role;
  if (role === "CLIENTE") {
    return NextResponse.json({ error: "Permissao insuficiente" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const empresaNome = String(body?.empresaNome || "");
    const dataColeta = String(body?.dataColeta || "");
    const totalParticipantes = Number(body?.totalParticipantes || 0);
    const itens = Array.isArray(body?.itens)
      ? body.itens.map((i: { nome?: string; alertas?: string[] }) => ({
          nome: String(i?.nome || ""),
          alertas: Array.isArray(i?.alertas) ? i.alertas.map(String) : [],
        }))
      : [];

    const pdf = await gerarTriagemColetaPdf({
      empresaNome,
      dataColeta,
      totalParticipantes,
      itens,
    });

    const nomeArquivo = `Triagem_${safeFileName(empresaNome || "Coleta")}.pdf`;
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${nomeArquivo}"`,
      },
    });
  } catch (error) {
    console.error("Erro ao gerar PDF de triagem:", error);
    return NextResponse.json({ error: "Erro ao gerar PDF de triagem" }, { status: 500 });
  }
}
