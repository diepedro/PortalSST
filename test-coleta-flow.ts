import { buildSaudeWorkbookFromColeta } from "./src/lib/coleta-workbook";
import { parseExcel } from "./src/lib/excel-parser";

async function runTest() {
  console.log("Iniciando teste de fluxo de coleta...");

  const mockPayload = {
    empresa: {
      nome: "Empresa Teste LTDA",
      endereco: "Rua dos Testes, 123",
      profissional: "Dr. Teste da Silva",
      dataColeta: "03/03/2026",
      horario: "08:00 - 12:00",
      qtdColaboradores: 10,
    },
    participantes: [
      {
        nome: "Joao Alvo",
        idade: 30,
        altura: 1.75,
        peso: 80,
        pa: "120/80",
        fc: 70,
        glicemia: 95,
        comorbidades: "Nega comorbidades",
        sexo: 2,
        telefone: "(11) 99999-9999",
      },
      {
        nome: "Maria Silva",
        idade: 45,
        altura: 1.60,
        peso: 70,
        pa: "140/90",
        fc: 80,
        glicemia: 110,
        comorbidades: "Hipertensao Arterial Sistêmica (HAS), Diabetes Mellitus",
        sexo: 1,
        telefone: "(11) 88888-8888",
      }
    ],
  };

  try {
    console.log("1. Gerando workbook...");
    const buffer = await buildSaudeWorkbookFromColeta(mockPayload as any);
    
    console.log("2. Parsing workbook...");
    const dados = await parseExcel(buffer);

    console.log("--- RESULTADOS DO PARSE ---");
    console.log("Empresa:", dados.empresa.nome);
    console.log("Endereço:", dados.empresa.endereco);
    console.log("Profissional:", dados.empresa.profissional);
    console.log("Data:", dados.empresa.dataColeta);
    console.log("Horário:", dados.empresa.horario);
    console.log("Qtd Colaboradores (Metadata):", dados.empresa.qtdColaboradores);
    console.log("Participantes encontrados:", dados.participantes?.length);

    // Validações básicas
    if (dados.empresa.nome !== mockPayload.empresa.nome) throw new Error("Nome da empresa incorreto");
    if (dados.empresa.profissional !== mockPayload.empresa.profissional) throw new Error("Profissional incorreto");
    if (dados.participantes?.length !== mockPayload.participantes.length) throw new Error("Número de participantes incorreto");

    const p1 = dados.participantes![0];
    console.log("Participante 1:", p1.nome);
    console.log("Telefone 1:", p1.telefone);
    console.log("IMC 1:", p1.imc, p1.imcStatus);

    if (p1.telefone !== mockPayload.participantes[0].telefone) throw new Error("Telefone do participante 1 incorreto");

    const p2 = dados.participantes![1];
    console.log("Participante 2:", p2.nome);
    console.log("Comorbidades 2:", p2.comorbidades);
    console.log("PA Status 2:", p2.paStatus);

    console.log("✅ Teste concluído com sucesso!");
  } catch (error) {
    console.error("Erro no teste:", error);
    process.exit(1);
  }
}

runTest();
