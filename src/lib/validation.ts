import { z } from "zod";

export const DadosRelatorioSchema = z.object({
  empresa: z.object({
    nome: z.string().min(1, "Nome da empresa é obrigatório"),
    endereco: z.string().optional().default(""),
    profissional: z.string().optional().default(""),
    dataColeta: z.string().optional().default(""),
    horario: z.string().optional().default(""),
    qtdColaboradores: z.number().nonnegative().default(0),
  }),
  adesao: z.object({
    totalEquipe: z.number().nonnegative().default(0),
    totalParticipantes: z.number().nonnegative().default(0),
    percentualAdesao: z.number().nonnegative().default(0),
  }),
  idade: z.object({
    faixas: z.array(z.object({
      label: z.string(),
      valor: z.number().nonnegative(),
    })),
    percentual18a30: z.number().nonnegative().default(0),
    percentualAcima50: z.number().nonnegative().default(0),
    mediaIdade: z.number().nonnegative().default(0),
  }),
  genero: z.object({
    feminino: z.number().nonnegative().default(0),
    masculino: z.number().nonnegative().default(0),
  }),
  imc: z.object({
    magreza: z.number().nonnegative().default(0),
    normal: z.number().nonnegative().default(0),
    sobrepeso: z.number().nonnegative().default(0),
    obesidade: z.number().nonnegative().default(0),
    obesidadeGrave: z.number().nonnegative().default(0),
  }),
  pressaoArterial: z.object({
    otima: z.number().nonnegative().default(0),
    normal: z.number().nonnegative().default(0),
    preHipertensao: z.number().nonnegative().default(0),
    hipertensaoEst1: z.number().nonnegative().default(0),
    hipertensaoEst2: z.number().nonnegative().default(0),
    hipertensaoEst3: z.number().nonnegative().default(0),
  }),
  glicemia: z.object({
    normal: z.number().nonnegative().default(0),
    alterada: z.number().nonnegative().default(0),
    hipoglicemia: z.number().nonnegative().optional(),
    normoglicemia: z.number().nonnegative().optional(),
    hiperglicemia: z.number().nonnegative().optional(),
  }).optional(),
  frequenciaCardiaca: z.object({
    normal: z.number().nonnegative().default(0),
    alterada: z.number().nonnegative().default(0),
    bradicardia: z.number().nonnegative().optional(),
    normocardia: z.number().nonnegative().optional(),
    taquicardia: z.number().nonnegative().optional(),
  }).optional(),
  comorbidades: z.object({
    has: z.number().nonnegative().default(0),
    cardiovascular: z.number().nonnegative().default(0),
    diabetes: z.number().nonnegative().default(0),
    dislipidemia: z.number().nonnegative().default(0),
    tireoide: z.number().nonnegative().default(0),
    imunossupressora: z.number().nonnegative().default(0),
    respiratoria: z.number().nonnegative().default(0),
    saudeMental: z.number().nonnegative().default(0),
    tabagismo: z.number().nonnegative().default(0),
    etilismo: z.number().nonnegative().default(0),
  }).optional(),
  participantes: z.array(z.object({
    nome: z.string(),
    idade: z.number(),
    idadeFaixa: z.string(),
    genero: z.number(),
    imc: z.number(),
    imcStatus: z.string(),
    imcAlterado: z.boolean(),
    pa: z.string(),
    paStatus: z.string(),
    paAlterado: z.boolean(),
    glicemia: z.number(),
    glicemiaStatus: z.string(),
    glicemiaAlterado: z.boolean(),
    fc: z.number(),
    fcStatus: z.string(),
    fcAlterado: z.boolean(),
    comorbidades: z.string(),
    telefone: z.string().optional(),
  })).optional(),
});

export const CategoriaComparativaSchema = z.object({
  nome: z.string(),
  antes: z.object({
    quantidade: z.number().nonnegative(),
    percentual: z.number().nonnegative(),
  }),
  depois: z.object({
    quantidade: z.number().nonnegative(),
    percentual: z.number().nonnegative(),
  }),
});

export const DadosRelatorioComparativoSchema = z.object({
  tipo: z.literal("COMPARATIVO"),
  empresa: z.object({
    nome: z.string().min(1),
    endereco: z.string().optional().default(""),
    primeiraData: z.string().optional().default(""),
    segundaData: z.string().optional().default(""),
  }),
  idade: z.array(CategoriaComparativaSchema),
  genero: z.array(CategoriaComparativaSchema),
  imc: z.array(CategoriaComparativaSchema),
  pressaoArterial: z.array(CategoriaComparativaSchema),
  glicemiaCapilar: z.array(CategoriaComparativaSchema),
});

export const DadosRelatorioNPSSchema = z.object({
  tipo: z.literal("NPS"),
  empresa: z.object({
    nome: z.string().min(1),
    data: z.string(),
    totalRespostas: z.number().nonnegative(),
  }),
  score: z.number(),
  distribuicao: z.object({
    promotores: z.object({ total: z.number().nonnegative(), percentual: z.number().nonnegative() }),
    passivos: z.object({ total: z.number().nonnegative(), percentual: z.number().nonnegative() }),
    detratores: z.object({ total: z.number().nonnegative(), percentual: z.number().nonnegative() }),
  }),
  notas: z.array(z.object({
    nota: z.number(),
    total: z.number().nonnegative(),
  })),
});
