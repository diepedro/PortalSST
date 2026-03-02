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

export type DadosRelatorioAny = DadosRelatorio | DadosRelatorioComparativo;

export interface StatCardData {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: { value: number; positive: boolean };
}
