import ExcelJS from "exceljs";
import { prisma } from "@/lib/prisma";
import { parseExcel } from "@/lib/excel-parser";
import { parseExcelComparativo } from "@/lib/excel-parser-comparativo";
import { parseExcelNPS } from "@/lib/excel-parser-nps";
import { DadosRelatorio, DadosRelatorioAny, DadosRelatorioComparativo, DadosRelatorioNPS } from "@/types";

export type TipoRelatorio = "SAUDE" | "COMPARATIVO" | "NPS";

type ParserStrategy = {
  parse: (buffer: Buffer) => Promise<DadosRelatorioAny>;
};

const parserStrategies: Record<TipoRelatorio, ParserStrategy> = {
  SAUDE: { parse: parseExcel },
  COMPARATIVO: { parse: parseExcelComparativo },
  NPS: { parse: parseExcelNPS },
};

function parseDateOrNow(input: string): Date {
  if (!input) return new Date();
  const parts = input.split("/");
  if (parts.length === 3) {
    const iso = `${parts[2]}-${parts[1]}-${parts[0]}`;
    const dt = new Date(iso);
    if (!Number.isNaN(dt.getTime())) return dt;
  }

  const dt = new Date(input);
  if (!Number.isNaN(dt.getTime())) return dt;
  return new Date();
}

export async function detectTipoRelatorio(buffer: Buffer): Promise<TipoRelatorio> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer as unknown as ArrayBuffer);
  const ws = workbook.worksheets[0];

  const cellA1 = String(ws.getCell("A1").value ?? "").toLowerCase();
  const cellA3 = String(ws.getCell("A3").value ?? "").toLowerCase();

  if (cellA3.includes("primeira data")) return "COMPARATIVO";
  if (cellA1.includes("nps") || cellA3.includes("nps")) return "NPS";
  return "SAUDE";
}

export async function parseRelatorioFromBuffer(
  buffer: Buffer,
  tipoPreferido?: string | null
): Promise<{ tipo: TipoRelatorio; dados: DadosRelatorioAny }> {
  const tipoInput = String(tipoPreferido ?? "").toUpperCase();
  const tipo: TipoRelatorio =
    tipoInput === "COMPARATIVO" || tipoInput === "SAUDE" || tipoInput === "NPS"
      ? (tipoInput as TipoRelatorio)
      : await detectTipoRelatorio(buffer);

  const dados = await parserStrategies[tipo].parse(buffer);
  return { tipo, dados };
}

export function getDataColetaFromDados(dados: DadosRelatorioAny): Date {
  if ((dados as DadosRelatorioComparativo).tipo === "COMPARATIVO") {
    return parseDateOrNow((dados as DadosRelatorioComparativo).empresa.segundaData);
  }
  if ((dados as DadosRelatorioNPS).tipo === "NPS") {
    return parseDateOrNow((dados as DadosRelatorioNPS).empresa.data);
  }
  return parseDateOrNow((dados as { empresa: { dataColeta: string } }).empresa.dataColeta);
}

export async function ensureEmpresaByNome(nome: string, endereco?: string | null) {
  let empresa = await prisma.empresa.findFirst({ where: { nome } });
  if (!empresa) {
    empresa = await prisma.empresa.create({
      data: {
        nome,
        endereco: endereco ?? "",
      },
    });
  }
  return empresa;
}

export async function createRelatorioFromBuffer(input: {
  buffer: Buffer;
  usuarioId: string;
  tipoPreferido?: string | null;
}) {
  const { tipo, dados } = await parseRelatorioFromBuffer(input.buffer, input.tipoPreferido);
  const alertasProcessamento = tipo === "SAUDE" ? validarConsistenciaSaude(dados) : [];

  if (!dados.empresa.nome) {
    throw new Error("Nao foi possivel identificar o nome da empresa na planilha. Verifique se o nome esta na celula B1.");
  }

  const empresa = await ensureEmpresaByNome(dados.empresa.nome, (dados as any).empresa?.endereco);

  const relatorio = await prisma.relatorio.create({
    data: {
      empresaId: empresa.id,
      usuarioId: input.usuarioId,
      dataColeta: getDataColetaFromDados(dados),
      dados: JSON.parse(JSON.stringify({ ...dados, meta: { alertasProcessamento } })),
      pdfUrl: "internal:generate",
    },
    include: { empresa: true },
  });

  return { tipo, dados, relatorio, alertasProcessamento };
}

function toPct(qtd: number, total: number): number {
  if (total <= 0) return 0;
  return (qtd / total) * 100;
}

