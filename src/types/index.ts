export interface Participante {
  nome: string;
  idade: number;
  idadeFaixa: string;
  genero: number; // 1: F, 2: M
  imc: number;
  imcStatus: string;
  imcAlterado: boolean;
  pa: string;
  paStatus: string;
  paAlterado: boolean;
  glicemia: number;
  glicemiaStatus: string;
  glicemiaAlterado: boolean;
  fc: number;
  fcStatus: string;
  fcAlterado: boolean;
  comorbidades: string;
}

export interface DadosRelatorio {
  empresa: {
    nome: string;
    endereco: string;
    dataColeta: string;
    horario: string;
    qtdColaboradores: number;
  };
  adesao: {
    totalEquipe: number;
    totalParticipantes: number;
    percentualAdesao: number;
  };
  idade: {
    faixas: { label: string; valor: number }[];
    percentual18a30: number;
    percentualAcima50: number;
    mediaIdade: number;
  };
  genero: {
    feminino: number;
    masculino: number;
  };
  imc: {
    magreza: number;
    normal: number;
    sobrepeso: number;
    obesidade: number;
    obesidadeGrave: number;
  };
  pressaoArterial: {
    otima: number;
    normal: number;
    preHipertensao: number;
    hipertensaoEst1: number;
    hipertensaoEst2: number;
    hipertensaoEst3: number;
  };
  glicemia?: {
    normal: number; // <= 110 (legacy)
    alterada: number; // > 110 (legacy)
    hipoglicemia?: number;
    normoglicemia?: number;
    hiperglicemia?: number;
  };
  frequenciaCardiaca?: {
    normal: number; // (legacy)
    alterada: number; // (legacy)
    bradicardia?: number;
    normocardia?: number;
    taquicardia?: number;
  };
  participantes?: Participante[];
}

export interface CategoriaComparativa {
  nome: string;
  antes: { quantidade: number; percentual: number };
  depois: { quantidade: number; percentual: number };
}

export interface DadosRelatorioComparativo {
  tipo: "COMPARATIVO";
  empresa: {
    nome: string;
    endereco: string;
    primeiraData: string;
    segundaData: string;
  };
  idade: CategoriaComparativa[];
  genero: CategoriaComparativa[];
  imc: CategoriaComparativa[];
  pressaoArterial: CategoriaComparativa[];
  glicemiaCapilar: CategoriaComparativa[];
}

export interface DadosRelatorioNPS {
  tipo: "NPS";
  empresa: {
    nome: string;
    data: string;
    totalRespostas: number;
  };
  score: number; // % Promotores - % Detratores
  distribuicao: {
    promotores: { total: number; percentual: number };
    passivos: { total: number; percentual: number };
    detratores: { total: number; percentual: number };
  };
  notas: { nota: number; total: number }[]; // 0 a 10
}

export type DadosRelatorioAny = DadosRelatorio | DadosRelatorioComparativo | DadosRelatorioNPS;

export interface StatCardData {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: { value: number; positive: boolean };
}
