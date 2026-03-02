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
  if (idade <= 30) return "18-30";
  if (idade <= 40) return "31-40";
  if (idade <= 50) return "41-50";
  return ">50";
}

function getIMCStatus(imc: number): { status: string; alterado: boolean } {
  if (imc < 18.5) return { status: "Abaixo do peso", alterado: true };
  if (imc < 25) return { status: "Peso normal", alterado: false };
  if (imc < 30) return { status: "Sobrepeso", alterado: true };
  return { status: "Obesidade", alterado: true };
}

function getPAStatus(pa: string): { status: string; alterado: boolean } {
  const normalized = pa.replace(".", "/");
  const match = normalized.match(/(\d+)\/(\d+)/);
  if (!match) return { status: "Não informado", alterado: false };

  const sis = parseInt(match[1]);
  const dia = parseInt(match[2]);

  if (sis < 120 && dia < 80) return { status: "Normal", alterado: false };
  if (sis < 130 && dia < 80) return { status: "Elevada", alterado: true };
  if (sis < 140 && dia < 90) return { status: "Hipertensão Estágio 1", alterado: true };
  return { status: "Hipertensão Estágio 2", alterado: true };
}

function getGlicemiaStatus(gc: number): { status: string; alterado: boolean } {
  if (gc === 0) return { status: "Não informado", alterado: false };
  if (gc < 70) return { status: "Hipoglicemia", alterado: true };
  if (gc < 100) return { status: "Normoglicemia", alterado: false };
  return { status: "Hiperglicemia", alterado: true };
}

function getFCStatus(fc: number): { status: string; alterado: boolean } {
  if (fc === 0) return { status: "Não informado", alterado: false };
  if (fc < 60) return { status: "Bradicardia", alterado: true };
  if (fc <= 100) return { status: "Normocardia", alterado: false };
  return { status: "Taquicardia", alterado: true };
}

function mapComorbidades(comorbidades: string): string {
  if (!comorbidades) return "Saudável";
  const c = comorbidades.toLowerCase();
  if (c.includes("ausência") || c.includes("nenhuma") || c.includes("não possui")) return "Saudável";
  
  const groups: string[] = [];
  if (c.includes("ansiedade") || c.includes("depressão")) groups.push("Tratamento Mental");
  if (c.includes("tabagista") || c.includes("fuma")) groups.push("Fumante");
  if (c.includes("etilismo") || c.includes("álcool") || c.includes("bebe")) groups.push("Abuso de Álcool");
  if (c.includes("anti-hipertensivo") || c.includes("pressão")) groups.push("Hipertensão Arterial");
  if (c.includes("antiglicemiante") || c.includes("diabetes") || c.includes("insulina")) groups.push("Diabetes Mellitus");
  
  if (groups.length === 0) return comorbidades.trim();
  return groups.join(", ");
}