function buildComparativoFromSaude(antes: DadosRelatorio, depois: DadosRelatorio): DadosRelatorioComparativo {
  const totalAntes = Math.max(antes.adesao.totalParticipantes, 1);
  const totalDepois = Math.max(depois.adesao.totalParticipantes, 1);

  const mk = (nome: string, qa: number, qd: number) => ({
    nome,
    antes: { quantidade: qa, percentual: toPct(qa, totalAntes) },
    depois: { quantidade: qd, percentual: toPct(qd, totalDepois) },
  });

  const idade = [
    mk(
      "18 - 30",
      antes.idade.faixas.find((f) => f.label === "18-30")?.valor ?? 0,
      depois.idade.faixas.find((f) => f.label === "18-30")?.valor ?? 0
    ),
    mk(
      "31 - 40",
      antes.idade.faixas.find((f) => f.label === "31-40")?.valor ?? 0,
      depois.idade.faixas.find((f) => f.label === "31-40")?.valor ?? 0
    ),
    mk(
      "41 - 50",
      antes.idade.faixas.find((f) => f.label === "41-50")?.valor ?? 0,
      depois.idade.faixas.find((f) => f.label === "41-50")?.valor ?? 0
    ),
    mk(
      "> 50",
      antes.idade.faixas.find((f) => f.label === ">50")?.valor ?? 0,
      depois.idade.faixas.find((f) => f.label === ">50")?.valor ?? 0
    ),
  ];

  const genero = [
    mk("Feminino", antes.genero.feminino, depois.genero.feminino),
    mk("Masculino", antes.genero.masculino, depois.genero.masculino),
  ];

  const imc = [
    mk("Magreza", antes.imc.magreza, depois.imc.magreza),
    mk("Normal", antes.imc.normal, depois.imc.normal),
    mk("Sobrepeso", antes.imc.sobrepeso, depois.imc.sobrepeso),
    mk("Obesidade", antes.imc.obesidade, depois.imc.obesidade),
    mk("Obesidade grave", antes.imc.obesidadeGrave, depois.imc.obesidadeGrave),
  ];

  const pressaoArterial = [
    mk("Otima", antes.pressaoArterial.otima, depois.pressaoArterial.otima),
    mk("Normal", antes.pressaoArterial.normal, depois.pressaoArterial.normal),
    mk("Pre-hipertensao", antes.pressaoArterial.preHipertensao, depois.pressaoArterial.preHipertensao),
    mk("HA Estagio 1", antes.pressaoArterial.hipertensaoEst1, depois.pressaoArterial.hipertensaoEst1),
    mk("HA Estagio 2", antes.pressaoArterial.hipertensaoEst2, depois.pressaoArterial.hipertensaoEst2),
    mk("HA Estagio 3", antes.pressaoArterial.hipertensaoEst3, depois.pressaoArterial.hipertensaoEst3),
  ];

  const glicemiaAntesLe110 = (antes.glicemia?.hipoglicemia ?? 0) + (antes.glicemia?.normoglicemia ?? antes.glicemia?.normal ?? 0);
  const glicemiaDepoisLe110 = (depois.glicemia?.hipoglicemia ?? 0) + (depois.glicemia?.normoglicemia ?? depois.glicemia?.normal ?? 0);
  const glicemiaAntesGt110 = antes.glicemia?.hiperglicemia ?? antes.glicemia?.alterada ?? 0;
  const glicemiaDepoisGt110 = depois.glicemia?.hiperglicemia ?? depois.glicemia?.alterada ?? 0;

  const glicemiaCapilar = [mk("<= 110", glicemiaAntesLe110, glicemiaDepoisLe110), mk("> 110", glicemiaAntesGt110, glicemiaDepoisGt110)];

  return {
    tipo: "COMPARATIVO",
    empresa: {
      nome: depois.empresa.nome || antes.empresa.nome,
      endereco: depois.empresa.endereco || antes.empresa.endereco || "",
      primeiraData: antes.empresa.dataColeta,
      segundaData: depois.empresa.dataColeta,
    },
    idade,
    genero,
    imc,
    pressaoArterial,
    glicemiaCapilar,
  };
}

