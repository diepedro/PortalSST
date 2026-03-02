import ExcelJS from "exceljs";
import { CategoriaComparativa, DadosRelatorioComparativo } from "@/types";

function unwrap(val: unknown): unknown {
  if (val === null || val === undefined) return null;
  if (typeof val === "object" && !Array.isArray(val)) {
    const obj = val as Record<string, unknown>;
    if ("result" in obj) return obj.result;
    if ("richText" in obj && Array.isArray(obj.richText)) {
      return (obj.richText as { text: string }[]).map((r) => r.text).join("");
    }
    if ("error" in obj) return 0;
  }
  return val;
}

function toFloat(val: unknown): number {
  const v = unwrap(val);
  if (v == null) return 0;
  if (typeof v === "number") return Number.isNaN(v) ? 0 : v;
  const s = String(v).replace(",", ".").replace(/["%\s]/g, "").trim();
  const n = parseFloat(s);
  return Number.isNaN(n) ? 0 : n;
}

function normalizePercent(value: number): number {
  if (value <= 0) return 0;
  return value <= 1 ? value * 100 : value;
}

function formatDate(value: unknown): string {
  const raw = unwrap(value);
  if (raw instanceof Date) {
    return raw.toLocaleDateString("pt-BR");
  }
  return String(raw ?? "").split(" ")[0];
}

function buildCategoria(
  nome: string,
  qtdAntes: unknown,
  pctAntes: unknown,
  qtdDepois: unknown,
  pctDepois: unknown
): CategoriaComparativa {
  return {
    nome,
    antes: {
      quantidade: Math.round(toFloat(qtdAntes)),
      percentual: normalizePercent(toFloat(pctAntes)),
    },
    depois: {
      quantidade: Math.round(toFloat(qtdDepois)),
      percentual: normalizePercent(toFloat(pctDepois)),
    },
  };
}

export async function parseExcelComparativo(
  buffer: Buffer
): Promise<DadosRelatorioComparativo> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer as unknown as ArrayBuffer);
  const ws = workbook.worksheets[0];
  const cell = (ref: string): unknown => ws.getCell(ref).value;

  const empresa = {
    nome: String(unwrap(cell("B1")) ?? "").trim(),
    endereco: String(unwrap(cell("B2")) ?? "").trim(),
    primeiraData: formatDate(cell("B3")),
    segundaData: formatDate(cell("B4")),
  };

  const idade: CategoriaComparativa[] = [
    buildCategoria("18 - 30", cell("C8"), cell("D8"), cell("G8"), cell("H8")),
    buildCategoria("31 - 40", cell("C9"), cell("D9"), cell("G9"), cell("H9")),
    buildCategoria("41 - 50", cell("C10"), cell("D10"), cell("G10"), cell("H10")),
    buildCategoria("> 50", cell("C11"), cell("D11"), cell("G11"), cell("H11")),
  ];

  const genero: CategoriaComparativa[] = [
    buildCategoria("Feminino", cell("C14"), cell("D14"), cell("G14"), cell("H14")),
    buildCategoria("Masculino", cell("C15"), cell("D15"), cell("G15"), cell("H15")),
  ];

  const imc: CategoriaComparativa[] = [
    buildCategoria("Magreza", cell("C18"), cell("D18"), cell("G18"), cell("H18")),
    buildCategoria("Normal", cell("C19"), cell("D19"), cell("G19"), cell("H19")),
    buildCategoria("Sobrepeso", cell("C20"), cell("D20"), cell("G20"), cell("H20")),
    buildCategoria("Obesidade", cell("C21"), cell("D21"), cell("G21"), cell("H21")),
    buildCategoria("Obesidade grave", cell("C22"), cell("D22"), cell("G22"), cell("H22")),
  ];

  const pressaoArterial: CategoriaComparativa[] = [
    buildCategoria("Otima", cell("C25"), cell("D25"), cell("G25"), cell("H25")),
    buildCategoria("Normal", cell("C26"), cell("D26"), cell("G26"), cell("H26")),
    buildCategoria("Pre-hipertensao", cell("C27"), cell("D27"), cell("G27"), cell("H27")),
    buildCategoria("HA Estagio 1", cell("C28"), cell("D28"), cell("G28"), cell("H28")),
    buildCategoria("HA Estagio 2", cell("C29"), cell("D29"), cell("G29"), cell("H29")),
    buildCategoria("HA Estagio 3", cell("C30"), cell("D30"), cell("G30"), cell("H30")),
  ];

  const glicemiaCapilar: CategoriaComparativa[] = [
    buildCategoria("<= 110", cell("C32"), cell("D32"), cell("G32"), cell("H32")),
    buildCategoria("> 110", cell("C33"), cell("D33"), cell("G33"), cell("H33")),
  ];

  return {
    tipo: "COMPARATIVO",
    empresa,
    idade,
    genero,
    imc,
    pressaoArterial,
    glicemiaCapilar,
  };
}