export async function parseExcel(buffer: Buffer): Promise<DadosRelatorio> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer as unknown as ArrayBuffer);
  const ws = workbook.worksheets[0];

  const cell = (ref: string): unknown => ws.getCell(ref).value;

  // ── Company info ──────────────────────────────────────────────────────────
  const empresaNome = String(unwrap(cell("B1")) ?? "").trim();
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

  // ── Compute from raw data table (Row 7+) ───────────────────────────────
  const participantes: any[] = [];
  ws.eachRow((row, rowNumber) => {
    if (rowNumber < 7) return;
    
    // Nome: F (6), Idade: G (7), Altura: H (8), Peso: I (9), PA: J (10), FC: K (11), Glicemia: L (12), Comorbidades: M (13), Sexo: N (14)
    const nomeRaw = String(unwrap(row.getCell(6).value) ?? "");
    if (!nomeRaw) return;

    const idade = toInt(row.getCell(7).value);
    
    // Altura (H): Se > 3, assume que está em cm (ex: 170) e converte para metros (1.70)
    let altura = toFloat(row.getCell(8).value);
    if (altura > 3) altura = altura / 100;

    const peso = toFloat(row.getCell(9).value);
    const pa = String(unwrap(row.getCell(10).value) ?? "");
    const fc = toInt(row.getCell(11).value);
    const gc = toInt(row.getCell(12).value);
    const comorbRaw = String(unwrap(row.getCell(13).value) ?? "");
    const sexo = toInt(row.getCell(14).value); // 1=Fem, 2=Masc

    const imc = altura > 0 ? peso / (altura * altura) : 0;
    const imcData = getIMCStatus(imc);
    const paData = getPAStatus(pa);
    const gcData = getGlicemiaStatus(gc);
    const fcData = getFCStatus(fc);

    participantes.push({
      nome: capitalizeNome(nomeRaw),
      idade,
      idadeFaixa: getIdadeFaixa(idade),
      genero: sexo,
      imc: parseFloat(imc.toFixed(1)),
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
      comorbidades: mapComorbidades(comorbRaw)
    });
  });

  const totalParticipantes = participantes.length;
  const totalEquipe = qtdColaboradores || totalParticipantes;

  const faixas = [
    { label: "18-30", valor: participantes.filter(p => p.idadeFaixa === "18-30").length },
    { label: "31-40", valor: participantes.filter(p => p.idadeFaixa === "31-40").length },
    { label: "41-50", valor: participantes.filter(p => p.idadeFaixa === "41-50").length },
    { label: ">50",   valor: participantes.filter(p => p.idadeFaixa === ">50").length },
  ];

  const rawDados = {
    adesao: { totalEquipe, totalParticipantes, percentualAdesao: (totalParticipantes / (totalEquipe || 1)) * 100 },
    idade: {
      faixas,
      percentual18a30: (faixas[0].valor / (totalParticipantes || 1)) * 100,
      percentualAcima50: (faixas[3].valor / (totalParticipantes || 1)) * 100,
      mediaIdade: participantes.reduce((acc, p) => acc + p.idade, 0) / (totalParticipantes || 1),
    },
    genero: {
      feminino: participantes.filter(p => p.genero === 1).length,
      masculino: participantes.filter(p => p.genero === 2).length,
    },
    imc: {
      magreza: participantes.filter(p => p.imcStatus === "Abaixo do peso").length / (totalParticipantes || 1),
      normal: participantes.filter(p => p.imcStatus === "Peso normal").length / (totalParticipantes || 1),
      sobrepeso: participantes.filter(p => p.imcStatus === "Sobrepeso").length / (totalParticipantes || 1),
      obesidade: participantes.filter(p => p.imcStatus === "Obesidade").length / (totalParticipantes || 1),
      obesidadeGrave: 0, 
    },
    pressaoArterial: {
      otima: participantes.filter(p => p.paStatus === "Normal").length,
      normal: 0,
      preHipertensao: participantes.filter(p => p.paStatus === "Elevada").length,
      hipertensaoEst1: participantes.filter(p => p.paStatus === "Hipertensão Estágio 1").length,
      hipertensaoEst2: participantes.filter(p => p.paStatus === "Hipertensão Estágio 2").length,
      hipertensaoEst3: 0,
    },
    glicemia: {
      normal: participantes.filter(p => !p.glicemiaAlterado).length,
      alterada: participantes.filter(p => p.glicemiaAlterado).length,
      hipoglicemia: participantes.filter(p => p.glicemiaStatus === "Hipoglicemia").length,
      normoglicemia: participantes.filter(p => p.glicemiaStatus === "Normoglicemia").length,
      hiperglicemia: participantes.filter(p => p.glicemiaStatus === "Hiperglicemia").length,
    },
    frequenciaCardiaca: {
      normal: participantes.filter(p => !p.fcAlterado).length,
      alterada: participantes.filter(p => p.fcAlterado).length,
      bradicardia: participantes.filter(p => p.fcStatus === "Bradicardia").length,
      normocardia: participantes.filter(p => p.fcStatus === "Normocardia").length,
      taquicardia: participantes.filter(p => p.fcStatus === "Taquicardia").length,
    },
    participantes
  };

  const finalData = {
    empresa: {
      nome: empresaNome,
      endereco,
      dataColeta,
      horario,
      qtdColaboradores,
    },
    ...rawDados
  };

  const result = DadosRelatorioSchema.safeParse(finalData);
  if (!result.success) {
    console.error("Erro na validação do Excel:", result.error.format());
    return finalData as DadosRelatorio;
  }

  return result.data as DadosRelatorio;
}
