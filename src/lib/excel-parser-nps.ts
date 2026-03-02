import ExcelJS from "exceljs";
import { DadosRelatorioNPS } from "@/types";
import { DadosRelatorioNPSSchema } from "./validation";

function unwrap(val: unknown): unknown {
  if (val === null || val === undefined) return null;
  if (typeof val === "object" && !Array.isArray(val)) {
    const obj = val as Record<string, unknown>;
    if ("result" in obj) return obj.result;
    return null;
  }
  return val;
}

export async function parseExcelNPS(buffer: Buffer): Promise<DadosRelatorioNPS> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer as unknown as ArrayBuffer);
  const ws = workbook.worksheets[0];

  const empresaNome = String(unwrap(ws.getCell("B1").value) ?? "Empresa não identificada").trim();
  const dataRelatorio = String(unwrap(ws.getCell("B2").value) ?? new Date().toLocaleDateString("pt-BR"));

  const scores: number[] = [];
  // Assuming scores are in a column starting from row 5
  ws.eachRow((row, rowNumber) => {
    if (rowNumber < 5) return;
    // Look for a number between 0 and 10 in the first few columns
    for (let i = 1; i <= 5; i++) {
      const val = row.getCell(i).value;
      const n = typeof val === "number" ? val : parseFloat(String(val));
      if (!isNaN(n) && n >= 0 && n <= 10) {
        scores.push(n);
        break; 
      }
    }
  });

  const total = scores.length || 1;
  const promotores = scores.filter(s => s >= 9).length;
  const passivos = scores.filter(s => s >= 7 && s <= 8).length;
  const detratores = scores.filter(s => s <= 6).length;

  const npsScore = ((promotores - detratores) / total) * 100;

  const distribuicao = {
    promotores: { total: promotores, percentual: (promotores / total) * 100 },
    passivos: { total: passivos, percentual: (passivos / total) * 100 },
    detratores: { total: detratores, percentual: (detratores / total) * 100 },
  };

  const notasMap: Record<number, number> = {};
  for (let i = 0; i <= 10; i++) notasMap[i] = 0;
  scores.forEach(s => {
    const rounded = Math.round(s);
    if (notasMap[rounded] !== undefined) notasMap[rounded]++;
  });

  const notas = Object.entries(notasMap).map(([nota, qtd]) => ({
    nota: parseInt(nota),
    total: qtd,
  }));

  const finalData = {
    tipo: "NPS" as const,
    empresa: {
      nome: empresaNome,
      data: dataRelatorio,
      totalRespostas: scores.length,
    },
    score: npsScore,
    distribuicao,
    notas,
  };

  const result = DadosRelatorioNPSSchema.safeParse(finalData);
  if (!result.success) {
    return finalData as DadosRelatorioNPS;
  }

  return result.data as DadosRelatorioNPS;
}
