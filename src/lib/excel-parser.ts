import ExcelJS from "exceljs";
import { DadosRelatorio } from "@/types";
import { DadosRelatorioSchema } from "./validation";

/**
 * Extracts the actual value from an ExcelJS cell value.
 */
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
  if (typeof v === "number") return isNaN(v) ? 0 : v;
  const s = String(v).replace(",", ".").replace(/["%\s]/g, "").trim();
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}

function toInt(val: unknown): number {
  return Math.round(toFloat(val));
}

function capitalizeNome(nome: string): string {
  if (!nome) return "";
  return nome
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getIdadeFaixa(idade: number): string {
  if (idade <= 0) return "NÃ£o informado";
  if (idade <= 30) return "18-30";
  if (idade <= 40) return "31-40";
  if (idade <= 50) return "41-50";
  return ">50";
}

function getIMCStatus(imc: number): { status: string; alterado: boolean } {
  if (imc <= 0) return { status: "NÃ£o informado", alterado: false };
  if (imc < 18.5) return { status: "Baixo peso", alterado: true };
  if (imc < 25) return { status: "Peso normal", alterado: false };
  if (imc < 30) return { status: "Sobrepeso", alterado: true };
  if (imc < 35) return { status: "Obesidade Grau I", alterado: true };
  if (imc < 40) return { status: "Obesidade Grau II", alterado: true };
  return { status: "Obesidade Grau III", alterado: true };
}

function getPAStatus(pa: string): { status: string; alterado: boolean } {
  const raw = String(pa ?? "").trim();
  if (!raw) return { status: "NÃ£o informado", alterado: false };

  const nums = raw.match(/\d+/g)?.map((n) => parseInt(n, 10)) ?? [];
  let sis = 0;
  let dia = 0;

  if (nums.length >= 2) {
    sis = nums[0];
    dia = nums[1];
  } else if (nums.length === 1) {
    // Handles compact forms like 12080 / 128.
    const compact = nums[0];
    if (compact >= 10000) {
      sis = Math.floor(compact / 100);
      dia = compact % 100;
    } else if (compact >= 100) {
      sis = Math.floor(compact / 10);
      dia = compact % 10;
    }
  }

  // Handles shorthand values like 12/8 -> 120/80.
  if (sis > 0 && sis < 30 && dia > 0 && dia < 20) {
    sis *= 10;
    dia *= 10;
  }

  if (sis <= 0 || dia <= 0) return { status: "NÃ£o informado", alterado: false };

  if (sis <= 120 && dia < 80) return { status: "Normal", alterado: false };
  if (sis <= 139 && dia <= 89) return { status: "PrÃ©-HipertensÃ£o", alterado: true };
  if (sis <= 159 && dia <= 99) return { status: "HipertensÃ£o EstÃ¡gio 1", alterado: true };
  if (sis <= 179 && dia <= 109) return { status: "HipertensÃ£o EstÃ¡gio 2", alterado: true };
  return { status: "HipertensÃ£o EstÃ¡gio 3", alterado: true };
}

function getGlicemiaStatus(gc: number): { status: string; alterado: boolean } {
  if (gc === 0) return { status: "NÃ£o informado", alterado: false };
  if (gc < 70) return { status: "Hipoglicemia", alterado: true };
  if (gc < 100) return { status: "Normoglicemia", alterado: false };
  return { status: "Hiperglicemia", alterado: true };
}

function getFCStatus(fc: number): { status: string; alterado: boolean } {
  if (fc === 0) return { status: "NÃ£o informado", alterado: false };
  if (fc < 60) return { status: "Bradicardia", alterado: true };
  if (fc <= 100) return { status: "Normocardia", alterado: false };
  return { status: "Taquicardia", alterado: true };
}

function mapComorbidades(comorbidades: string): string {
  if (!comorbidades) return "Nega comorbidades";
  const c = comorbidades.toLowerCase().trim();
  if (c === "" || c.includes("ausÃªncia") || c.includes("nenhuma") || c.includes("nÃ£o possui") || c.includes("nega")) return "Nega comorbidades";
  return comorbidades.trim();
}

export async function parseExcel(buffer: Buffer): Promise<DadosRelatorio> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer as unknown as ArrayBuffer);
  const ws = workbook.worksheets[0];

  const cell = (ref: string): unknown => ws.getCell(ref).value;

  // â”€â”€ Company info â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const empresaNome = String(unwrap(cell("B1")) ?? "Empresa");
  const endereco = String(unwrap(cell("B2")) ?? "");
  // Novo layout da planilha: B1 Empresa, B2 Endereco, B3 Data, B4 Horario, B5 Total.
  // Fallback para layout antigo: B4 Data, B5 Horario, B6 Total.
  const profissional = "";
  const rawDate = unwrap(cell("B3")) ?? unwrap(cell("B4"));
  let dataColeta = "";
  if (rawDate instanceof Date) {
    dataColeta = rawDate.toLocaleDateString("pt-BR");
  } else {
    dataColeta = String(rawDate ?? "").split(" ")[0];
  }

  const horario = String(unwrap(cell("B4")) ?? unwrap(cell("B5")) ?? "").trim();
  const qtdColaboradores = toInt(unwrap(cell("B5")) ?? cell("B6"));

  // â”€â”€ Compute from raw data table (Row 8+) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const participantes: any[] = [];
  ws.eachRow((row, rowNumber) => {
    if (rowNumber < 8) return;
    
    // Novas Colunas: A (1) Nome, B (2) Idade, C (3) Altura, D (4) Peso, E (5) PA, F (6) FC, G (7) Glicemia, H (8) Comorbidades, I (9) Sexo, J (10) Telefone
    const nomeRaw = String(unwrap(row.getCell(1).value) ?? "");
    if (!nomeRaw) return;

    const idade = toInt(row.getCell(2).value);
    
    let altura = toFloat(row.getCell(3).value);
    if (altura > 3) altura = altura / 100;

    const peso = toFloat(row.getCell(4).value);
    const pa = String(unwrap(row.getCell(5).value) ?? "");
    const fc = toInt(row.getCell(6).value);
    const gc = toInt(row.getCell(7).value);
    const comorbRaw = String(unwrap(row.getCell(8).value) ?? "");
    const sexo = toInt(row.getCell(9).value); // 1=Fem, 2=Masc
    const telefone = String(unwrap(row.getCell(10).value) ?? "");

    const imc = (altura > 0 && peso > 0) ? peso / (altura * altura) : 0;
    const imcData = getIMCStatus(imc);
    const paData = getPAStatus(pa);
    const gcData = getGlicemiaStatus(gc);
    const fcData = getFCStatus(fc);

    participantes.push({
      nome: capitalizeNome(nomeRaw),
      idade,
      idadeFaixa: getIdadeFaixa(idade),
      genero: sexo,
      imc: imc > 0 ? parseFloat(imc.toFixed(1)) : 0,
      imcStatus: imcData.status,
      imcAlterado: imcData.alterado,
      pa,
      paStatus: paData.status,
      paAlterado: paData.alterado,
      glicemia: gc,
      glicemiaStatus: gcData.status,
      glicemiaAlterado: gcData.alterado,
      fc,
      fcStatus: fcData.status,
      fcAlterado: fcData.alterado,
      comorbidades: mapComorbidades(comorbRaw),
      telefone
    });
  });

  const totalParticipantes = participantes.length;
  const totalEquipe = qtdColaboradores || totalParticipantes;
  const idadesValidas = participantes.map((p) => p.idade).filter((idade) => idade > 0);

  const faixas = [
    { label: "18-30", valor: participantes.filter(p => p.idadeFaixa === "18-30").length },
    { label: "31-40", valor: participantes.filter(p => p.idadeFaixa === "31-40").length },
    { label: "41-50", valor: participantes.filter(p => p.idadeFaixa === "41-50").length },
    { label: ">50",   valor: participantes.filter(p => p.idadeFaixa === ">50").length },
    { label: "NÃ£o informado", valor: participantes.filter(p => p.idadeFaixa === "NÃ£o informado").length },
  ];

  const rawDados = {
    adesao: { totalEquipe, totalParticipantes, percentualAdesao: (totalParticipantes / (totalEquipe || 1)) * 100 },
    idade: {
      faixas,
      percentual18a30: (faixas[0].valor / (totalParticipantes || 1)) * 100,
      percentualAcima50: (faixas[3].valor / (totalParticipantes || 1)) * 100,
      mediaIdade: idadesValidas.reduce((acc, idade) => acc + idade, 0) / (idadesValidas.length || 1),
    },
    genero: {
      feminino: participantes.filter(p => p.genero === 1).length,
      masculino: participantes.filter(p => p.genero === 2).length,
    },
    imc: {
      magreza: participantes.filter(p => p.imcStatus === "Baixo peso").length,
      normal: participantes.filter(p => p.imcStatus === "Peso normal").length,
      sobrepeso: participantes.filter(p => p.imcStatus === "Sobrepeso").length,
      obesidade: participantes.filter(p => p.imcStatus === "Obesidade Grau I").length,
      obesidadeGrave: participantes.filter(p => p.imcStatus === "Obesidade Grau II" || p.imcStatus === "Obesidade Grau III").length, 
    },
    pressaoArterial: {
      otima: 0,
      normal: participantes.filter(p => p.paStatus === "Normal").length,
      preHipertensao: participantes.filter(p => p.paStatus === "PrÃ©-HipertensÃ£o").length,
      hipertensaoEst1: participantes.filter(p => p.paStatus === "HipertensÃ£o EstÃ¡gio 1").length,
      hipertensaoEst2: participantes.filter(p => p.paStatus === "HipertensÃ£o EstÃ¡gio 2").length,
      hipertensaoEst3: participantes.filter(p => p.paStatus === "HipertensÃ£o EstÃ¡gio 3").length,
    },
    glicemia: {
      normal: participantes.filter(p => p.glicemiaStatus === "Normoglicemia").length,
      alterada: participantes.filter(p => p.glicemiaStatus === "Hipoglicemia" || p.glicemiaStatus === "Hiperglicemia").length,
      hipoglicemia: participantes.filter(p => p.glicemiaStatus === "Hipoglicemia").length,
      normoglicemia: participantes.filter(p => p.glicemiaStatus === "Normoglicemia").length,
      hiperglicemia: participantes.filter(p => p.glicemiaStatus === "Hiperglicemia").length,
    },
    frequenciaCardiaca: {
      normal: participantes.filter(p => p.fcStatus === "Normocardia").length,
      alterada: participantes.filter(p => p.fcStatus === "Bradicardia" || p.fcStatus === "Taquicardia").length,
      bradicardia: participantes.filter(p => p.fcStatus === "Bradicardia").length,
      normocardia: participantes.filter(p => p.fcStatus === "Normocardia").length,
      taquicardia: participantes.filter(p => p.fcStatus === "Taquicardia").length,
    },
    comorbidades: {
      has: participantes.filter(p => p.comorbidades.toLowerCase().includes("hipertensÃ£o") || p.comorbidades.toLowerCase().includes("has")).length,
      cardiovascular: participantes.filter(p => p.comorbidades.toLowerCase().includes("cardio") || p.comorbidades.toLowerCase().includes("coracao")).length,
      diabetes: participantes.filter(p => p.comorbidades.toLowerCase().includes("diabetes") || p.comorbidades.toLowerCase().includes("glicemiante")).length,
      dislipidemia: participantes.filter(p => p.comorbidades.toLowerCase().includes("dislipidemia") || p.comorbidades.toLowerCase().includes("colesterol") || p.comorbidades.toLowerCase().includes("trigliceri")).length,
      tireoide: participantes.filter(p => p.comorbidades.toLowerCase().includes("tireoide")).length,
      imunossupressora: participantes.filter(p => p.comorbidades.toLowerCase().includes("imunossup")).length,
      respiratoria: participantes.filter(p => p.comorbidades.toLowerCase().includes("asma") || p.comorbidades.toLowerCase().includes("dpoc") || p.comorbidades.toLowerCase().includes("respiratoria")).length,
      saudeMental: participantes.filter(p => p.comorbidades.toLowerCase().includes("depressao") || p.comorbidades.toLowerCase().includes("ansiedade") || p.comorbidades.toLowerCase().includes("mental")).length,
      tabagismo: participantes.filter(p => p.comorbidades.toLowerCase().includes("tabagismo") || p.comorbidades.toLowerCase().includes("fuma")).length,
      etilismo: participantes.filter(p => p.comorbidades.toLowerCase().includes("etilismo") || p.comorbidades.toLowerCase().includes("Ã¡lcool") || p.comorbidades.toLowerCase().includes("bebe")).length,
    },
    participantes
  };

  const finalData = {
    empresa: {
      nome: empresaNome,
      endereco,
      profissional,
      dataColeta,
      horario,
      qtdColaboradores,
    },
    ...rawDados
  };

  const result = DadosRelatorioSchema.safeParse(finalData);
  if (!result.success) {
    console.error("Erro na validaÃ§Ã£o do Excel:", result.error.format());
    return finalData as DadosRelatorio;
  }

  return result.data as DadosRelatorio;
}


