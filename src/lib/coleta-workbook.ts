import ExcelJS from "exceljs";

type ColetaPayload = {
  empresa: {
    nome: string;
    endereco?: string;
    profissional?: string;
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
    telefone?: string;
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

  // Header da tabela na linha 7
  ws.getCell("A7").value = "Nome";
  ws.getCell("B7").value = "Idade";
  ws.getCell("C7").value = "Altura";
  ws.getCell("D7").value = "Peso";
  ws.getCell("E7").value = "PA";
  ws.getCell("F7").value = "FC";
  ws.getCell("G7").value = "Glicemia";
  ws.getCell("H7").value = "Comorbidades";
  ws.getCell("I7").value = "Sexo";
  ws.getCell("J7").value = "Telefone";

  // Dados comecam na linha 8
  payload.participantes.forEach((p, idx) => {
    const row = 8 + idx;
    ws.getCell(row, 1).value = p.nome;
    ws.getCell(row, 2).value = p.idade;
    ws.getCell(row, 3).value = p.altura;
    ws.getCell(row, 4).value = p.peso;
    ws.getCell(row, 5).value = p.pa;
    ws.getCell(row, 6).value = p.fc;
    ws.getCell(row, 7).value = p.glicemia;
    ws.getCell(row, 8).value = p.comorbidades;
    ws.getCell(row, 9).value = p.sexo;
    ws.getCell(row, 10).value = p.telefone || "";
  });

  ws.columns = [
    { width: 32 },
    { width: 10 },
    { width: 10 },
    { width: 10 },
    { width: 12 },
    { width: 10 },
    { width: 12 },
    { width: 32 },
    { width: 8 },
    { width: 18 },
  ];

  return Buffer.from((await workbook.xlsx.writeBuffer()) as ArrayBuffer);
}
