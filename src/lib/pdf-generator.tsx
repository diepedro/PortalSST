import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { DadosRelatorio } from "@/types";

const palette = {
  navy: "#071A3D",
  slate: "#334155",
  slateSoft: "#E2E8F0",
  bg: "#F5F8FF",
  white: "#FFFFFF",
  moss: "#1FA15A",
  mossSoft: "#DDF9EA",
  amber: "#F59E0B",
  amberSoft: "#FFF2CC",
  wine: "#C1123F",
  wineSoft: "#FFE0E9",
  blueStrong: "#1E40FF",
  blueSoft: "#DDE7FF",
  cyanStrong: "#06B6D4",
  violetStrong: "#7C3AED",
  orangeStrong: "#F97316",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 32,
    paddingBottom: 46,
    paddingHorizontal: 52,
    fontFamily: "Helvetica",
    color: palette.navy,
    backgroundColor: palette.white,
  },
  coverShapeOne: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 240,
    height: 240,
    borderBottomLeftRadius: 240,
    backgroundColor: "#153B8A",
  },
  coverShapeTwo: {
    position: "absolute",
    top: 82,
    right: 66,
    width: 132,
    height: 132,
    borderRadius: 132,
    backgroundColor: "#2455C3",
  },
  coverPage: {
    backgroundColor: palette.navy,
  },
  coverBlock: {
    flex: 1,
    justifyContent: "space-between",
  },
  coverTop: {
    borderBottomWidth: 1,
    borderBottomColor: "#2F5FBF",
    paddingBottom: 24,
  },
  coverTitle: {
    fontSize: 42,
    lineHeight: 1.15,
    fontWeight: "bold",
    marginTop: 12,
    color: palette.white,
  },
  coverSubtitle: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 1.4,
    color: "#D7E4FF",
  },
  coverMeta: {
    marginTop: 22,
    borderWidth: 1,
    borderColor: "#2F5FBF",
    borderRadius: 8,
    backgroundColor: "#0D2A61",
    padding: 14,
  },
  metaLabel: {
    fontSize: 8,
    textTransform: "uppercase",
    color: "#BFD4FF",
    marginBottom: 3,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: "bold",
    color: palette.white,
    marginBottom: 8,
  },
  paletteRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  paletteDot: {
    width: 9,
    height: 9,
    borderRadius: 99,
    marginRight: 5,
  },
  paletteText: {
    fontSize: 7,
    color: "#D7E4FF",
    marginRight: 10,
  },
  coverFooter: {
    borderTopWidth: 1,
    borderTopColor: "#2F5FBF",
    paddingTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  coverFooterText: {
    fontSize: 8,
    color: "#BFD4FF",
  },
  coverTag: {
    fontSize: 8,
    color: palette.white,
    backgroundColor: "#2455C3",
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  header: {
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: palette.slateSoft,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: palette.blueStrong,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 9,
    color: palette.slate,
    marginTop: 3,
    textAlign: "center",
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12.5,
    fontWeight: "bold",
    color: palette.blueStrong,
    marginBottom: 6,
    textAlign: "center",
    backgroundColor: "#EAF0FF",
    paddingVertical: 4,
    borderRadius: 6,
  },
  sectionText: {
    fontSize: 9,
    color: palette.slate,
    lineHeight: 1.45,
    textAlign: "center",
  },
  quote: {
    borderLeftWidth: 3,
    borderLeftColor: palette.navy,
    paddingLeft: 9,
    marginTop: 8,
    backgroundColor: "#F3F7FC",
    borderRadius: 4,
    paddingVertical: 8,
    paddingRight: 8,
  },
  quoteText: {
    fontSize: 8.8,
    color: palette.navy,
    lineHeight: 1.45,
    textAlign: "center",
  },
  kpiRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  kpiCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: palette.slateSoft,
    borderRadius: 8,
    backgroundColor: palette.white,
    padding: 9,
  },
  kpiLabel: {
    fontSize: 7.8,
    textTransform: "uppercase",
    color: palette.slate,
    marginBottom: 5,
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: palette.navy,
  },
  kpiDetail: {
    fontSize: 8.2,
    color: palette.slate,
    marginTop: 3,
  },
  card: {
    borderWidth: 1,
    borderColor: palette.slateSoft,
    borderRadius: 8,
    backgroundColor: palette.white,
    padding: 10,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 10.5,
    fontWeight: "bold",
    color: palette.blueStrong,
    marginBottom: 4,
    textAlign: "center",
  },
  cardSubtitle: {
    fontSize: 8.5,
    color: palette.slate,
    marginBottom: 7,
    textAlign: "center",
  },
  instruction: {
    borderWidth: 1,
    borderColor: palette.blueSoft,
    backgroundColor: "#F7FAFF",
    borderRadius: 8,
    padding: 9,
    marginBottom: 9,
  },
  instructionTitle: {
    fontSize: 9.5,
    fontWeight: "bold",
    color: palette.blueStrong,
    marginBottom: 4,
  },
  instructionText: {
    fontSize: 8.8,
    color: palette.slate,
    lineHeight: 1.4,
  },
  barsRow: {
    marginBottom: 6,
  },
  barHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  barLabel: {
    fontSize: 8.8,
    color: palette.navy,
  },
  barValue: {
    fontSize: 8.8,
    color: palette.slate,
  },
  barTrack: {
    width: "100%",
    height: 10,
    borderRadius: 99,
    overflow: "hidden",
    backgroundColor: palette.bg,
  },
  barFill: {
    height: "100%",
    borderRadius: 99,
  },
  splitRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  splitCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 9,
    backgroundColor: palette.white,
  },
  splitTitle: {
    fontSize: 9.6,
    fontWeight: "bold",
    marginBottom: 4,
  },
  splitText: {
    fontSize: 8.5,
    lineHeight: 1.4,
    color: palette.slate,
  },
  table: {
    borderWidth: 1,
    borderColor: palette.slateSoft,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 8,
  },
  tableHead: {
    flexDirection: "row",
    backgroundColor: palette.bg,
    borderBottomWidth: 1,
    borderBottomColor: palette.slateSoft,
  },
  th: {
    paddingVertical: 7,
    paddingHorizontal: 8,
    fontSize: 7,
    fontWeight: "bold",
    color: palette.slate,
    textTransform: "uppercase",
  },
  tr: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: palette.slateSoft,
  },
  td: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontSize: 8.6,
    color: palette.navy,
    lineHeight: 1.35,
  },
  listItem: {
    fontSize: 8.9,
    color: palette.slate,
    lineHeight: 1.45,
    marginBottom: 4,
  },
  tocCard: {
    borderWidth: 1,
    borderColor: palette.slateSoft,
    borderRadius: 8,
    backgroundColor: palette.white,
    padding: 10,
    marginBottom: 10,
  },
  tocHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: palette.slateSoft,
    paddingBottom: 6,
    marginBottom: 6,
  },
  tocTitle: {
    fontSize: 9.5,
    fontWeight: "bold",
    color: palette.navy,
  },
  tocLabel: {
    fontSize: 7,
    color: palette.slate,
    textTransform: "uppercase",
  },
  tocRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  tocText: {
    fontSize: 8.8,
    color: palette.navy,
    maxWidth: "84%",
  },
  tocPage: {
    fontSize: 8.8,
    color: palette.slate,
  },
  signatureCard: {
    borderWidth: 1,
    borderColor: palette.slateSoft,
    borderRadius: 8,
    padding: 12,
    backgroundColor: palette.white,
    marginTop: 10,
  },
  signatureLine: {
    width: "72%",
    borderBottomWidth: 1,
    borderBottomColor: palette.slate,
    marginTop: 28,
    marginBottom: 6,
  },
  signatureName: {
    fontSize: 9.2,
    color: palette.navy,
    fontWeight: "bold",
  },
  signatureMeta: {
    fontSize: 8.6,
    color: palette.slate,
    marginTop: 2,
  },
  visualRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  figureCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: palette.slateSoft,
    borderRadius: 10,
    padding: 10,
    backgroundColor: palette.white,
  },
  figureTitle: {
    fontSize: 8.8,
    fontWeight: "bold",
    color: palette.navy,
    marginBottom: 6,
  },
  figureBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 56,
    marginBottom: 6,
  },
  figureBar: {
    width: "22%",
    borderRadius: 5,
  },
  figureLegend: {
    fontSize: 7.8,
    color: palette.slate,
    lineHeight: 1.35,
  },
  pageVectorOne: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 10,
    height: "100%",
    backgroundColor: "#1D4ED8",
  },
  pageVectorTwo: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 10,
    height: "100%",
    backgroundColor: "#2563EB",
  },
  pageVectorThree: {
    position: "absolute",
    right: 12,
    top: 62,
    width: 18,
    height: 120,
    borderRadius: 8,
    backgroundColor: "#DBEAFE",
  },
  chartDiscussionRow: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "stretch",
  },
  chartCol: {
    flex: 1.2,
  },
  discussionCol: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: palette.white,
    padding: 9,
  },
  discussionTitle: {
    fontSize: 9.2,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  discussionText: {
    fontSize: 8.5,
    lineHeight: 1.4,
    color: palette.slate,
    textAlign: "center",
  },
  chartLegend: {
    fontSize: 7.8,
    color: palette.slate,
    marginTop: 4,
  },
  footer: {
    position: "absolute",
    left: 34,
    right: 34,
    bottom: 18,
    borderTopWidth: 1,
    borderTopColor: palette.slateSoft,
    paddingTop: 7,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 7.5,
    color: palette.slate,
  },
});

