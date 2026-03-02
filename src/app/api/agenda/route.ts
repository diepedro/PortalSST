import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

function normalizeCity(value?: string | null) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function isCidadeValorFixo(cidade?: string | null) {
  const c = normalizeCity(cidade);
  return c === "londrina" || c === "ibipora" || c === "cambe";
}

function calcularHorasPorPeriodo(horaEntrada?: string | null, horaSaida?: string | null) {
  if (!horaEntrada || !horaSaida) return null;
  const [hIni, mIni] = horaEntrada.split(":").map(Number);
  const [hFim, mFim] = horaSaida.split(":").map(Number);
  if (
    Number.isNaN(hIni) ||
    Number.isNaN(mIni) ||
    Number.isNaN(hFim) ||
    Number.isNaN(mFim)
  ) {
    return null;
  }
  const inicio = hIni * 60 + mIni;
  const fim = hFim * 60 + mFim;
  if (fim <= inicio) return null;
  const horas = (fim - inicio) / 60;
  return Math.max(1, Math.ceil(horas));
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const role = (session.user as any).role;
  const userId = session.user.id;

  const atividades = await prisma.atividade.findMany({
    where: role === "CLIENTE" ? { usuarioId: userId } : undefined,
    include: { empresa: true, profissional: true, profissional2: true },
    orderBy: { data: "desc" },
  });
  return NextResponse.json(atividades);
}

async function resolveEmpresa(nome: string, endereco?: string) {
  let empresa = await prisma.empresa.findFirst({ where: { nome } });
  if (!empresa) {
    empresa = await prisma.empresa.create({
      data: { nome, endereco: endereco || null },
    });
  }
  return empresa;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const role = (session.user as any).role;
    const userEmpresaId = (session.user as any).empresaId;

    let targetEmpresaId: string;
    let statusFinal: "SOLICITADA" | "AGENDADA" = "AGENDADA";

    if (role === "CLIENTE") {
      if (!userEmpresaId) return NextResponse.json({ error: "Cliente sem empresa vinculada" }, { status: 400 });
      
      // Mesmo sendo cliente Hospitalar, ele pode agendar para outra empresa (corpo da requisicao)
      const empresaAlvo = await resolveEmpresa(body.empresa, body.endereco);
      targetEmpresaId = empresaAlvo.id;
      statusFinal = "SOLICITADA";
    } else {
      const empresa = await resolveEmpresa(body.empresa, body.endereco);
      targetEmpresaId = empresa.id;
    }

    const cidadeFixa = isCidadeValorFixo(body.cidade);
    const transporteFinal = cidadeFixa ? "CARRO_PROPRIO" : (body.transporte || null);
    const kmInformado = Number(body.kmRodado);
    const kmRodado = transporteFinal === "CARRO_PROPRIO" && cidadeFixa ? 0 : transporteFinal === "CARRO_PROPRIO" && Number.isFinite(kmInformado) ? kmInformado : transporteFinal === "CARRO_PROPRIO" ? 0 : null;

    const horasCalculadas = calcularHorasPorPeriodo(body.horaEntrada, body.horaSaida);
    const blitzHoras = body.tipo === "BLITZ" ? horasCalculadas ?? (Number(body.blitzHoras) || 1) : null;
    const qtdPalestras = body.tipo === "PALESTRA" ? Math.max(1, Number(body.qtdPalestras) || 1) : null;

    const atividade = await prisma.atividade.create({
      data: {
        data: new Date(body.data),
        tipo: body.tipo,
        empresaId: targetEmpresaId,
        profissionalId: body.profissionalId || null,
        profissional2Id: body.profissional2Id || null,
        titulo: body.titulo || "",
        endereco: body.endereco || null,
        cidade: body.cidade || null,
        ajudaCusto: Boolean(body.ajudaCusto),
        transporte: transporteFinal,
        blitzHoras,
        horaEntrada: body.horaEntrada || null,
        horaSaida: body.horaSaida || null,
        qtdPalestras,
        kmRodado,
        colaboradores: body.colaboradores || 0,
        materiais: body.materiais || null,
        status: statusFinal,
      },
      include: { empresa: true, profissional: true, profissional2: true },
    });
    return NextResponse.json(atividade, { status: 201 });
  } catch (error) {
    console.error("Erro ao agendar:", error);
    return NextResponse.json({ error: "Erro ao agendar atividade" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, empresa: empresaNome, ...rest } = body;
    const role = (session.user as any).role;

    const atual = await prisma.atividade.findUnique({
      where: { id },
      include: { empresa: true }
    });

    if (!atual) return NextResponse.json({ error: "Atividade não encontrada" }, { status: 404 });

    // Security: CLIENTE cannot approve or change other's activities
    if (role === "CLIENTE") {
      return NextResponse.json({ error: "Permissão insuficiente para alterar agendamentos" }, { status: 403 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: Record<string, any> = { ...rest };

    if (data.data) data.data = new Date(data.data);
    if (data.profissionalId === "") data.profissionalId = null;
    if (data.profissional2Id === "") data.profissional2Id = null;
    
    // ... logic for hours and cities (kept from original)
    const cidadeFinal = "cidade" in data ? data.cidade : undefined;
    const cidadeFixa = isCidadeValorFixo(cidadeFinal);
    if (cidadeFixa) {
      data.transporte = "CARRO_PROPRIO";
      data.kmRodado = 0;
    }

    if (empresaNome) {
      const empresa = await resolveEmpresa(empresaNome, rest.endereco);
      data.empresaId = empresa.id;
    }

    const atividade = await prisma.atividade.update({
      where: { id },
      data,
      include: { empresa: true, profissional: true, profissional2: true },
    });
    return NextResponse.json(atividade);
  } catch (error) {
    console.error("Erro ao atualizar:", error);
    return NextResponse.json({ error: "Erro ao atualizar atividade" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (role !== "ADMIN" && role !== "TECNICO") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  try {
    const { id } = await req.json();
    await prisma.atividade.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir:", error);
    return NextResponse.json({ error: "Erro ao excluir atividade" }, { status: 500 });
  }
}