export async function createRelatorioComparativoFromBuffers(input: {
  bufferAntes: Buffer;
  bufferDepois: Buffer;
  usuarioId: string;
}) {
  const parsedAntes = await parseRelatorioFromBuffer(input.bufferAntes, "SAUDE");
  const parsedDepois = await parseRelatorioFromBuffer(input.bufferDepois, "SAUDE");

  if (parsedAntes.tipo !== "SAUDE" || parsedDepois.tipo !== "SAUDE") {
    throw new Error("Arquivos de comparativo devem ser planilhas de saúde (Antes e Depois).");
  }

  const dados = buildComparativoFromSaude(parsedAntes.dados as DadosRelatorio, parsedDepois.dados as DadosRelatorio);
  const empresa = await ensureEmpresaByNome(dados.empresa.nome, dados.empresa.endereco);

  const relatorio = await prisma.relatorio.create({
    data: {
      empresaId: empresa.id,
      usuarioId: input.usuarioId,
      dataColeta: parseDateOrNow(dados.empresa.segundaData),
      dados: JSON.parse(JSON.stringify({ ...dados, meta: { alertasProcessamento: [] } })),
      pdfUrl: "internal:generate",
    },
    include: { empresa: true },
  });

  return { tipo: "COMPARATIVO" as const, dados, relatorio, alertasProcessamento: [] as string[] };
}

export async function readPlanilhaMetadata(buffer: Buffer): Promise<{
  tipo: TipoRelatorio;
  empresaNome: string;
  dataColetaTexto: string;
}> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer as unknown as ArrayBuffer);
  const ws = workbook.worksheets[0];

  const tipo = await detectTipoRelatorio(buffer);
  const empresaNome = String(ws.getCell("B1").value ?? "").trim();
  const rawData = ws.getCell("B3").value ?? ws.getCell("B4").value;

  let dataColetaTexto = "";
  if (rawData instanceof Date) {
    dataColetaTexto = rawData.toLocaleDateString("pt-BR");
  } else {
    dataColetaTexto = String(rawData ?? "").trim();
  }

  return { tipo, empresaNome, dataColetaTexto };
}

function validarConsistenciaSaude(dados: DadosRelatorioAny): string[] {
  const saude = dados as {
    adesao?: { totalParticipantes?: number };
    genero?: { feminino?: number; masculino?: number };
    idade?: { faixas?: Array<{ label: string; valor: number }> };
    imc?: { magreza?: number; normal?: number; sobrepeso?: number; obesidade?: number; obesidadeGrave?: number };
    pressaoArterial?: { normal?: number; preHipertensao?: number; hipertensaoEst1?: number; hipertensaoEst2?: number; hipertensaoEst3?: number; otima?: number };
    glicemia?: { hipoglicemia?: number; normoglicemia?: number; hiperglicemia?: number };
    frequenciaCardiaca?: { bradicardia?: number; normocardia?: number; taquicardia?: number };
    participantes?: Array<unknown>;
  };

  const total = Math.max(saude.adesao?.totalParticipantes ?? saude.participantes?.length ?? 0, 0);
  const alertas: string[] = [];

  const check = (nome: string, soma: number, deveFechar: boolean) => {
    if (soma > total) {
      throw new Error(
        `Inconsistencia de processamento (${nome}): soma ${soma} maior que total de participantes ${total}. Verifique a planilha antes de gerar o relatório.`
      );
    }
    if (deveFechar && soma !== total) {
      alertas.push(`${nome}: ${soma}/${total} com dados válidos. ${total - soma} sem registro.`);
    }
  };

  const somaGenero = (saude.genero?.feminino ?? 0) + (saude.genero?.masculino ?? 0);
  const somaIdade = (saude.idade?.faixas ?? []).reduce((acc, faixa) => acc + (faixa.valor ?? 0), 0);
  const somaImc = (saude.imc?.magreza ?? 0) + (saude.imc?.normal ?? 0) + (saude.imc?.sobrepeso ?? 0) + (saude.imc?.obesidade ?? 0) + (saude.imc?.obesidadeGrave ?? 0);
  const somaPa =
    (saude.pressaoArterial?.otima ?? 0) +
    (saude.pressaoArterial?.normal ?? 0) +
    (saude.pressaoArterial?.preHipertensao ?? 0) +
    (saude.pressaoArterial?.hipertensaoEst1 ?? 0) +
    (saude.pressaoArterial?.hipertensaoEst2 ?? 0) +
    (saude.pressaoArterial?.hipertensaoEst3 ?? 0);
  const somaGlicemia = (saude.glicemia?.hipoglicemia ?? 0) + (saude.glicemia?.normoglicemia ?? 0) + (saude.glicemia?.hiperglicemia ?? 0);
  const somaFc = (saude.frequenciaCardiaca?.bradicardia ?? 0) + (saude.frequenciaCardiaca?.normocardia ?? 0) + (saude.frequenciaCardiaca?.taquicardia ?? 0);

  check("Genero", somaGenero, true);
  check("Faixa etaria", somaIdade, true);
  check("IMC", somaImc, true);
  check("Pressao arterial", somaPa, true);
  if (saude.glicemia) check("Glicemia", somaGlicemia, true);
  if (saude.frequenciaCardiaca) check("Frequencia cardiaca", somaFc, true);

  return alertas;
}