type Segment = {
  label: string;
  value: number;
  color: string;
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function percent(value: number, total: number): number {
  if (total <= 0) return 0;
  return (value / total) * 100;
}

function formatPct(value: number): string {
  return `${value.toFixed(1)}%`;
}

function getRiskBand(index: number): "Controlado" | "Moderado" | "Elevado" | "Critico" {
  if (index >= 50) return "Critico";
  if (index >= 35) return "Elevado";
  if (index >= 20) return "Moderado";
  return "Controlado";
}

function KpiCard({
  title,
  value,
  detail,
  marginRight,
}: {
  title: string;
  value: string;
  detail: string;
  marginRight?: number;
}) {
  return (
    <View style={[styles.kpiCard, { marginRight: marginRight ?? 0 }]}>
      <Text style={styles.kpiLabel}>{title}</Text>
      <Text style={styles.kpiValue}>{value}</Text>
      <Text style={styles.kpiDetail}>{detail}</Text>
    </View>
  );
}

function Bars({ title, subtitle, total, data }: { title: string; subtitle: string; total: number; data: Segment[] }) {
  const safeTotal = Math.max(total, 1);
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
      {data.map((item, index) => {
        const pct = clamp(percent(item.value, safeTotal), 0, 100);
        return (
          <View key={`${item.label}-${index}`} style={styles.barsRow}>
            <View style={styles.barHead}>
              <Text style={styles.barLabel}>{item.label}</Text>
              <Text style={styles.barValue}>
                {item.value} ({formatPct(pct)})
              </Text>
            </View>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: item.color }]} />
            </View>
          </View>
        );
      })}
    </View>
  );
}

