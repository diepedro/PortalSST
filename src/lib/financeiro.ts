import { prisma } from "@/lib/prisma";

export const AJUDA_CUSTO_VALOR = 35;
export const PALESTRA_VALOR = 100;

export interface FolhaItem {
  atividadeId: string;
  data: Date;
  tipo: string;
  empresa: string;
  cidade: string | null;
  valorBase: number;
  ajudaCusto: number;
  deslocamento: number;
  total: number;
}

export interface FolhaProfissional {
  profissionalId: string;
  profissionalNome: string;
  total: number;
  itens: FolhaItem[];
}

export function normalizeCity(value?: string | null) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export function getBlitzValor(horas?: number | null) {
  const totalHoras = horas || 1;
  if (totalHoras <= 6) return 100;
  if (totalHoras <= 8) return 150;
  return 200;
}

export function getDeslocamento(atividade: {
  transporte: string | null;
  cidade: string | null;
  kmRodado: number | null;
}) {
  if (atividade.transporte !== "CARRO_PROPRIO") return 0;
  const cidade = normalizeCity(atividade.cidade);
  if (cidade === "londrina") return 20;
  if (cidade === "ibipora" || cidade === "cambe") return 35;
  return Number((atividade.kmRodado || 0) * 0.75);
}

export function getValorBase(atividade: {
  tipo: string;
  blitzHoras: number | null;
  qtdPalestras?: number | null;
}) {
  if (atividade.tipo === "PALESTRA") {
    const qtd = Math.max(1, atividade.qtdPalestras || 1);
    return PALESTRA_VALOR * qtd;
  }
  if (atividade.tipo === "BLITZ") return getBlitzValor(atividade.blitzHoras);
  return 0;
}

export function parsePeriodo(params: URLSearchParams): {
  dataInicio?: Date;
  dataFimExclusiva?: Date;
  rawInicio?: string;
  rawFim?: string;
} {
  const mes = params.get("mes");
  const rawInicio = params.get("dataInicio") ?? undefined;
  const rawFim = params.get("dataFim") ?? undefined;

  if (
    rawInicio &&
    rawFim &&
    /^\d{4}-\d{2}-\d{2}$/.test(rawInicio) &&
    /^\d{4}-\d{2}-\d{2}$/.test(rawFim)
  ) {
    const dataInicio = new Date(`${rawInicio}T00:00:00.000Z`);
    const dataFimExclusiva = new Date(`${rawFim}T00:00:00.000Z`);
    dataFimExclusiva.setUTCDate(dataFimExclusiva.getUTCDate() + 1);
    return { dataInicio, dataFimExclusiva, rawInicio, rawFim };
  }

  if (mes && /^\d{4}-\d{2}$/.test(mes)) {
    const dataInicio = new Date(`${mes}-01T00:00:00.000Z`);
    const dataFimExclusiva = new Date(dataInicio);
    dataFimExclusiva.setUTCMonth(dataFimExclusiva.getUTCMonth() + 1);
    const inicio = dataInicio.toISOString().slice(0, 10);
    const fimInclusivo = new Date(dataFimExclusiva);
    fimInclusivo.setUTCDate(fimInclusivo.getUTCDate() - 1);
    return {
      dataInicio,
      dataFimExclusiva,
      rawInicio: inicio,
      rawFim: fimInclusivo.toISOString().slice(0, 10),
    };
  }

  return {};
}

export async function calcularFolha(params: {
  dataInicio?: Date;
  dataFimExclusiva?: Date;
  profissionalId?: string;
}): Promise<FolhaProfissional[]> {
  const atividades = await prisma.atividade.findMany({
    where: {
      status: "REALIZADA",
      ...(params.dataInicio && params.dataFimExclusiva
        ? {
            data: {
              gte: params.dataInicio,
              lt: params.dataFimExclusiva,
            },
          }
        : {}),
      ...(params.profissionalId
        ? {
            OR: [
              { profissionalId: params.profissionalId },
              { profissional2Id: params.profissionalId },
            ],
          }
        : {}),
    },
    include: {
      empresa: true,
      profissional: true,
      profissional2: true,
    },
    orderBy: { data: "desc" },
  });

  const folhaMap = new Map<string, FolhaProfissional>();

  for (const atividade of atividades) {
    const valorBase = getValorBase(atividade);
    const ajudaCusto = atividade.ajudaCusto ? AJUDA_CUSTO_VALOR : 0;
    const deslocamento = getDeslocamento(atividade);
    const totalAtividade = valorBase + ajudaCusto + deslocamento;

    const profissionais = [atividade.profissional, atividade.profissional2].filter(Boolean);

    for (const profissional of profissionais) {
      if (!profissional) continue;
      if (params.profissionalId && profissional.id !== params.profissionalId) continue;

      const atual = folhaMap.get(profissional.id) || {
        profissionalId: profissional.id,
        profissionalNome: profissional.nome,
        total: 0,
        itens: [],
      };

      atual.total += totalAtividade;
      atual.itens.push({
        atividadeId: atividade.id,
        data: atividade.data,
        tipo: atividade.tipo,
        empresa: atividade.empresa.nome,
        cidade: atividade.cidade,
        valorBase,
        ajudaCusto,
        deslocamento,
        total: totalAtividade,
      });
      folhaMap.set(profissional.id, atual);
    }
  }

  return Array.from(folhaMap.values())
    .map((entry) => ({
      ...entry,
      total: Number(entry.total.toFixed(2)),
      itens: entry.itens.map((item) => ({
        ...item,
        total: Number(item.total.toFixed(2)),
        deslocamento: Number(item.deslocamento.toFixed(2)),
      })),
    }))
    .sort((a, b) => b.total - a.total);
}
