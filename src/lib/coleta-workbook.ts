import ExcelJS from "exceljs";

type ColetaPayload = {
  empresa: {
    nome: string;
    endereco?: string;
    dataColeta: string;
    horario?: string;
    qtdColaboradores?: number;
  };
  participantes: Array<{
    nome: string;
    idade: number;
    altura: number;
    peso: number;
    pa: string;
    fc: number;
    glicemia: number;
    comorbidades: string;
    sexo: number;
  }>;
};

export async function buildSaudeWorkbookFromColeta(payload: ColetaPayload) {
  const workbook = new ExcelJS.Workbook();
  const ws = workbook.addWorksheet("Coleta");

  ws.getCell("A1").value = "Empresa:";
  ws.getCell("B1").value = payload.empresa.nome;

  ws.getCell("A2").value = "Endereco:";
  ws.getCell("B2").value = payload.empresa.endereco || "";

  ws.getCell("A3").value = "Data da Coleta:";
  ws.getCell("B3").value = payload.empresa.dataColeta;

  ws.getCell("A4").value = "Horario:";
  ws.getCell("B4").value = payload.empresa.horario || "";

  ws.getCell("A5").value = "Total de Colaboradores:";
  ws.getCell("B5").value = payload.empresa.qtdColaboradores || payload.participantes.length;

  ws.getCell("F6").value = "Nome";
  ws.getCell("G6").value = "Idade";
  ws.getCell("H6").value = "Altura";
  ws.getCell("I6").value = "Peso";
  ws.getCell("J6").value = "PA";
  ws.getCell("K6").value = "FC";
  ws.getCell("L6").value = "Glicemia";
  ws.getCell("M6").value = "Comorbidades";
  ws.getCell("N6").value = "Sexo";

  payload.participantes.forEach((p, idx) => {
    const row = 7 + idx;
    ws.getCell(row, 6).value = p.nome;
    ws.getCell(row, 7).value = p.idade;
    ws.getCell(row, 8).value = p.altura;
    ws.getCell(row, 9).value = p.peso;
    ws.getCell(row, 10).value = p.pa;
    ws.getCell(row, 11).value = p.fc;
    ws.getCell(row, 12).value = p.glicemia;
    ws.getCell(row, 13).value = p.comorbidades;
    ws.getCell(row, 14).value = p.sexo;
  });

  ws.columns = [
    { width: 16 },
    { width: 32 },
    { width: 14 },
    { width: 14 },
    { width: 14 },
    { width: 28 },
    { width: 10 },
    { width: 10 },
    { width: 10 },
    { width: 12 },
    { width: 10 },
    { width: 12 },
    { width: 28 },
    { width: 8 },
  ];

  return Buffer.from((await workbook.xlsx.writeBuffer()) as ArrayBuffer);
}
