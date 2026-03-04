import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { DadosRelatorio } from "@/types";

const palette = {
  ink: "#0f172a",
  slate: "#475569",
  muted: "#94a3b8",
  line: "#e2e8f0",
  bgSoft: "#f8fafc",
  primary: "#0f766e",
  primarySoft: "#ccfbf1",
  blue: "#2563eb",
  blueSoft: "#dbeafe",
  amber: "#d97706",
  amberSoft: "#fef3c7",
  red: "#dc2626",
  redSoft: "#fee2e2",
  green: "#16a34a",
  greenSoft: "#dcfce7",
  violet: "#7c3aed",
  violetSoft: "#ede9fe",
  cyan: "#0891b2",
  cyanSoft: "#cffafe",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 34,
    paddingBottom: 34,
    paddingHorizontal: 34,
    fontFamily: "Helvetica",
    color: palette.ink,
    backgroundColor: "#ffffff",
  },
  coverBlock: {
    flex: 1,
    justifyContent: "space-between",
  },
  coverTop: {
    borderBottomWidth: 1,
    borderBottomColor: palette.line,
    paddingBottom: 24,
  },
  coverTitle: {
    fontSize: 31,
    lineHeight: 1.2,
    fontWeight: "bold",
    color: palette.ink,
    marginTop: 18,
  },
  coverSubtitle: {
    fontSize: 14,
    color: palette.slate,
    marginTop: 10,
  },
  coverCompany: {
    marginTop: 28,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: palette.bgSoft,
  },
  coverMetaLabel: {
    fontSize: 8,
    color: palette.muted,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  coverMetaValue: {
    fontSize: 13,
    color: palette.ink,
    fontWeight: "bold",
    marginBottom: 10,
  },
  coverFooter: {
    borderTopWidth: 1,
    borderTopColor: palette.line,
    paddingTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  coverFooterText: {
    fontSize: 9,
    color: palette.slate,
  },
  coverTag: {
    fontSize: 8,
    color: palette.primary,
    backgroundColor: palette.primarySoft,
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: palette.line,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: palette.ink,
    marginBottom: 3,
  },
  headerSubtitle: {
    fontSize: 8,
    color: palette.slate,
  },
  kpiRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  kpiCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#ffffff",
  },
  kpiTitle: {
    fontSize: 7,
    color: palette.muted,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: palette.ink,
  },
  kpiDetail: {
    fontSize: 8,
    color: palette.slate,
    marginTop: 3,
  },
  card: {
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    padding: 12,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: palette.ink,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 8,
    color: palette.slate,
    marginBottom: 10,
  },
  stackedTrack: {
    width: "100%",
    height: 13,
    backgroundColor: palette.bgSoft,
    borderRadius: 99,
    flexDirection: "row",
    overflow: "hidden",
    marginBottom: 10,
  },
  stackedSegment: {
    height: "100%",
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  legendLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 99,
    marginRight: 6,
  },
  legendLabel: {
    fontSize: 8,
    color: palette.ink,
  },
  legendValue: {
    fontSize: 8,
    color: palette.slate,
  },
  splitRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  splitCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    padding: 12,
  },
  barsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 108,
    marginBottom: 8,
  },
  barCol: {
    width: "22%",
    alignItems: "center",
  },
  bar: {
    width: "74%",
    borderRadius: 3,
    marginBottom: 5,
  },
  barValue: {
    fontSize: 8,
    color: palette.ink,
    marginBottom: 2,
  },
  barLabel: {
    fontSize: 7,
    color: palette.slate,
    textAlign: "center",
  },
  rankedRow: {
    marginBottom: 8,
  },
  rankedHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  rankedLabel: {
    fontSize: 8,
    color: palette.ink,
  },
  rankedValue: {
    fontSize: 8,
    color: palette.slate,
  },
  rankedTrack: {
    width: "100%",
    height: 8,
    borderRadius: 99,
    backgroundColor: palette.bgSoft,
    overflow: "hidden",
  },
  rankedFill: {
    height: "100%",
    borderRadius: 99,
  },
  insightRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  insightCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 9,
    backgroundColor: "#ffffff",
  },
  insightTitle: {
    fontSize: 8,
    fontWeight: "bold",
    marginBottom: 4,
  },
  insightText: {
    fontSize: 8,
    color: palette.slate,
    lineHeight: 1.35,
  },
  summaryBox: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: palette.blueSoft,
    backgroundColor: "#f8fbff",
    borderRadius: 8,
    padding: 10,
  },
  summaryTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: palette.blue,
    marginBottom: 5,
  },
  summaryText: {
    fontSize: 8,
    color: palette.slate,
    lineHeight: 1.35,
  },
  footer: {
    position: "absolute",
    left: 34,
    right: 34,
    bottom: 18,
    borderTopWidth: 1,
    borderTopColor: palette.line,
    paddingTop: 7,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 8,
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
      <Text style={styles.kpiTitle}>{title}</Text>
      <Text style={styles.kpiValue}>{value}</Text>
      <Text style={styles.kpiDetail}>{detail}</Text>
    </View>
  );
}

