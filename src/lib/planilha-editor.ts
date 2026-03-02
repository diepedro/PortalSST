import ExcelJS from "exceljs";

export type PlanilhaLinhaInput = {
  nome: string;
  idade: number;
  altura: number;
  peso: number;
  pa: string;
  fc: number;
  glicemia: number;
  comorbidades: string;
  sexo: number;
};

function toNumber(v: unknown): number {
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  const n = Number(String(v ?? "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function toText(v: unknown): string {
  if (v == null) return "";
  return String(v).trim();
}

export async function extrairDadosPlanilha(buffer: Buffer) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer as unknown as ArrayBuffer);
  const ws = workbook.worksheets[0];

  const linhas: PlanilhaLinhaInput[] = [];
  ws.eachRow((row, rowNumber) => {
    if (rowNumber < 7) return;
    const nome = toText(row.getCell(6).value);
    if (!nome) return;

    linhas.push({
      nome,
      idade: Math.round(toNumber(row.getCell(7).value)),
      altura: toNumber(row.getCell(8).value),
      peso: toNumber(row.getCell(9).value),
      pa: toText(row.getCell(10).value),
      fc: Math.round(toNumber(row.getCell(11).value)),
      glicemia: Math.round(toNumber(row.getCell(12).value)),
      comorbidades: toText(row.getCell(13).value),
      sexo: Math.round(toNumber(row.getCell(14).value)) || 1,
    });
  });

  return linhas;
}

export async function aplicarEdicaoDadosPlanilha(buffer: Buffer, linhas: PlanilhaLinhaInput[]) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer as unknown as ArrayBuffer);
  const ws = workbook.worksheets[0];

  for (let row = 7; row <= ws.rowCount; row += 1) {
    for (let col = 6; col <= 14; col += 1) {
      ws.getCell(row, col).value = null;
    }
  }

  linhas.forEach((item, idx) => {
    const row = 7 + idx;
    ws.getCell(row, 6).value = item.nome;
    ws.getCell(row, 7).value = item.idade;
    ws.getCell(row, 8).value = item.altura;
    ws.getCell(row, 9).value = item.peso;
    ws.getCell(row, 10).value = item.pa;
    ws.getCell(row, 11).value = item.fc;
    ws.getCell(row, 12).value = item.glicemia;
    ws.getCell(row, 13).value = item.comorbidades;
    ws.getCell(row, 14).value = item.sexo;
  });

  return Buffer.from(await workbook.xlsx.writeBuffer() as ArrayBuffer);
}