function Footer({ pageNumber }: { pageNumber: string }) {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>Relatório de Saúde | Uso corporativo confidencial</Text>
      <Text style={styles.footerText}>{pageNumber}</Text>
    </View>
  );
}

function PageVectors() {
  return (
    <>
      <View style={styles.pageVectorOne} />
      <View style={styles.pageVectorTwo} />
      <View style={styles.pageVectorThree} />
    </>
  );
}

export function RelatorioSaudePDF({ dados, logoPath }: { dados: DadosRelatorio; logoPath?: string }) {
  const { empresa, adesao, idade, imc, pressaoArterial, genero } = dados;
  const comorbidades = dados.comorbidades ?? {
    has: 0,
    cardiovascular: 0,
    diabetes: 0,
    dislipidemia: 0,
    tireoide: 0,
    imunossupressora: 0,
    respiratoria: 0,
    saudeMental: 0,
    tabagismo: 0,
    etilismo: 0,
  };

  const total = Math.max(adesao.totalParticipantes, 1);
  const cobertura = clamp(adesao.percentualAdesao ?? 0, 0, 100);
  const excessoPeso = imc.sobrepeso + imc.obesidade + imc.obesidadeGrave;
  const riscoPressorico = pressaoArterial.preHipertensao + pressaoArterial.hipertensaoEst1 + pressaoArterial.hipertensaoEst2 + pressaoArterial.hipertensaoEst3;
  const hipertensaoCritica = pressaoArterial.hipertensaoEst2 + pressaoArterial.hipertensaoEst3;
  const glicemiaAlta = dados.glicemia ? (dados.glicemia.hiperglicemia ?? dados.glicemia.alterada ?? 0) : 0;
  const tabagEtl = comorbidades.tabagismo + comorbidades.etilismo;

  const eixoCardio = clamp(
    percent(riscoPressorico, total) * 0.55 + percent(comorbidades.has + comorbidades.cardiovascular, total) * 0.45,
    0,
    100
  );
  const eixoMetabolico = clamp(
    percent(excessoPeso, total) * 0.5 + percent(glicemiaAlta + comorbidades.diabetes + comorbidades.dislipidemia, total) * 0.5,
    0,
    100
  );
  const eixoMental = clamp(percent(comorbidades.saudeMental, total), 0, 100);
  const eixoHabitos = clamp(percent(tabagEtl, total), 0, 100);

  const indiceGlobalRisco = clamp(
    eixoCardio * 0.35 + eixoMetabolico * 0.35 + eixoMental * 0.2 + eixoHabitos * 0.1,
    0,
    100
  );
  const faixaRisco = getRiskBand(indiceGlobalRisco);

  const generoData: Segment[] = [
    { label: "Feminino", value: genero.feminino, color: palette.violetStrong },
    { label: "Masculino", value: genero.masculino, color: palette.blueStrong },
  ];
  const idadeData: Segment[] = idade.faixas.map((faixa, index) => {
    const cores = [palette.cyanStrong, palette.blueStrong, palette.amber, palette.wine, palette.violetStrong];
    return { label: faixa.label, value: faixa.valor, color: cores[index % cores.length] };
  });
  const hipertensaoData: Segment[] = [
    { label: "Otima", value: pressaoArterial.otima, color: palette.moss },
    { label: "Normal", value: pressaoArterial.normal, color: "#22C55E" },
    { label: "Pre-HAS", value: pressaoArterial.preHipertensao, color: palette.amber },
    { label: "HAS Estagio 1", value: pressaoArterial.hipertensaoEst1, color: palette.orangeStrong },
    { label: "HAS Estagio 2", value: pressaoArterial.hipertensaoEst2, color: palette.wine },
    { label: "HAS Estagio 3", value: pressaoArterial.hipertensaoEst3, color: "#881337" },
  ];
  const obesidadeData: Segment[] = [
    { label: "Sobrepeso", value: imc.sobrepeso, color: palette.amber },
    { label: "Obesidade", value: imc.obesidade, color: palette.orangeStrong },
    { label: "Obesidade grave", value: imc.obesidadeGrave, color: palette.wine },
  ];
  const glicemiaData: Segment[] = dados.glicemia
    ? [
        { label: "Hipoglicemia", value: dados.glicemia.hipoglicemia ?? 0, color: palette.cyanStrong },
        { label: "Normoglicemia", value: dados.glicemia.normoglicemia ?? dados.glicemia.normal, color: palette.moss },
        { label: "Hiperglicemia", value: dados.glicemia.hiperglicemia ?? dados.glicemia.alterada, color: palette.wine },
      ]
    : [];
  const fcData: Segment[] = dados.frequenciaCardiaca
    ? [
        { label: "Bradicardia", value: dados.frequenciaCardiaca.bradicardia ?? 0, color: palette.cyanStrong },
        { label: "Normocardia", value: dados.frequenciaCardiaca.normocardia ?? dados.frequenciaCardiaca.normal, color: palette.moss },
        { label: "Taquicardia", value: dados.frequenciaCardiaca.taquicardia ?? dados.frequenciaCardiaca.alterada, color: palette.wine },
      ]
    : [];
  const comorbidadesData: Segment[] = [
    { label: "HAS", value: comorbidades.has, color: palette.wine },
    { label: "Diabetes", value: comorbidades.diabetes, color: palette.orangeStrong },
    { label: "Dislipidemia", value: comorbidades.dislipidemia, color: palette.amber },
    { label: "Cardiovascular", value: comorbidades.cardiovascular, color: palette.blueStrong },
    { label: "Saúde mental", value: comorbidades.saudeMental, color: palette.violetStrong },
  ];

  const faixa50maisPct = clamp(idade.percentualAcima50 ?? 0, 0, 100);
  const faixa18a30Pct = clamp(idade.percentual18a30 ?? 0, 0, 100);
  const dcntNucleo = comorbidades.has + comorbidades.diabetes + comorbidades.cardiovascular + comorbidades.dislipidemia;

  const sindromeMetabolicaProxy = clamp(
    (percent(excessoPeso, total) + percent(riscoPressorico, total) + percent(glicemiaAlta + comorbidades.diabetes, total)) / 3,
    0,
    100
  );

  const sumarioExecutivo = `A população avaliada (${adesao.totalParticipantes} colaboradores, cobertura de ${formatPct(
    cobertura
  )}) apresenta perfil de risco ${faixaRisco.toLowerCase()} com maior concentração em eixos cardiometabólicos. O Índice Global de Risco foi estimado em ${formatPct(
    indiceGlobalRisco
  )}, sinalizando necessidade de resposta estruturada para evitar escalada de absenteísmo, perda de produtividade e maior consumo médico-assistencial no próximo ciclo.`;

  const leituraFinanceira = `A leitura executiva prioriza risco clínico e organizacional imediato, com foco em prevalências por estágio (hipertensão, obesidade e glicemia) para ação preventiva de curto prazo.`;

  const discussaoCruzada = `A combinação de excesso de peso (${formatPct(percent(excessoPeso, total))}), alteração pressórica (${formatPct(
    percent(riscoPressorico, total)
  )}) e disfunção glicêmica (${formatPct(percent(glicemiaAlta, total))}) sustenta um proxy de síndrome metabólica de ${formatPct(
    sindromeMetabolicaProxy
  )}. Esse arranjo aumenta risco de eventos isquêmicos agudos, especialmente quando coexistem hipertensão em estágios avançados (${hipertensaoCritica} casos).`;

  const discussaoEtaria = `A proporção de colaboradores com 50+ anos (${formatPct(
    faixa50maisPct
  )}) indica maior probabilidade de agravamento de DCNT. Em paralelo, a base jovem (18-30) representa ${formatPct(
    faixa18a30Pct
  )}, janela estratégica para prevenção primária e desaceleração de risco futuro. Núcleo de DCNT identificado: ${dcntNucleo} registros.`;

  const metodologiaTexto =
    "Análise transversal de indicadores biométrico-clínicos e autorreferidos, com estratificação por risco e estimativa de impacto operacional. O Índice Global de Risco (IGR) consolida eixos cardiovascular, metabólico, saúde mental e hábitos.";
  const lgpdTexto =
    "Tratamento de dados pessoais sensíveis orientado pela Lei Geral de Proteção de Dados (Lei nº 13.709/2018), com princípio de minimização, finalidade assistencial/preventiva, controle de acesso e uso preferencial de visão agregada para governança executiva.";

  const atividadesPreventivas: string[] = [];
  if (sindromeMetabolicaProxy >= 25) {
    atividadesPreventivas.push(
      "Implantar trilha cardiometabólica com consulta médica ocupacional, protocolo nutricional e plano de atividade física supervisionada para grupos com sobrepeso/obesidade e alteração pressórica/glicêmica."
    );
  }
  if (hipertensaoCritica > 0) {
    atividadesPreventivas.push(
      "Executar busca ativa dos casos de HAS estágio 2/3, com reavaliação clínica em até 30 dias e monitoramento quinzenal até estabilização."
    );
  }
  if (eixoMental >= 10) {
    atividadesPreventivas.push(
      "Estabelecer linha de cuidado em saude mental (acolhimento breve, fluxos de encaminhamento e suporte psicossocial) integrada a treinamento de liderancas."
    );
  }
  if (eixoHabitos >= 8) {
    atividadesPreventivas.push(
      "Lancar programa estruturado para reducao de tabagismo/etilismo com acompanhamento multiprofissional e metas por ciclo trimestral."
    );
  }
  if (atividadesPreventivas.length === 0) {
    atividadesPreventivas.push(
      "Manter estratégia preventiva universal com monitoramento semestral dos KPI clínicos para preservar o risco populacional em faixa controlada."
    );
  }

  const conclusaoExecutiva = `A consolidação dos achados indica risco ${faixaRisco.toLowerCase()} (${formatPct(
    indiceGlobalRisco
  )}) com predomínio de vetores cardiometabólicos. O ganho corporativo esperado depende de disciplina de execução no ciclo 90/180 dias, governança mensal e revisão de indicadores de saúde vinculados à produtividade e afastamentos.`;
  const riscoCardiovascularComposto = clamp(
    (percent(pressaoArterial.hipertensaoEst2 + pressaoArterial.hipertensaoEst3, total) +
      percent(comorbidades.cardiovascular + comorbidades.has, total) +
      percent(glicemiaAlta + comorbidades.diabetes, total)) / 3,
    0,
    100
  );
  const riscoMetabolicoCruzado: Segment[] = [
    { label: "Obesidade (IMC)", value: imc.obesidade + imc.obesidadeGrave, color: palette.orangeStrong },
    { label: "Hiperglicemia", value: glicemiaAlta, color: palette.wine },
    { label: "Diabetes + Dislipidemia", value: comorbidades.diabetes + comorbidades.dislipidemia, color: palette.amber },
  ];
  const riscoCardiovascularCruzado: Segment[] = [
    { label: "Obesidade", value: imc.obesidade + imc.obesidadeGrave, color: palette.orangeStrong },
    { label: "PA alterada", value: riscoPressorico, color: palette.blueStrong },
    { label: "HAS autorreferida", value: comorbidades.has, color: palette.wine },
  ];

  return (
    <Document>
      <Page size="A4" style={[styles.page, styles.coverPage]}>
        <View style={styles.coverShapeOne} />
        <View style={styles.coverShapeTwo} />

        <View style={styles.coverBlock}>
          <View style={styles.coverTop}>
            <Text style={[styles.metaLabel, { color: "#BFD4FF", textAlign: "center", marginTop: 90 }]}>Empresa</Text>
            <Text style={[styles.coverTitle, { textAlign: "center", marginTop: 6 }]}>{empresa.nome}</Text>
            <Text style={[styles.metaLabel, { color: "#BFD4FF", textAlign: "center", marginTop: 28 }]}>Data da coleta</Text>
            <Text style={[styles.metaValue, { textAlign: "center", marginBottom: 0 }]}>{empresa.dataColeta || "Nao informada"}</Text>
          </View>

          <View />
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <PageVectors />
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Relatório de Saúde | {empresa.nome}</Text>
            <Text style={styles.headerSubtitle}>Metodologia, LGPD e sumário do documento | Coleta: {empresa.dataColeta || "Não informada"}</Text>
          </View>
          {logoPath ? <Image src={logoPath} style={{ width: 42 }} /> : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Metodologia de análise</Text>
          <Text style={styles.sectionText}>{metodologiaTexto}</Text>
          <View style={styles.quote}>
            <Text style={styles.quoteText}>
              O IGR foi calibrado para apoiar decisão executiva, não para substituir diagnóstico individual.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LGPD e sigilo ocupacional</Text>
          <Text style={styles.sectionText}>{lgpdTexto}</Text>
        </View>

        <View style={styles.tocCard}>
          <View style={styles.tocHead}>
            <Text style={styles.tocTitle}>Sumário executivo do documento</Text>
            <Text style={styles.tocLabel}>PAGINAS</Text>
          </View>
          <View style={styles.tocRow}>
            <Text style={styles.tocText}>1. Sumário Executivo (estado geral e risco corporativo)</Text>
            <Text style={styles.tocPage}>3</Text>
          </View>
          <View style={styles.tocRow}>
            <Text style={styles.tocText}>2. Dashboard clínico I (gênero e faixas etárias)</Text>
            <Text style={styles.tocPage}>3</Text>
          </View>
          <View style={styles.tocRow}>
            <Text style={styles.tocText}>3. Dashboard clínico II (hipertensão, obesidade e glicemia)</Text>
            <Text style={styles.tocPage}>4</Text>
          </View>
          <View style={styles.tocRow}>
            <Text style={styles.tocText}>4. Risco integrado cardiometabólico e cardiovascular</Text>
            <Text style={styles.tocPage}>5</Text>
          </View>
          <View style={styles.tocRow}>
            <Text style={styles.tocText}>4.1 Comorbidades correlacionadas</Text>
            <Text style={styles.tocPage}>6</Text>
          </View>
          <View style={styles.tocRow}>
            <Text style={styles.tocText}>5. Plano de ação estratégico (90/180 dias)</Text>
            <Text style={styles.tocPage}>7</Text>
          </View>
          <View style={[styles.tocRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.tocText}>6. Conclusão, atividades preventivas e assinatura</Text>
            <Text style={styles.tocPage}>8</Text>
          </View>
        </View>

        <Footer pageNumber="Pagina 2" />
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>01. Sumário Executivo | 02. Mapeamento Epidemiológico</Text>
            <Text style={styles.headerSubtitle}>Leitura C-Level com foco em priorização de risco corporativo</Text>
          </View>
          {logoPath ? <Image src={logoPath} style={{ width: 42 }} /> : null}
        </View>

        <View style={styles.kpiRow}>
          <KpiCard
            title="Colaboradores avaliados"
            value={String(adesao.totalParticipantes)}
            detail={`Base total: ${adesao.totalEquipe || adesao.totalParticipantes}`}
            marginRight={8}
          />
          <KpiCard title="Adesão da campanha" value={formatPct(cobertura)} detail="Cobertura da população corporativa" marginRight={8} />
          <KpiCard title="Índice Global de Risco" value={formatPct(indiceGlobalRisco)} detail={`Classificação: ${faixaRisco}`} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Sumário Executivo (Executive Summary)</Text>
          <Text style={styles.sectionText}>{sumarioExecutivo}</Text>
          <View style={styles.quote}>
            <Text style={styles.quoteText}>{leituraFinanceira}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Dashboard Clínico I (proporções populacionais)</Text>
          <View style={styles.chartDiscussionRow}>
            <View style={styles.chartCol}>
              <Bars title="Gráfico 1 | Proporção por gênero" subtitle="Distribuição de homens e mulheres" total={total} data={generoData} />
              <Text style={styles.chartLegend}>Legenda: representação proporcional da composição por gênero.</Text>
            </View>
            <View style={{ width: 8 }} />
            <View style={[styles.discussionCol, { borderColor: palette.blueSoft }]}>
              <Text style={[styles.discussionTitle, { color: palette.blueStrong }]}>Leitura por gênero</Text>
              <Text style={styles.discussionText}>
                O perfil por gênero orienta campanhas específicas de prevenção e comunicação de risco conforme vulnerabilidades clínicas mais frequentes.
              </Text>
            </View>
          </View>
          <View style={styles.chartDiscussionRow}>
            <View style={styles.chartCol}>
              <Bars title="Gráfico 2 | Proporção por faixa etária" subtitle="Distribuição dos participantes por idade" total={total} data={idadeData} />
              <Text style={styles.chartLegend}>Legenda: faixas etárias com maior volume exigem monitoramento mais frequente.</Text>
            </View>
            <View style={{ width: 8 }} />
            <View style={[styles.discussionCol, { borderColor: palette.amberSoft }]}>
              <Text style={[styles.discussionTitle, { color: palette.amber }]}>Leitura etária</Text>
              <Text style={styles.discussionText}>{discussaoEtaria}</Text>
            </View>
          </View>
        </View>

        <Footer pageNumber="Pagina 3" />
      </Page>

      <Page size="A4" style={styles.page}>
        <PageVectors />
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>03. Dashboard Clínico II (Estágios e Proporções)</Text>
            <Text style={styles.headerSubtitle}>Hipertensão, obesidade, alterações glicêmicas e batimentos cardíacos</Text>
          </View>
          {logoPath ? <Image src={logoPath} style={{ width: 42 }} /> : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Proporções por estágio clínico</Text>
          <View style={styles.chartDiscussionRow}>
            <View style={styles.chartCol}>
              <Bars
                title="Gráfico 3 | Hipertensão por estágio"
                subtitle="Proporção individual por classificação pressórica"
                total={total}
                data={hipertensaoData}
              />
            </View>
            <View style={{ width: 8 }} />
            <View style={styles.chartCol}>
              <Bars
                title="Gráfico 4 | Obesidade por estágio"
                subtitle="Sobrepeso, obesidade e obesidade grave"
                total={total}
                data={obesidadeData}
              />
            </View>
          </View>
          {glicemiaData.length > 0 ? (
            <View style={styles.chartDiscussionRow}>
              <View style={styles.chartCol}>
                <Bars title="Gráfico 5 | Alterações glicêmicas" subtitle="Hipoglicemia, normoglicemia e hiperglicemia" total={total} data={glicemiaData} />
              </View>
              <View style={{ width: 8 }} />
              <View style={styles.chartCol}>
                <Bars title="Gráfico 6 | Batimentos cardíacos" subtitle="Bradicardia, normocardia e taquicardia" total={total} data={fcData} />
              </View>
            </View>
          ) : null}
        </View>

        <Footer pageNumber="Pagina 4" />
      </Page>

      <Page size="A4" style={styles.page}>
        <PageVectors />
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>04. Risco Integrado Cardiometabólico e Cardiovascular</Text>
            <Text style={styles.headerSubtitle}>Cruzamento de obesidade, glicemia, pressão arterial e comorbidades correlacionadas</Text>
          </View>
          {logoPath ? <Image src={logoPath} style={{ width: 42 }} /> : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Análise cruzada de risco</Text>
          <View style={styles.chartDiscussionRow}>
            <View style={styles.chartCol}>
              <Bars
                title="Gráfico 7 | Risco metabólico cruzado"
                subtitle="Obesidade, hiperglicemia e comorbidades correlacionadas"
                total={total}
                data={riscoMetabolicoCruzado}
              />
            </View>
            <View style={{ width: 8 }} />
            <View style={[styles.discussionCol, { borderColor: palette.amberSoft }]}>
              <Text style={[styles.discussionTitle, { color: palette.amber }]}>Leitura metabólica</Text>
              <Text style={styles.discussionText}>{discussaoCruzada}</Text>
            </View>
          </View>
          <View style={styles.chartDiscussionRow}>
            <View style={styles.chartCol}>
              <Bars
                title="Gráfico 8 | Risco cardiovascular cruzado"
                subtitle="Obesidade, pressão arterial e hipertensão autorreferida"
                total={total}
                data={riscoCardiovascularCruzado}
              />
            </View>
            <View style={{ width: 8 }} />
            <View style={[styles.discussionCol, { borderColor: palette.wineSoft }]}>
              <Text style={[styles.discussionTitle, { color: palette.wine }]}>Leitura cardiovascular</Text>
              <Text style={styles.discussionText}>
                Risco composto para eventos cardiovasculares: {formatPct(riscoCardiovascularComposto)}. O acúmulo de obesidade, pressão alterada e HAS autorreferida aumenta a chance de descompensações cardiovasculares.
              </Text>
            </View>
          </View>
        </View>

        <Footer pageNumber="Pagina 5" />
      </Page>

      <Page size="A4" style={styles.page}>
        <PageVectors />
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>04.1 Comorbidades Correlacionadas</Text>
            <Text style={styles.headerSubtitle}>Leitura complementar para estratificação de risco clínico</Text>
          </View>
          {logoPath ? <Image src={logoPath} style={{ width: 42 }} /> : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comorbidades e correlação de risco</Text>
          <View style={styles.chartDiscussionRow}>
            <View style={styles.chartCol}>
              <Bars title="Gráfico 9 | Proporção de comorbidades" subtitle="Condições autorreferidas mais prevalentes" total={total} data={comorbidadesData} />
            </View>
            <View style={{ width: 8 }} />
            <View style={[styles.discussionCol, { borderColor: palette.blueSoft }]}>
              <Text style={[styles.discussionTitle, { color: palette.blueStrong }]}>Cruzamento de comorbidades</Text>
              <Text style={styles.discussionText}>
                A convergência entre comorbidades cardiometabólicas e alterações pressóricas/glicêmicas sugere maior probabilidade de síndrome metabólica e risco de eventos cardiovasculares ao longo do ciclo assistencial.
              </Text>
            </View>
          </View>
        </View>

        <Footer pageNumber="Pagina 7" />
      </Page>

      <Page size="A4" style={styles.page}>
        <PageVectors />
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>05. Plano de Ação Estratégico (Timeline 90/180 dias)</Text>
            <Text style={styles.headerSubtitle}>Intervenção orientada por risco para redução progressiva da zona vinho para âmbar</Text>
          </View>
          {logoPath ? <Image src={logoPath} style={{ width: 42 }} /> : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Plano de Ação Estratégico</Text>
          <View style={styles.table}>
            <View style={styles.tableHead}>
              <Text style={[styles.th, { width: "18%" }]}>Janela</Text>
              <Text style={[styles.th, { width: "26%" }]}>Foco</Text>
              <Text style={[styles.th, { width: "36%" }]}>Intervenções recomendadas</Text>
              <Text style={[styles.th, { width: "20%" }]}>Indicador de sucesso</Text>
            </View>

            <View style={styles.tr}>
              <Text style={[styles.td, { width: "18%" }]}>0-90 dias</Text>
              <Text style={[styles.td, { width: "26%" }]}>Zona vinho/bordô (ação imediata)</Text>
              <Text style={[styles.td, { width: "36%" }]}>
                Estratificação nominal dos casos críticos; consulta médica ocupacional prioritária; plano intensivo para HAS estágio 2/3, hiperglicemia e obesidade grave; encaminhamento psicossocial para casos de saúde mental moderada/grave.
              </Text>
              <Text style={[styles.td, { width: "20%" }]}>
                Reducao de pelo menos 15% dos casos criticos e aumento da adesao ao acompanhamento para pelo menos 80%.
              </Text>
            </View>

            <View style={styles.tr}>
              <Text style={[styles.td, { width: "18%" }]}>90-180 dias</Text>
              <Text style={[styles.td, { width: "26%" }]}>Migração para zona âmbar</Text>
              <Text style={[styles.td, { width: "36%" }]}>
                Programa de cultura de saúde com trilha nutricional, atividade física orientada e higiene do sono; política antitabagismo e uso responsável de álcool; treinamento de lideranças para manejo de risco psicossocial.
              </Text>
              <Text style={[styles.td, { width: "20%" }]}>
                Queda sustentada de absenteísmo médico, melhoria do IGR e estabilização de prevalências cardiometabólicas.
              </Text>
            </View>

            <View style={[styles.tr, { borderBottomWidth: 0 }]}>
              <Text style={[styles.td, { width: "18%" }]}>Governança</Text>
              <Text style={[styles.td, { width: "26%" }]}>Comite mensal SST + RH + Liderancas</Text>
              <Text style={[styles.td, { width: "36%" }]}>
                Revisão mensal de KPI clínicos e operacionais, com gatilhos para escalonamento médico e ajuste de campanha por unidade/departamento.
              </Text>
              <Text style={[styles.td, { width: "20%" }]}>Painel ativo de risco e produtividade com revisão executiva bimestral.</Text>
            </View>
          </View>
        </View>

        <View style={styles.instruction}>
            <Text style={styles.instructionTitle}>Nota metodológica</Text>
          <Text style={styles.instructionText}>
            Este relatório segue abordagem de medicina ocupacional baseada em risco populacional. As projeções de impacto financeiro são cenários técnicos e devem ser refinadas com
            dados internos de custo médio por afastamento, sinistralidade e produtividade por área.
          </Text>
        </View>

        <Footer pageNumber="Pagina 6" />
      </Page>

      <Page size="A4" style={styles.page}>
        <PageVectors />
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>06. Conclusão, Atividades Preventivas e Assinatura</Text>
            <Text style={styles.headerSubtitle}>Fechamento executivo orientado à implementação</Text>
          </View>
          {logoPath ? <Image src={logoPath} style={{ width: 42 }} /> : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conclusão executiva</Text>
          <Text style={styles.sectionText}>{conclusaoExecutiva}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Atividades preventivas recomendadas conforme resultados</Text>
          {atividadesPreventivas.map((atividade, index) => (
            <Text key={`atividade-${index}`} style={styles.listItem}>
              {`${index + 1}. ${atividade}`}
            </Text>
          ))}
        </View>

        <View style={styles.signatureCard}>
          <Text style={styles.sectionTitle}>Assinatura técnica</Text>
          <Text style={styles.sectionText}>
            Declaro que a análise apresentada foi elaborada com base nos dados consolidados da coleta, seguindo critérios técnicos de medicina ocupacional e epidemiologia corporativa.
          </Text>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureName}>Enf Eliza Scruk Sanches</Text>
          <Text style={styles.signatureMeta}>Profissional responsável por gerar os relatórios | Coren- PR 745.269</Text>
          <Text style={styles.signatureMeta}>Data: ____/____/______</Text>
        </View>

        <Footer pageNumber="Pagina 8" />
      </Page>
    </Document>
  );
}