function StackedDistribution({
  title,
  subtitle,
  segments,
  total,
}: {
  title: string;
  subtitle: string;
  segments: Segment[];
  total: number;
}) {
  const segmentTotal = segments.reduce((acc, segment) => acc + Math.max(segment.value, 0), 0);
  const safeTotal = Math.max(total, segmentTotal, 1);
  const withPct = segments.map((segment) => ({
    ...segment,
    pct: clamp(percent(segment.value, safeTotal), 0, 100),
  }));

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
      <View style={styles.stackedTrack}>
        {withPct.map((segment, index) => (
          <View
            key={`${segment.label}-${index}`}
            style={[styles.stackedSegment, { width: `${segment.pct}%`, backgroundColor: segment.color }]}
          />
        ))}
      </View>
      {withPct.map((segment, index) => (
        <View key={`${segment.label}-legend-${index}`} style={styles.legendRow}>
          <View style={styles.legendLeft}>
            <View style={[styles.dot, { backgroundColor: segment.color }]} />
            <Text style={styles.legendLabel}>{segment.label}</Text>
          </View>
          <Text style={styles.legendValue}>
            {segment.value} pessoas ({formatPct(segment.pct)})
          </Text>
        </View>
      ))}
    </View>
  );
}

function VerticalBarMiniChart({
  title,
  subtitle,
  data,
  max,
}: {
  title: string;
  subtitle: string;
  data: Segment[];
  max: number;
}) {
  const safeMax = Math.max(max, 1);
  return (
    <View style={styles.splitCard}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
      <View style={styles.barsRow}>
        {data.map((item, index) => {
          const height = 10 + (item.value / safeMax) * 84;
          return (
            <View key={`${item.label}-${index}`} style={styles.barCol}>
              <Text style={styles.barValue}>{item.value}</Text>
              <View style={[styles.bar, { height, backgroundColor: item.color }]} />
              <Text style={styles.barLabel}>{item.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function RankedBars({
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
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
      {data.map((item, index) => {
        const pct = clamp(percent(item.value, safeTotal), 0, 100);
        return (
          <View key={`${item.label}-${index}`} style={styles.rankedRow}>
            <View style={styles.rankedHead}>
              <Text style={styles.rankedLabel}>{item.label}</Text>
              <Text style={styles.rankedValue}>
                {item.value} ({formatPct(pct)})
              </Text>
            </View>
            <View style={styles.rankedTrack}>
              <View style={[styles.rankedFill, { width: `${pct}%`, backgroundColor: item.color }]} />
            </View>
          </View>
        );
      })}
    </View>
  );
}

export function RelatorioSaudePDF({ dados, logoPath }: { dados: DadosRelatorio; logoPath?: string }) {
  const { empresa, adesao, idade, genero, imc, pressaoArterial } = dados;
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
  const adesaoPct = clamp(adesao.percentualAdesao || 0, 0, 100);

  const imcSegments: Segment[] = [
    { label: "Magreza", value: imc.magreza, color: palette.cyan },
    { label: "Normal", value: imc.normal, color: palette.green },
    { label: "Sobrepeso", value: imc.sobrepeso, color: palette.amber },
    { label: "Obesidade", value: imc.obesidade, color: "#f97316" },
    { label: "Obesidade grave", value: imc.obesidadeGrave, color: palette.red },
  ];

  const paSegments: Segment[] = [
    { label: "Otima/Normal", value: pressaoArterial.otima + pressaoArterial.normal, color: palette.green },
    { label: "Pre-hipertensao", value: pressaoArterial.preHipertensao, color: palette.amber },
    { label: "HAS estagio 1", value: pressaoArterial.hipertensaoEst1, color: "#fb923c" },
    { label: "HAS estagio 2", value: pressaoArterial.hipertensaoEst2, color: "#ef4444" },
    { label: "HAS estagio 3", value: pressaoArterial.hipertensaoEst3, color: "#b91c1c" },
  ];

  const idadeBars: Segment[] = idade.faixas.map((faixa, index) => {
    const colors = [palette.blue, palette.cyan, palette.violet, palette.primary];
    return { label: faixa.label, value: faixa.valor, color: colors[index] ?? palette.blue };
  });

  const generoBars: Segment[] = [
    { label: "Feminino", value: genero.feminino, color: "#ec4899" },
    { label: "Masculino", value: genero.masculino, color: palette.blue },
  ];

  const glicemia = dados.glicemia;
  const glicemiaSegments: Segment[] = glicemia
    ? [
        { label: "Hipoglicemia", value: glicemia.hipoglicemia ?? 0, color: palette.cyan },
        { label: "Normoglicemia", value: glicemia.normoglicemia ?? glicemia.normal, color: palette.green },
        { label: "Hiperglicemia", value: glicemia.hiperglicemia ?? glicemia.alterada, color: palette.red },
      ]
    : [];

  const fc = dados.frequenciaCardiaca;
  const fcSegments: Segment[] = fc
    ? [
        { label: "Bradicardia", value: fc.bradicardia ?? 0, color: palette.violet },
        { label: "Normocardia", value: fc.normocardia ?? fc.normal, color: palette.green },
        { label: "Taquicardia", value: fc.taquicardia ?? fc.alterada, color: palette.red },
      ]
    : [];

  const comorbidadesRanked: Segment[] = [
    { label: "Hipertensao (HAS)", value: comorbidades.has, color: "#f97316" },
    { label: "Diabetes", value: comorbidades.diabetes, color: palette.red },
    { label: "Dislipidemia", value: comorbidades.dislipidemia, color: palette.amber },
    { label: "Saude mental", value: comorbidades.saudeMental, color: palette.blue },
    { label: "Respiratoria", value: comorbidades.respiratoria, color: palette.cyan },
    { label: "Cardiovascular", value: comorbidades.cardiovascular, color: palette.violet },
    { label: "Tabagismo", value: comorbidades.tabagismo, color: "#334155" },
    { label: "Etilismo", value: comorbidades.etilismo, color: "#475569" },
  ].sort((a, b) => b.value - a.value);

  const topComorbidades = comorbidadesRanked.filter((item) => item.value > 0).slice(0, 3);
  const riscoMetabolicoPct = percent(imc.sobrepeso + imc.obesidade + imc.obesidadeGrave, total);
  const riscoPressoricoPct = percent(
    pressaoArterial.preHipertensao +
      pressaoArterial.hipertensaoEst1 +
      pressaoArterial.hipertensaoEst2 +
      pressaoArterial.hipertensaoEst3,
    total
  );
  const riscoGlicemicoPct = glicemia ? percent(glicemia.hiperglicemia ?? glicemia.alterada, total) : 0;
  const indiceRisco = (riscoMetabolicoPct + riscoPressoricoPct + riscoGlicemicoPct) / 3;

  const criticidade =
    indiceRisco >= 45 ? "Critico" : indiceRisco >= 30 ? "Elevado" : indiceRisco >= 20 ? "Moderado" : "Controlado";

  const insightOperacional =
    topComorbidades.length > 0
      ? `${topComorbidades[0].label} e ${topComorbidades[1]?.label ?? topComorbidades[0].label} lideram os agravos e devem ser o foco da estrategia preventiva do proximo ciclo.`
      : "Nao houve prevalencia alta de comorbidades declaradas na amostra atual.";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={{ position: "absolute", top: 0, right: 0, width: 220, height: 220, backgroundColor: palette.primarySoft, borderBottomLeftRadius: 220 }} />
        <View style={{ position: "absolute", top: 92, right: 70, width: 120, height: 120, backgroundColor: palette.blueSoft, borderRadius: 120 }} />
        <View style={styles.coverBlock}>
          <View style={styles.coverTop}>
            {logoPath ? <Image src={logoPath} style={{ width: 130, marginBottom: 8 }} /> : null}
            <Text style={styles.coverTitle}>Relatorio de Saude Ocupacional</Text>
            <Text style={styles.coverSubtitle}>Painel executivo com leitura clinica e foco em acao preventiva</Text>
            <View style={styles.coverCompany}>
              <Text style={styles.coverMetaLabel}>Empresa</Text>
              <Text style={styles.coverMetaValue}>{empresa.nome}</Text>
              {empresa.profissional && (
                <>
                  <Text style={styles.coverMetaLabel}>Profissional Responsavel</Text>
                  <Text style={styles.coverMetaValue}>{empresa.profissional}</Text>
                </>
              )}
              <Text style={styles.coverMetaLabel}>Data da coleta</Text>
              <Text style={styles.coverMetaValue}>{empresa.dataColeta || "Nao informada"}</Text>
              <Text style={styles.coverMetaLabel}>Horario</Text>
              <Text style={[styles.coverMetaValue, { marginBottom: 0 }]}>{empresa.horario || "Nao informado"}</Text>
            </View>
          </View>
          <View style={styles.coverFooter}>
            <Text style={styles.coverFooterText}>MEGGA WORK | Gestao Estrategica em SST</Text>
            <Text style={styles.coverTag}>Documento confidencial</Text>
          </View>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>01. Dashboard populacional</Text>
            <Text style={styles.headerSubtitle}>Distribuicao dos principais indicadores clinicos</Text>
          </View>
          {logoPath ? <Image src={logoPath} style={{ width: 42 }} /> : null}
        </View>

        <View style={styles.kpiRow}>
          <KpiCard
            title="Participantes"
            value={String(adesao.totalParticipantes)}
            detail={`Base analisada de ${adesao.totalEquipe || adesao.totalParticipantes} colaboradores`}
            marginRight={8}
          />
          <KpiCard title="Taxa de adesao" value={formatPct(adesaoPct)} detail="Cobertura do quadro funcional" marginRight={8} />
          <KpiCard title="Indice global de risco" value={formatPct(indiceRisco)} detail={`Classificacao atual: ${criticidade}`} />
        </View>

        <StackedDistribution
          title="Perfil nutricional (IMC)"
          subtitle="Distribuicao percentual da populacao avaliada"
          segments={imcSegments}
          total={total}
        />

        <StackedDistribution
          title="Pressao arterial"
          subtitle="Escala de pressao com destaque para zonas de risco"
          segments={paSegments}
          total={total}
        />

        <View style={styles.splitRow}>
          <VerticalBarMiniChart
            title="Faixas etarias"
            subtitle="Volume por grupo de idade"
            data={idadeBars}
            max={Math.max(...idadeBars.map((item) => item.value), 1)}
          />
          <View style={{ width: 8 }} />
          <VerticalBarMiniChart
            title="Distribuicao por genero"
            subtitle="Composicao da amostra"
            data={generoBars}
            max={Math.max(...generoBars.map((item) => item.value), 1)}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Relatorio de Saude Ocupacional</Text>
          <Text style={styles.footerText}>Pagina 2</Text>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>02. Riscos, comorbidades e direcionamento</Text>
            <Text style={styles.headerSubtitle}>Priorizacao clinica para plano de acao do proximo ciclo</Text>
          </View>
          {logoPath ? <Image src={logoPath} style={{ width: 42 }} /> : null}
        </View>

        <RankedBars
          title="Ranking de comorbidades"
          subtitle="Prevalencia sobre participantes avaliados"
          total={total}
          data={comorbidadesRanked}
        />

        {glicemiaSegments.length > 0 ? (
          <StackedDistribution
            title="Glicemia capilar"
            subtitle="Comportamento glicemico da amostra"
            segments={glicemiaSegments}
            total={total}
          />
        ) : null}

        {fcSegments.length > 0 ? (
          <StackedDistribution
            title="Frequencia cardiaca"
            subtitle="Distribuicao da resposta cardiaca em repouso"
            segments={fcSegments}
            total={total}
          />
        ) : null}

        <View style={styles.insightRow}>
          <View style={[styles.insightCard, { borderColor: palette.redSoft, marginRight: 8, backgroundColor: "#fff7f7" }]}>
            <Text style={[styles.insightTitle, { color: palette.red }]}>Risco metabolico</Text>
            <Text style={styles.insightText}>
              {formatPct(riscoMetabolicoPct)} da amostra apresenta sobrepeso ou obesidade. A recomendacao e iniciar linha de
              cuidado com nutricao, atividade orientada e monitoramento trimestral.
            </Text>
          </View>
          <View style={[styles.insightCard, { borderColor: palette.amberSoft, marginRight: 8, backgroundColor: "#fffaf0" }]}>
            <Text style={[styles.insightTitle, { color: palette.amber }]}>Risco pressorico</Text>
            <Text style={styles.insightText}>
              {formatPct(riscoPressoricoPct)} em zona de pre-hipertensao ou hipertensao. Sugerido reforco de rastreio, trilha de
              autocuidado e acompanhamento individual.
            </Text>
          </View>
          <View style={[styles.insightCard, { borderColor: palette.blueSoft, backgroundColor: "#f8fbff" }]}>
            <Text style={[styles.insightTitle, { color: palette.blue }]}>Leitura executiva</Text>
            <Text style={styles.insightText}>{insightOperacional}</Text>
          </View>
        </View>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Conclusao clinica</Text>
          <Text style={styles.summaryText}>
            O cenario atual indica criticidade {criticidade.toLowerCase()} com indice consolidado de {formatPct(indiceRisco)}.
            A recomendacao e executar um plano de 90 dias com metas objetivas para adesao, reducao de risco cardiometabolico e
            reavaliacao amostral para medir evolucao de resultado.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>MEGGA WORK | Estrategia preventiva baseada em dados</Text>
          <Text style={styles.footerText}>Pagina 3</Text>
        </View>
      </Page>
    </Document>
  );
}
