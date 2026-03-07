import React from "react";
import { Document, Page, Text, View, StyleSheet, Image, Svg, Path } from "@react-pdf/renderer";
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
    justifyContent: "center",
  },
  coverTop: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
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
    alignItems: "center",
  },
  coverFooterText: {
    fontSize: 10,
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
  companyHeaderCard: {
    borderWidth: 1,
    borderColor: palette.slateSoft,
    borderRadius: 8,
    backgroundColor: palette.white,
    padding: 10,
    marginBottom: 10,
  },
  companyHeaderGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  companyHeaderItem: {
    width: "50%",
    marginBottom: 6,
  },
  companyHeaderLabel: {
    fontSize: 7.2,
    textTransform: "uppercase",
    color: palette.slate,
    marginBottom: 2,
  },
  companyHeaderValue: {
    fontSize: 8.8,
    color: palette.navy,
    fontWeight: "bold",
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
    alignItems: "flex-start",
    marginBottom: 2,
  },
  barLabel: {
    fontSize: 8.2,
    color: palette.navy,
    maxWidth: "72%",
    lineHeight: 1.25,
  },
  barValue: {
    fontSize: 8.2,
    color: palette.slate,
    width: "26%",
    textAlign: "right",
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
  helperCard: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 6,
    backgroundColor: "#F8FBFF",
  },
  helperHead: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  helperIcon: {
    width: 16,
    height: 16,
    borderRadius: 99,
    textAlign: "center",
    fontSize: 10,
    fontWeight: "bold",
    color: palette.white,
    marginRight: 6,
    paddingTop: 1,
  },
  helperText: {
    fontSize: 8.6,
    lineHeight: 1.45,
    color: palette.slate,
  },
  preventiveCard: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 9,
    marginBottom: 8,
    backgroundColor: palette.white,
  },
  preventiveRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  preventiveBadge: {
    width: 24,
    height: 24,
    borderRadius: 99,
    marginRight: 8,
    color: palette.white,
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 6,
  },
  preventiveText: {
    flex: 1,
    fontSize: 8.8,
    lineHeight: 1.4,
    color: palette.navy,
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
  pieCard: {
    borderWidth: 1,
    borderColor: palette.slateSoft,
    borderRadius: 8,
    backgroundColor: palette.white,
    padding: 10,
    marginBottom: 6,
  },
  pieWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pieLegendWrap: {
    width: "52%",
    paddingLeft: 8,
  },
  pieLegendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  pieLegendDot: {
    width: 8,
    height: 8,
    borderRadius: 99,
    marginRight: 5,
  },
  pieLegendText: {
    fontSize: 8.5,
    color: palette.navy,
  },
  columnsCard: {
    borderWidth: 1,
    borderColor: palette.slateSoft,
    borderRadius: 10,
    backgroundColor: palette.white,
    padding: 10,
    marginBottom: 10,
  },
  columnsWrap: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 140,
    marginTop: 6,
    marginBottom: 6,
  },
  columnItem: {
    width: "23%",
    alignItems: "center",
  },
  columnValue: {
    fontSize: 7.8,
    color: palette.navy,
    marginBottom: 4,
    fontWeight: "bold",
  },
  columnBar: {
    width: "68%",
    minHeight: 4,
    borderRadius: 6,
  },
  columnLabel: {
    marginTop: 5,
    fontSize: 7.3,
    color: palette.slate,
    textAlign: "center",
    lineHeight: 1.3,
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

function polarToCartesian(cx: number, cy: number, r: number, angleInDeg: number) {
  const angleInRad = ((angleInDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(angleInRad),
    y: cy + r * Math.sin(angleInRad),
  };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
}

function PieChart({
  title,
  subtitle,
  total,
  data,
}: {
  title: string;
  subtitle: string;
  total: number;
  data: Segment[];
}) {
  const safeTotal = Math.max(total, 1);
  const cx = 52;
  const cy = 52;
  const r = 44;
  const slices = data.reduce<Array<{ key: string; d: string; color: string }>>((acc, item, index) => {
    const previousSweep = acc.reduce((sum, _, i) => {
      const prevPct = clamp(percent(data[i].value, safeTotal), 0, 100);
      return sum + (prevPct / 100) * 360;
    }, 0);
    const pct = clamp(percent(item.value, safeTotal), 0, 100);
    if (pct <= 0) return acc;
    const sweep = (pct / 100) * 360;
    acc.push({
      key: `pie-${item.label}-${index}`,
      d: describeArc(cx, cy, r, previousSweep, previousSweep + sweep),
      color: item.color,
    });
    return acc;
  }, []);

  return (
    <View style={styles.pieCard}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
      <View style={styles.pieWrap}>
        <Svg width={104} height={104}>
          {slices.map((slice) => (
            <Path key={slice.key} d={slice.d} fill={slice.color} />
          ))}
        </Svg>
        <View style={styles.pieLegendWrap}>
          {data.map((item, index) => {
            const pct = clamp(percent(item.value, safeTotal), 0, 100);
            return (
              <View key={`legend-${item.label}-${index}`} style={styles.pieLegendItem}>
                <View style={[styles.pieLegendDot, { backgroundColor: item.color }]} />
                <Text style={styles.pieLegendText}>
                  {item.label}: {item.value} ({formatPct(pct)})
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

function ColumnsChart({
  title,
  subtitle,
  total,
  data,
}: {
  title: string;
  subtitle: string;
  total: number;
  data: Segment[];
}) {
  const safeTotal = Math.max(total, 1);
  return (
    <View style={styles.columnsCard}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
      <View style={styles.columnsWrap}>
        {data.map((item, index) => {
          const pct = clamp(percent(item.value, safeTotal), 0, 100);
          const h = Math.max(6, (pct / 100) * 110);
          return (
            <View key={`col-${item.label}-${index}`} style={styles.columnItem}>
              <Text style={styles.columnValue}>{item.value}</Text>
              <View style={[styles.columnBar, { height: h, backgroundColor: item.color }]} />
              <Text style={styles.columnLabel}>{item.label}</Text>
            </View>
          );
        })}
      </View>
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

function getGeneroTexto(genero: { feminino: number; masculino: number }): string {
  if (genero.feminino === genero.masculino) {
    return "O grande ponto de convergência para ambos os gêneros é a prevenção, desenvolvimento de bons hábitos e diagnóstico precoce, que atuam como a ferramenta mais poderosa para impedir e frear o avanço de doenças crônicas e garantir um envelhecimento com autonomia e qualidade de vida.";
  }
  if (genero.feminino >= genero.masculino) {
    return "Nota-se maior prevalência de condições ligadas a flutuações hormonais, ao sistema imunológico e à longevidade. Entre as principais comorbidades que afetam o público feminino estão as doenças autoimunes, a osteoporose, os distúrbios da tireoide e quadros de demência. Deve-se focar educação em saúde e programas de prevenção nesses âmbitos.";
  }
  return "Muitas das comorbidades que os afetam de forma mais severa são agravadas pela resistência em buscar acompanhamento médico e por fatores de risco comportamentais como etilismo e tabagismo. Além de apresentarem maiores taxas de doenças hepáticas, diabetes tipo 2 e problemas prostáticos. Nesse contexto, o maior passo preventivo é quebrar o tabu.";
}

function getFaixaEtariaTexto(faixas: { label: string; valor: number }[]): string {
  const faixasValidas = faixas.filter((faixa) => ["18-30", "31-40", "41-50", ">50"].includes(faixa.label));
  if (!faixasValidas.length) {
    return "A leitura por faixa etária orienta a priorização de medidas preventivas de acordo com o ciclo de vida predominante da população avaliada.";
  }
  const dominante = faixasValidas.reduce((acc, item) => (item.valor > acc.valor ? item : acc), faixasValidas[0]);
  const label = dominante.label.toLowerCase();
  const jovemAdulto = label.includes("18") || label.includes("30") || label.includes("31") || label.includes("40");
  if (jovemAdulto) {
    return "Na juventude e fase adulta o corpo geralmente está no seu auge físico, mas no processo de construção de maus hábitos e o estresse diário tendem a aumentar. A prevenção aqui deve ser focada na construção bons hábitos como da atividade física, construção de reserva cognitiva, prevenção da saúde mental e alerta dos malefícios de maus hábitos.";
  }
  return "A partir da meia idade devemos focar no cuidado e seguir com a prevenção. O foco principal deve se voltar para o sistema cardiovascular, já que os riscos de hipertensão, colesterol alto e infartos aumentam significativamente nessa faixa. É fundamental intensificar o rastreio metabólico, monitorar o risco de diabetes tipo 2 e iniciar os exames oncológicos preventivos de rotina e declínios cognitivos.";
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
  const generoSemRegistro = Math.max(total - (genero.feminino + genero.masculino), 0);
  if (generoSemRegistro > 0) {
    generoData.push({ label: "NÃ£o informado", value: generoSemRegistro, color: palette.slate });
  }
  const idadeData: Segment[] = idade.faixas.filter((faixa) => faixa.label !== "NÃ£o informado").map((faixa, index) => {
    const cores = [palette.cyanStrong, palette.blueStrong, palette.amber, palette.wine, palette.violetStrong];
    return { label: faixa.label, value: faixa.valor, color: cores[index % cores.length] };
  });
  const hipertensaoData: Segment[] = [
    { label: "Normal", value: pressaoArterial.normal + pressaoArterial.otima, color: "#22C55E" },
    { label: "Pre-HAS", value: pressaoArterial.preHipertensao, color: palette.amber },
    { label: "HAS Estagio 1", value: pressaoArterial.hipertensaoEst1, color: palette.orangeStrong },
    { label: "HAS Estagio 2", value: pressaoArterial.hipertensaoEst2, color: palette.wine },
    { label: "HAS Estagio 3", value: pressaoArterial.hipertensaoEst3, color: "#881337" },
  ];
  const obesidadeData: Segment[] = [
    { label: "Magreza", value: imc.magreza, color: palette.cyanStrong },
    { label: "Peso normal", value: imc.normal, color: palette.moss },
    { label: "Sobrepeso", value: imc.sobrepeso, color: palette.amber },
    { label: "Obesidade", value: imc.obesidade, color: palette.orangeStrong },
    { label: "Obesidade grave", value: imc.obesidadeGrave, color: palette.wine },
  ];
  const imcSemRegistro = Math.max(total - (imc.magreza + imc.normal + imc.sobrepeso + imc.obesidade + imc.obesidadeGrave), 0);
  if (imcSemRegistro > 0) {
    obesidadeData.push({ label: "Sem registro IMC", value: imcSemRegistro, color: palette.slate });
  }
  const glicemiaData: Segment[] = dados.glicemia
    ? [
        { label: "Hipoglicemia", value: dados.glicemia.hipoglicemia ?? 0, color: palette.cyanStrong },
        { label: "Normoglicemia", value: dados.glicemia.normoglicemia ?? dados.glicemia.normal, color: palette.moss },
        { label: "Hiperglicemia", value: dados.glicemia.hiperglicemia ?? dados.glicemia.alterada, color: palette.wine },
      ]
    : [];
  const glicemiaSemRegistro = dados.glicemia
    ? Math.max(
        total -
          ((dados.glicemia.hipoglicemia ?? 0) +
            (dados.glicemia.normoglicemia ?? dados.glicemia.normal) +
            (dados.glicemia.hiperglicemia ?? dados.glicemia.alterada)),
        0
      )
    : 0;
  if (glicemiaSemRegistro > 0) {
    glicemiaData.push({ label: "Sem registro glicemia", value: glicemiaSemRegistro, color: palette.slate });
  }
  const fcData: Segment[] = dados.frequenciaCardiaca
    ? [
        { label: "Bradicardia", value: dados.frequenciaCardiaca.bradicardia ?? 0, color: palette.cyanStrong },
        { label: "Normocardia", value: dados.frequenciaCardiaca.normocardia ?? dados.frequenciaCardiaca.normal, color: palette.moss },
        { label: "Taquicardia", value: dados.frequenciaCardiaca.taquicardia ?? dados.frequenciaCardiaca.alterada, color: palette.wine },
      ]
    : [];
  const fcSemRegistro = dados.frequenciaCardiaca
    ? Math.max(
        total -
          ((dados.frequenciaCardiaca.bradicardia ?? 0) +
            (dados.frequenciaCardiaca.normocardia ?? dados.frequenciaCardiaca.normal) +
            (dados.frequenciaCardiaca.taquicardia ?? dados.frequenciaCardiaca.alterada)),
        0
      )
    : 0;
  if (fcSemRegistro > 0) {
    fcData.push({ label: "Sem registro FC", value: fcSemRegistro, color: palette.slate });
  }
  const comorbidadesData: Segment[] = [
    { label: "HAS", value: comorbidades.has, color: palette.wine },
    { label: "Diabetes", value: comorbidades.diabetes, color: palette.orangeStrong },
    { label: "Dislipidemia", value: comorbidades.dislipidemia, color: palette.amber },
    { label: "Cardiovascular", value: comorbidades.cardiovascular, color: palette.blueStrong },
    { label: "Transtornos mentais comuns", value: comorbidades.saudeMental, color: palette.violetStrong },
  ];
  const participantes = dados.participantes ?? [];
  const faixasOrdem = ["18-30", "31-40", "41-50", ">50"];
  const imcAlteradoStatus = new Set(["Sobrepeso", "Obesidade Grau I", "Obesidade Grau II", "Obesidade Grau III"]);
  const pressaoNormalTotal = pressaoArterial.otima + pressaoArterial.normal;
  const pressaoNormalVsAlteradaData: Segment[] = [
    { label: "PA normal", value: pressaoNormalTotal, color: palette.moss },
    { label: "Alterações pressóricas", value: riscoPressorico, color: palette.wine },
  ];
  const pressaoFaixaEtariaData: Segment[] = faixasOrdem.map((faixa, index) => {
    const cores = [palette.cyanStrong, palette.blueStrong, palette.amber, palette.wine];
    return {
      label: faixa,
      value: participantes.filter((p) => p.idadeFaixa === faixa && p.paAlterado).length,
      color: cores[index % cores.length],
    };
  });
  const obesidadeFaixaEtariaData: Segment[] = faixasOrdem.map((faixa, index) => {
    const cores = [palette.cyanStrong, palette.blueStrong, palette.amber, palette.wine];
    return {
      label: faixa,
      value: participantes.filter((p) => p.idadeFaixa === faixa && imcAlteradoStatus.has(p.imcStatus)).length,
      color: cores[index % cores.length],
    };
  });
  const obesidadeGeneroData: Segment[] = [
    {
      label: "Feminino",
      value: participantes.filter((p) => p.genero === 1 && imcAlteradoStatus.has(p.imcStatus)).length,
      color: palette.violetStrong,
    },
    {
      label: "Masculino",
      value: participantes.filter((p) => p.genero === 2 && imcAlteradoStatus.has(p.imcStatus)).length,
      color: palette.blueStrong,
    },
  ];
  const glicemiaImcData: Segment[] = [
    {
      label: "IMC adequado + glicemia alterada",
      value: participantes.filter((p) => !imcAlteradoStatus.has(p.imcStatus) && p.glicemiaAlterado).length,
      color: palette.cyanStrong,
    },
    {
      label: "IMC alterado + glicemia alterada",
      value: participantes.filter((p) => imcAlteradoStatus.has(p.imcStatus) && p.glicemiaAlterado).length,
      color: palette.wine,
    },
  ];
  const saudaveis = participantes.filter(
    (p) =>
      p.comorbidades === "Nega comorbidades" &&
      p.paStatus === "Normal" &&
      p.imcStatus === "Peso normal" &&
      p.glicemiaStatus === "Normoglicemia" &&
      p.fcStatus === "Normocardia"
  ).length;
  const pressaoAlteradaOuHas = participantes.filter((p) => p.paAlterado || /hipertens|has/i.test(p.comorbidades)).length;
  const imcAlteradoTotal = participantes.filter((p) => imcAlteradoStatus.has(p.imcStatus)).length;
  const hiperglicemiaTotal = participantes.filter((p) => p.glicemiaStatus === "Hiperglicemia").length;
  const correlacaoGlobalData: Segment[] = [
    { label: "Pessoas saudáveis", value: saudaveis, color: palette.moss },
    { label: "Pressão arterial alterada", value: pressaoAlteradaOuHas, color: palette.blueStrong },
    { label: "IMC alterado", value: imcAlteradoTotal, color: palette.orangeStrong },
    { label: "Hiperglicemia", value: hiperglicemiaTotal, color: palette.wine },
  ];

  const sindromeMetabolicaProxy = clamp(
    (percent(excessoPeso, total) + percent(riscoPressorico, total) + percent(glicemiaAlta + comorbidades.diabetes, total)) / 3,
    0,
    100
  );

  const discussaoCruzada = `A combinação de excesso de peso (${formatPct(percent(excessoPeso, total))}), alteração pressórica (${formatPct(
    percent(riscoPressorico, total)
  )}) e disfunção glicêmica (${formatPct(percent(glicemiaAlta, total))}) sustenta um proxy de síndrome metabólica de ${formatPct(
    sindromeMetabolicaProxy
  )}. Esse arranjo aumenta risco de eventos isquêmicos agudos, especialmente quando coexistem hipertensão em estágios avançados (${hipertensaoCritica} casos).`;

  const discussaoEtaria = getFaixaEtariaTexto(idade.faixas);
  const discussaoGenero = getGeneroTexto(genero);

  const metodologiaTexto =
    "A coleta de dados é realizada de forma individual com cada colaborador por meio de entrevista estruturada e avaliação de sinais vitais. Durante a entrevista são registrados dados demográficos, histórico autorreferido de saúde, hábitos de vida e fatores de risco ocupacionais. Em seguida, são aferidos sinais clínicos como pressão arterial, parâmetros antropométricos e demais indicadores previstos no protocolo assistencial.";
  const metodologiaTextoComplementar =
    "Após a coleta, os dados passam por revisão técnica, padronização e consolidação estatística para análise populacional. Os resultados são apresentados em formato agregado, com estratificação por gênero, faixa etária e níveis de risco, permitindo direcionar ações preventivas, educativas e de acompanhamento em saúde ocupacional.";
  const lgpdTexto =
    "O tratamento das informações deste relatório observa a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018), especialmente quanto aos dados pessoais sensíveis relacionados à saúde. A base legal é aplicada para fins de promoção, proteção e monitoramento da saúde ocupacional, respeitando os princípios de finalidade, necessidade, adequação, segurança e prevenção.";
  const lgpdTextoComplementar =
    "Os dados individuais são acessados apenas por profissionais autorizados, com sigilo ocupacional e uso restrito às atividades técnicas de saúde. A divulgação para gestão ocorre de forma consolidada e anonimizada, sem exposição nominal dos colaboradores, preservando confidencialidade, privacidade e conformidade ética no cuidado ocupacional.";

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
  const preventiveColors = [palette.blueStrong, palette.amber, palette.orangeStrong, palette.wine, palette.cyanStrong];
  return (
    <Document>
      <Page size="A4" style={[styles.page, styles.coverPage]}>
        <View style={styles.coverShapeOne} />
        <View style={styles.coverShapeTwo} />

        <View style={styles.coverBlock}>
          <View style={styles.coverTop}>
            <Text style={[styles.metaLabel, { color: "#BFD4FF", textAlign: "center", marginTop: 0 }]}>Empresa</Text>
            <Text style={[styles.coverTitle, { textAlign: "center", marginTop: 8 }]}>{empresa.nome}</Text>
          </View>

          <View style={styles.coverFooter}>
            <Text style={styles.coverFooterText}>Data da coleta: {empresa.dataColeta || "Nao informada"}</Text>
          </View>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <PageVectors />
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Relatório de Saúde | {empresa.nome}</Text>
            <Text style={styles.headerSubtitle}>Cabeçalho de identificação, sumário, metodologia de análise e LGPD</Text>
          </View>
          {logoPath ? <Image src={logoPath} style={{ width: 42 }} /> : null}
        </View>

        <View style={styles.companyHeaderCard}>
          <View style={styles.companyHeaderGrid}>
            <View style={styles.companyHeaderItem}>
              <Text style={styles.companyHeaderLabel}>Nome da empresa</Text>
              <Text style={styles.companyHeaderValue}>{empresa.nome || "Nao informado"}</Text>
            </View>
            <View style={styles.companyHeaderItem}>
              <Text style={styles.companyHeaderLabel}>Endereco</Text>
              <Text style={styles.companyHeaderValue}>{empresa.endereco || "Nao informado"}</Text>
            </View>
            <View style={styles.companyHeaderItem}>
              <Text style={styles.companyHeaderLabel}>Data da coleta</Text>
              <Text style={styles.companyHeaderValue}>{empresa.dataColeta || "Nao informada"}</Text>
            </View>
            <View style={styles.companyHeaderItem}>
              <Text style={styles.companyHeaderLabel}>Horario da coleta</Text>
              <Text style={styles.companyHeaderValue}>{empresa.horario || "Nao informado"}</Text>
            </View>
            <View style={styles.companyHeaderItem}>
              <Text style={styles.companyHeaderLabel}>Total de colaboradores</Text>
              <Text style={styles.companyHeaderValue}>{String(empresa.qtdColaboradores || adesao.totalEquipe || adesao.totalParticipantes)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.tocCard}>
          <View style={styles.tocHead}>
            <Text style={styles.tocTitle}>Sumário</Text>
            <Text style={styles.tocLabel}>PAGINAS</Text>
          </View>
          <View style={styles.tocRow}>
            <Text style={styles.tocText}>1. Metodologia de analise</Text>
            <Text style={styles.tocPage}>2</Text>
          </View>
          <View style={styles.tocRow}>
            <Text style={styles.tocText}>2. LGPD e sigilo ocupacional</Text>
            <Text style={styles.tocPage}>2</Text>
          </View>
          <View style={styles.tocRow}>
            <Text style={styles.tocText}>3. Mapeamento Demográfico</Text>
            <Text style={styles.tocPage}>3</Text>
          </View>
          <View style={styles.tocRow}>
            <Text style={styles.tocText}>4. Dashboard Clínico I (Risco cardiovascular)</Text>
            <Text style={styles.tocPage}>4</Text>
          </View>
          <View style={styles.tocRow}>
            <Text style={styles.tocText}>5. Dashboard Clínico II (Risco cardiometabólico)</Text>
            <Text style={styles.tocPage}>5</Text>
          </View>
          <View style={styles.tocRow}>
            <Text style={styles.tocText}>6. Alterações glicêmicas e cruzamentos por IMC</Text>
            <Text style={styles.tocPage}>6</Text>
          </View>
          <View style={styles.tocRow}>
            <Text style={styles.tocText}>7. Dashboard Clínico III (Proporção global)</Text>
            <Text style={styles.tocPage}>6</Text>
          </View>
          <View style={styles.tocRow}>
            <Text style={styles.tocText}>8. Conclusão e assinatura técnica</Text>
            <Text style={styles.tocPage}>8</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Metodologia de análise</Text>
          <Text style={styles.sectionText}>{metodologiaTexto}</Text>
          <Text style={[styles.sectionText, { marginTop: 6 }]}>{metodologiaTextoComplementar}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LGPD e sigilo ocupacional</Text>
          <Text style={styles.sectionText}>{lgpdTexto}</Text>
          <Text style={[styles.sectionText, { marginTop: 6 }]}>{lgpdTextoComplementar}</Text>
        </View>

        <Footer pageNumber="Pagina 2" />
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>05. Mapeamento Demográfico</Text>
            <Text style={styles.headerSubtitle}>Proporções por gênero e faixa etária para direcionamento preventivo</Text>
          </View>
          {logoPath ? <Image src={logoPath} style={{ width: 42 }} /> : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Mapeamento Demográfico</Text>
          <View style={styles.chartDiscussionRow}>
            <View style={styles.chartCol}>
              <PieChart title="Gráfico 1 | Proporção por gênero" subtitle="Distribuição de homens e mulheres" total={total} data={generoData} />
              <Text style={styles.chartLegend}>Legenda: representação proporcional da composição por gênero.</Text>
            </View>
            <View style={{ width: 8 }} />
            <View style={[styles.discussionCol, { borderColor: palette.blueSoft }]}>
              <Text style={[styles.discussionTitle, { color: palette.blueStrong }]}>Leitura por gênero</Text>
              <Text style={styles.discussionText}>{discussaoGenero}</Text>
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
            <Text style={styles.headerTitle}>Dashboard Clínico I (Risco cardiovascular)</Text>
            <Text style={styles.headerSubtitle}>Hipertensão por estágio, comparação pressórica e cruzamento por faixa etária</Text>
          </View>
          {logoPath ? <Image src={logoPath} style={{ width: 42 }} /> : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gráfico 3 | Hipertensão por estágio</Text>
          <View style={styles.chartDiscussionRow}>
            <View style={styles.chartCol}>
              <PieChart
                title="Gráfico 3 | Hipertensão por estágio"
                subtitle="Classificação pressórica pela diretriz brasileira 2025"
                total={total}
                data={hipertensaoData}
              />
              <Text style={styles.chartLegend}>
                Diretriz 2025: Normal (sem classificação otima): sistólica {"<="} 120 e diastólica {"<"} 80 | Pré-hipertensão: 121-139 ou 80-89 | HAS 1: 140-159 ou 90-99 | HAS 2: 160-179 ou 100-109 | HAS 3: {">="}180 ou {">="}110.
              </Text>
            </View>
            <View style={{ width: 8 }} />
            <View style={styles.chartCol}>
              <Bars
                title="Gráfico complementar | PA normal x alterações pressóricas"
                subtitle="Comparação entre normalidade e alterações"
                total={total}
                data={pressaoNormalVsAlteradaData}
              />
            </View>
          </View>
          <View style={styles.chartDiscussionRow}>
            <View style={styles.chartCol}>
              <Bars
                title="Gráfico 4 | Alteração pressórica de acordo com faixa-etária"
                subtitle="Cruzamento entre pressão alterada e idade"
                total={total}
                data={pressaoFaixaEtariaData}
              />
            </View>
            <View style={{ width: 8 }} />
            <View style={styles.chartCol}>
              <Bars title="Gráfico 5 | Batimentos cardíacos" subtitle="Bradicardia, normocardia e taquicardia" total={total} data={fcData} />
            </View>
          </View>
          <View style={[styles.helperCard, { borderColor: palette.blueSoft }]}>
            <View style={styles.helperHead}>
              <Text style={[styles.helperIcon, { backgroundColor: palette.blueStrong }]}>i</Text>
            </View>
            <Text style={styles.helperText}>
              A Hipertensão Arterial Sistêmica (HAS) é uma doença perigosa justamente por ser silenciosa. Sem apresentar sintomas visíveis na maioria das vezes, ela força as paredes dos vasos sanguíneos dia após dia, sobrecarregando órgãos vitais de forma irreversível.
            </Text>
          </View>
        </View>

        <Footer pageNumber="Pagina 4" />
      </Page>

      <Page size="A4" style={styles.page}>
        <PageVectors />
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Dashboard Clínico II (Risco cardiometabólico)</Text>
            <Text style={styles.headerSubtitle}>Obesidade por estágio e cruzamentos por faixa-etária e gênero</Text>
          </View>
          {logoPath ? <Image src={logoPath} style={{ width: 42 }} /> : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Risco cardiometabólico</Text>
          <View style={styles.chartDiscussionRow}>
            <View style={styles.chartCol}>
              <Bars
                title="Gráfico 6 | Obesidade por estágio"
                subtitle="Sobrepeso, obesidade e obesidade grave"
                total={total}
                data={obesidadeData}
              />
            </View>
            <View style={{ width: 8 }} />
            <View style={styles.chartCol}>
              <Bars
                title="Gráfico 7 | Obesidade por faixa-etária"
                subtitle="IMC alterado por faixa etária"
                total={total}
                data={obesidadeFaixaEtariaData}
              />
            </View>
          </View>
          <View style={styles.chartDiscussionRow}>
            <View style={styles.chartCol}>
              <Bars
                title="Gráfico 8 | Obesidade por gênero"
                subtitle="IMC alterado entre feminino e masculino"
                total={total}
                data={obesidadeGeneroData}
              />
            </View>
          </View>
          <View style={[styles.helperCard, { borderColor: palette.amberSoft }]}>
            <View style={styles.helperHead}>
              <Text style={[styles.helperIcon, { backgroundColor: palette.amber }]}>i</Text>
            </View>
            <Text style={styles.helperText}>
              A obesidade é uma doença crônica e inflamatória que vai muito além da questão estética. O acúmulo excessivo de gordura corporal, especialmente na região abdominal, funciona como um gatilho para diversas outras complicações severas, sobrecarregando o organismo como um todo.
            </Text>
          </View>
        </View>

        <Footer pageNumber="Pagina 5" />
      </Page>

      <Page size="A4" style={styles.page}>
        <PageVectors />
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Dashboard Clínico III (Proporção global)</Text>
            <Text style={styles.headerSubtitle}>Risco glicêmico, correlação de alterações e comorbidades autorreferidas</Text>
          </View>
          {logoPath ? <Image src={logoPath} style={{ width: 42 }} /> : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Risco glicêmico e proporção global</Text>
          <View style={styles.chartDiscussionRow}>
            <View style={styles.chartCol}>
              <Bars title="Gráfico 9 | Alterações glicêmicas" subtitle="Hipoglicemia, normoglicemia e hiperglicemia" total={total} data={glicemiaData} />
            </View>
            <View style={{ width: 8 }} />
            <View style={styles.chartCol}>
              <Bars
                title="Gráfico 10 | Alterações glicêmicas de acordo com IMC"
                subtitle="Cruzamento entre glicemia alterada e IMC"
                total={total}
                data={glicemiaImcData}
              />
            </View>
          </View>
          <View style={[styles.helperCard, { borderColor: palette.wineSoft }]}>
            <View style={styles.helperHead}>
              <Text style={[styles.helperIcon, { backgroundColor: palette.wine }]}>i</Text>
            </View>
            <Text style={styles.helperText}>
              O Diabetes Mellitus é uma doença crônica silenciosa e progressiva, caracterizada pela incapacidade do corpo de produzir ou utilizar adequadamente a insulina. Isso faz com que os níveis de açúcar no sangue (glicose) fiquem constantemente elevados, agindo como um agente silenciosamente corrosivo por dentro do organismo ao longo dos anos.
            </Text>
          </View>
        </View>

        <Footer pageNumber="Pagina 6" />
      </Page>

      <Page size="A4" style={styles.page}>
        <PageVectors />
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Dashboard Clínico III (Proporção global)</Text>
            <Text style={styles.headerSubtitle}>Correlação de alterações e comorbidades autorreferidas</Text>
          </View>
          {logoPath ? <Image src={logoPath} style={{ width: 42 }} /> : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Proporção global</Text>
          <ColumnsChart
            title="Gráfico 11 | Correlação de alterações"
            subtitle="Saudáveis, pressão alterada, IMC alterado e hiperglicemia"
            total={total}
            data={correlacaoGlobalData}
          />
          <View style={styles.chartDiscussionRow}>
            <View style={styles.chartCol}>
              <Bars title="Gráfico 12 | Proporção de comorbidades" subtitle="Condições autorreferidas mais prevalentes" total={total} data={comorbidadesData} />
            </View>
          </View>
          <View style={[styles.helperCard, { borderColor: palette.blueSoft }]}>
            <View style={styles.helperHead}>
              <Text style={[styles.helperIcon, { backgroundColor: palette.blueStrong }]}>i</Text>
            </View>
            <Text style={styles.helperText}>{discussaoCruzada}</Text>
          </View>
        </View>

        <Footer pageNumber="Pagina 7" />
      </Page>

      <Page size="A4" style={styles.page}>
        <PageVectors />
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>08. Conclusão, Atividades Preventivas e Assinatura</Text>
            <Text style={styles.headerSubtitle}>Fechamento executivo orientado à implementação</Text>
          </View>
          {logoPath ? <Image src={logoPath} style={{ width: 42 }} /> : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conclusão</Text>
          <Text style={styles.sectionText}>{conclusaoExecutiva}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Atividades preventivas recomendadas conforme resultados</Text>
          {atividadesPreventivas.map((atividade, index) => {
            const color = preventiveColors[index % preventiveColors.length];
            return (
              <View key={`atividade-${index}`} style={[styles.preventiveCard, { borderColor: color }]}>
                <View style={styles.preventiveRow}>
                  <Text style={[styles.preventiveBadge, { backgroundColor: color }]}>{`${index + 1}`}</Text>
                  <Text style={styles.preventiveText}>{atividade}</Text>
                </View>
              </View>
            );
          })}
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
