import ExcelJS from "exceljs";
import { prisma } from "@/lib/prisma";
import { parseExcel } from "@/lib/excel-parser";
import { parseExcelComparativo } from "@/lib/excel-parser-comparativo";
import { parseExcelNPS } from "@/lib/excel-parser-nps";
import { DadosRelatorioAny, DadosRelatorioComparativo, DadosRelatorioNPS } from "@/types";

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

  if (!dados.empresa.nome) {
    throw new Error("Nao foi possivel identificar o nome da empresa na planilha. Verifique se o nome esta na celula B1.");
  }

  const empresa = await ensureEmpresaByNome(dados.empresa.nome, (dados as any).empresa?.endereco);

  const relatorio = await prisma.relatorio.create({
    data: {
      empresaId: empresa.id,
      usuarioId: input.usuarioId,
      dataColeta: getDataColetaFromDados(dados),
      dados: JSON.parse(JSON.stringify(dados)),
      pdfUrl: "internal:generate",
    },
    include: { empresa: true },
  });

  return { tipo, dados, relatorio };
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
  const rawData = ws.getCell("B3").value;

  let dataColetaTexto = "";
  if (rawData instanceof Date) {
    dataColetaTexto = rawData.toLocaleDateString("pt-BR");
  } else {
    dataColetaTexto = String(rawData ?? "").trim();
  }

  return { tipo, empresaNome, dataColetaTexto };
}
