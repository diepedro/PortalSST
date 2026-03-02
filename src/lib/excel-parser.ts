import ExcelJS from "exceljs";
import { DadosRelatorio } from "@/types";

/**
 * Extracts the actual value from an ExcelJS cell value.
 * ExcelJS returns formula cells as { formula: string, result: value }
 * or { sharedFormula: string, result: value }, NOT as raw numbers.
 * This function unwraps those objects to get the real value.
 */
function unwrap(val: unknown): unknown {
  if (val === null || val === undefined) return null;

  // Formula cell: { formula: "=...", result: 5 }
  // Shared formula cell: { sharedFormula: "...", result: 5 }
  if (typeof val === "object" && !Array.isArray(val)) {
    const obj = val as Record<string, unknown>;
    if ("result" in obj) return obj.result;
    // Rich text cell: { richText: [{text: "foo"}, ...] }
    if ("richText" in obj && Array.isArray(obj.richText)) {
      return (obj.richText as { text: string }[]).map((r) => r.text).join("");
    }
    // Error value: { error: "#DIV/0!" }
    if ("error" in obj) return 0;
  }

  return val;
}

function toFloat(val: unknown): number {
  const v = unwrap(val);
  if (v == null) return 0;
  if (typeof v === "number") return isNaN(v) ? 0 : v;
  const s = String(v).replace(",", ".").replace(/["%\s]/g, "").trim();
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}

function toInt(val: unknown): number {
  return Math.round(toFloat(val));
}

export async function parseExcel(buffer: Buffer): Promise<DadosRelatorio> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer as unknown as ArrayBuffer);
  const ws = workbook.worksheets[0];

  // Returns the raw ExcelJS cell value (may be formula object, number, string, Date, etc.)
  const cell = (ref: string): unknown => ws.getCell(ref).value;

  // ── Company info ──────────────────────────────────────────────────────────
  const empresa = String(unwrap(cell("B1")) ?? "").trim();
  const endereco = String(unwrap(cell("B2")) ?? "").trim();

  const rawDate = unwrap(cell("B3"));
  let dataColeta = "";
  if (rawDate instanceof Date) {
    dataColeta = rawDate.toLocaleDateString("pt-BR");
  } else {
    dataColeta = String(rawDate ?? "").split(" ")[0];
  }

  const horario = String(unwrap(cell("B4")) ?? "").trim();
  const qtdColaboradores = toInt(cell("B5"));

  // ── Adhesion ──────────────────────────────────────────────────────────────
  const totalEquipe = toInt(cell("N7"));
  const totalParticipantes = toInt(cell("N8"));
  // Always compute from actual counts — N9 formula varies across files
  // (some sheets use =N8/N7, others =(N8/N7)*100, causing 170% instead of 58%)
  const percentualAdesao = totalEquipe > 0
    ? (totalParticipantes / totalEquipe) * 100
    : 0;

  // ── Age ranges ────────────────────────────────────────────────────────────
  // P7-P10: counts per age bracket
  const faixas = [
    { label: "18-30", valor: toFloat(cell("P7")) },
    { label: "31-40", valor: toFloat(cell("P8")) },
    { label: "41-50", valor: toFloat(cell("P9")) },
    { label: "50+",   valor: toFloat(cell("P10")) },
  ];

  // R8, R10: percentages; R12: average age — may be decimals or %
  const rawR8  = toFloat(cell("R8"));
  const rawR10 = toFloat(cell("R10"));
  const percentual18a30    = rawR8  > 0 && rawR8  <= 1 ? rawR8  * 100 : rawR8;
  const percentualAcima50  = rawR10 > 0 && rawR10 <= 1 ? rawR10 * 100 : rawR10;
  const mediaIdade = toFloat(cell("R12"));

  // ── Gender ────────────────────────────────────────────────────────────────
  // Q14 = feminino proportion, Q15 = masculino proportion (values like 0.35 / 0.65)
  const feminino  = toFloat(cell("Q14"));
  const masculino = toFloat(cell("Q15"));

  // ── BMI ───────────────────────────────────────────────────────────────────
  // Q18-Q22: proportions (e.g. 0.05, 0.42, 0.35, 0.15, 0.03)
  const magreza       = toFloat(cell("Q18"));
  const normal        = toFloat(cell("Q19"));
  const sobrepeso     = toFloat(cell("Q20"));
  const obesidade     = toFloat(cell("Q21"));
  const obesidadeGrave = toFloat(cell("Q22"));

  // ── Blood pressure ────────────────────────────────────────────────────────
  // P25-P30: counts (direct integer values — no formulas, that is why they worked before)
  const otima           = toFloat(cell("P25"));
  const paNormal        = toFloat(cell("P26"));
  const preHipertensao  = toFloat(cell("P27"));
  const hipertensaoEst1 = toFloat(cell("P28"));
  const hipertensaoEst2 = toFloat(cell("P29"));
  const hipertensaoEst3 = toFloat(cell("P30"));

  return {
    empresa:  { nome: empresa, endereco, dataColeta, horario, qtdColaboradores },
    adesao:   { totalEquipe, totalParticipantes, percentualAdesao },
    idade:    { faixas, percentual18a30, percentualAcima50, mediaIdade },
    genero:   { feminino, masculino },
    imc:      { magreza, normal, sobrepeso, obesidade, obesidadeGrave },
    pressaoArterial: {
      otima,
      normal: paNormal,
      preHipertensao,
      hipertensaoEst1,
      hipertensaoEst2,
      hipertensaoEst3,
    },
  };
}
