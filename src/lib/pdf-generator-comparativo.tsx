import React from "react";
import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { CategoriaComparativa, DadosRelatorioComparativo } from "@/types";

const c = {
  ink: "#0f172a",
  muted: "#64748b",
  white: "#ffffff",
  slate100: "#f1f5f9",
  slate200: "#e2e8f0",
  slate300: "#cbd5e1",
  navy: "#0b1f3a",
  blue: "#2563eb",
  cyan: "#06b6d4",
  teal: "#14b8a6",
  emerald: "#10b981",
  lime: "#84cc16",
  amber: "#f59e0b",
  orange: "#f97316",
  rose: "#f43f5e",
  red: "#ef4444",
  violet: "#8b5cf6",
  magenta: "#db2777",
};

const s = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 9, color: c.ink, backgroundColor: c.white },
  cover: { backgroundColor: c.navy, height: "100%", paddingHorizontal: 34, paddingVertical: 28 },
  coverBandTop: { height: 8, backgroundColor: c.cyan, marginBottom: 14 },
  coverBandMid: { height: 8, backgroundColor: c.violet, marginBottom: 14 },
  coverBandBot: { height: 8, backgroundColor: c.rose, marginBottom: 24 },
  coverLogo: { width: 130, height: 40, objectFit: "contain", marginBottom: 24 },
  coverEyebrow: { color: "#93c5fd", fontSize: 9, letterSpacing: 2, marginBottom: 10 },
  coverTitle: { color: c.white, fontSize: 33, fontFamily: "Helvetica-Bold", lineHeight: 1.06 },
  coverSub: { color: "#bfdbfe", fontSize: 12, marginTop: 14, marginBottom: 18 },
  chipRow: { flexDirection: "row", marginBottom: 16 },
  chipA: { backgroundColor: "rgba(6,182,212,0.18)", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, marginRight: 6 },
  chipB: { backgroundColor: "rgba(139,92,246,0.20)", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, marginRight: 6 },
  chipC: { backgroundColor: "rgba(244,63,94,0.22)", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  chipTxt: { color: c.white, fontSize: 7.5, fontFamily: "Helvetica-Bold" },
  coverInfo: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderLeftWidth: 4,
    borderLeftColor: c.cyan,
    borderRadius: 10,
    padding: 12,
  },
  coverInfoTxt: { color: c.white, fontSize: 9, marginBottom: 4 },
  header: {
    marginHorizontal: 28,
    marginTop: 18,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: c.navy,
    paddingBottom: 6,
  },
  headerLogo: { width: 86, height: 26, objectFit: "contain" },
  headerTxt: { fontSize: 8, color: c.muted },
  body: { marginHorizontal: 28, paddingBottom: 54 },
  secTitle: {
    fontSize: 14,
    color: c.navy,
    fontFamily: "Helvetica-Bold",
    borderBottomWidth: 2,
    borderBottomColor: c.cyan,
    paddingBottom: 4,
    marginBottom: 8,
  },
  intro: { fontSize: 9, color: c.ink, lineHeight: 1.5, marginBottom: 10 },
  kpiGrid: { flexDirection: "row", marginBottom: 12 },
  kpi: {
    flex: 1,
    borderRadius: 12,
    padding: 10,
    marginHorizontal: 3,
    borderWidth: 1,
  },
  kpiLabel: { fontSize: 7, color: c.white, marginBottom: 4, textTransform: "uppercase" },
  kpiVal: { fontSize: 16, color: c.white, fontFamily: "Helvetica-Bold", marginBottom: 2 },
  kpiSub: { fontSize: 7.5, color: c.white },
  panel: {
    backgroundColor: c.slate100,
    borderWidth: 1,
    borderColor: c.slate200,
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  panelTitle: { fontSize: 10.5, color: c.navy, fontFamily: "Helvetica-Bold", marginBottom: 8 },
  legendRow: { flexDirection: "row", marginBottom: 8 },
  legendItem: { flexDirection: "row", alignItems: "center", marginRight: 10 },
  legendDot: { width: 8, height: 8, borderRadius: 2, marginRight: 4 },
  legendTxt: { fontSize: 7.5, color: c.muted },
  chartRow: { marginBottom: 8 },
  chartLabel: { fontSize: 8, color: c.ink, marginBottom: 3, fontFamily: "Helvetica-Bold" },
  chartWrap: { flexDirection: "row", alignItems: "center" },
  chartBars: { flex: 1, marginRight: 8 },
  barTrack: { height: 8, borderRadius: 999, backgroundColor: c.slate300, marginBottom: 3 },
  barBefore: { height: 8, borderRadius: 999, backgroundColor: c.blue },
  barAfter: { height: 8, borderRadius: 999, backgroundColor: c.magenta },
  valCol: { width: 128 },
  valTxt: { fontSize: 7.2, color: c.muted, textAlign: "right", marginBottom: 1 },
  deltaUp: { color: c.red, fontFamily: "Helvetica-Bold" },
  deltaDown: { color: c.emerald, fontFamily: "Helvetica-Bold" },
  deltaFlat: { color: c.orange, fontFamily: "Helvetica-Bold" },
  rankGrid: { flexDirection: "row", marginTop: 4 },
  rankCol: {
    flex: 1,
    borderRadius: 10,
    padding: 9,
    borderWidth: 1,
    marginRight: 8,
  },
  rankTitle: { fontSize: 8.5, fontFamily: "Helvetica-Bold", marginBottom: 6 },
  rankItem: { fontSize: 8, marginBottom: 3, lineHeight: 1.35 },
  heatGrid: { flexDirection: "row", flexWrap: "wrap", marginTop: 3 },
  heatCard: {
    width: "31.3%",
    marginRight: "3%",
    marginBottom: 6,
    borderRadius: 10,
    padding: 8,
  },
  heatCardThird: { marginRight: 0 },
  heatName: { fontSize: 8, color: c.white, fontFamily: "Helvetica-Bold", marginBottom: 3 },
  heatVal: { fontSize: 12, color: c.white, fontFamily: "Helvetica-Bold" },
  heatSub: { fontSize: 7.2, color: c.white, marginTop: 2 },
  narrativeCard: {
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#bfdbfe",
    borderLeftWidth: 4,
    borderLeftColor: c.blue,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  narrativeTitle: { fontSize: 10.5, color: c.navy, fontFamily: "Helvetica-Bold", marginBottom: 6 },
  narrativeText: { fontSize: 8.6, color: c.ink, lineHeight: 1.55, marginBottom: 4 },
  planCard: {
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#bbf7d0",
    borderLeftWidth: 4,
    borderLeftColor: c.emerald,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  planItem: { flexDirection: "row", marginBottom: 6, alignItems: "flex-start" },
  planNum: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: c.emerald,
    color: c.white,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    paddingTop: 2,
    marginRight: 7,
  },
  planText: { flex: 1, fontSize: 8.5, color: c.ink, lineHeight: 1.45 },
  closingCard: {
    backgroundColor: "#fff7ed",
    borderWidth: 1,
    borderColor: "#fed7aa",
    borderLeftWidth: 4,
    borderLeftColor: c.orange,
    borderRadius: 10,
    padding: 10,
  },
  resultCard: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#dbeafe",
    borderLeftWidth: 4,
    borderLeftColor: c.violet,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  resultBlock: { marginBottom: 8 },
  resultLabel: { fontSize: 9, color: c.navy, fontFamily: "Helvetica-Bold", marginBottom: 3 },
  resultText: { fontSize: 8.6, color: c.ink, lineHeight: 1.5 },
  footer: {
    position: "absolute",
    bottom: 16,
    left: 28,
    right: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: c.slate200,
    paddingTop: 6,
  },
  footerTxt: { fontSize: 7, color: "#94a3b8" },
});

function pct(v: number): string {
  return `${v.toFixed(1).replace(".", ",")}%`;
}

function qtd(v: number): string {
  return `${Math.round(v)}`;
}

function delta(a: number, b: number): number {
  return b - a;
}

function sumQtd(linhas: CategoriaComparativa[], k: "antes" | "depois"): number {
  return linhas.reduce((acc, i) => acc + i[k].quantidade, 0);
}

function flattenSections(dados: DadosRelatorioComparativo): Array<{ sec: string; item: CategoriaComparativa }> {
  const pack = (sec: string, arr: CategoriaComparativa[]) => arr.map((item) => ({ sec, item }));
  return [
    ...pack("Idade", dados.idade),
    ...pack("Genero", dados.genero),
    ...pack("IMC", dados.imc),
    ...pack("Pressao", dados.pressaoArterial),
    ...pack("Glicemia", dados.glicemiaCapilar),
  ];
}

function Header({ logoPath }: { logoPath?: string }) {
  return (
    <View style={s.header}>
      {logoPath ? <Image src={logoPath} style={s.headerLogo} /> : <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold", color: c.navy }}>MEGGA WORK</Text>}
      <Text style={s.headerTxt}>BI Dashboard Comparativo | Antes x Depois</Text>
    </View>
  );
}

function Footer({ page }: { page: number }) {
  return (
    <View style={s.footer} fixed>
      <Text style={s.footerTxt}>MEGGA WORK - Saude e Seguranca do Trabalho</Text>
      <Text style={s.footerTxt}>Pagina {page}</Text>
    </View>
  );
}

function Kpi({
  label,
  value,
  sub,
  bg,
}: {
  label: string;
  value: string;
  sub: string;
  bg: string;
}) {
  return (
    <View style={[s.kpi, { backgroundColor: bg, borderColor: bg }]}>
      <Text style={s.kpiLabel}>{label}</Text>
      <Text style={s.kpiVal}>{value}</Text>
      <Text style={s.kpiSub}>{sub}</Text>
    </View>
  );
}

function ComparativePanel({
  title,
  lines,
  afterColor,
}: {
  title: string;
  lines: CategoriaComparativa[];
  afterColor: string;
}) {
  const maxPercent = Math.max(
    ...lines.map((l) => Math.max(l.antes.percentual, l.depois.percentual)),
    1
  );

  return (
    <View style={s.panel}>
      <Text style={s.panelTitle}>{title}</Text>
      <View style={s.legendRow}>
        <View style={s.legendItem}>
          <View style={[s.legendDot, { backgroundColor: c.blue }]} />
          <Text style={s.legendTxt}>Antes</Text>
        </View>
        <View style={s.legendItem}>
          <View style={[s.legendDot, { backgroundColor: afterColor }]} />
          <Text style={s.legendTxt}>Depois</Text>
        </View>
      </View>

      {lines.map((line, i) => {
        const d = delta(line.antes.percentual, line.depois.percentual);
        const wA = Math.max((line.antes.percentual / maxPercent) * 100, 1.2);
        const wD = Math.max((line.depois.percentual / maxPercent) * 100, 1.2);
        return (
          <View key={`${title}-${i}`} style={s.chartRow}>
            <Text style={s.chartLabel}>{line.nome}</Text>
            <View style={s.chartWrap}>
              <View style={s.chartBars}>
                <View style={s.barTrack}>
                  <View style={[s.barBefore, { width: `${wA}%` }]} />
                </View>
                <View style={s.barTrack}>
                  <View style={[s.barAfter, { width: `${wD}%`, backgroundColor: afterColor }]} />
                </View>
              </View>
              <View style={s.valCol}>
                <Text style={s.valTxt}>Antes: {qtd(line.antes.quantidade)} | {pct(line.antes.percentual)}</Text>
                <Text style={s.valTxt}>Depois: {qtd(line.depois.quantidade)} | {pct(line.depois.percentual)}</Text>
                <Text style={d > 0 ? [s.valTxt, s.deltaUp] : d < 0 ? [s.valTxt, s.deltaDown] : [s.valTxt, s.deltaFlat]}>
                  Variacao: {d > 0 ? "+" : ""}{pct(d)}
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

export function RelatorioComparativoPDF({
  dados,
  logoPath,
}: {
  dados: DadosRelatorioComparativo;
  logoPath?: string;
}) {
  const totalAntes = sumQtd(dados.genero, "antes");
  const totalDepois = sumQtd(dados.genero, "depois");
  const deltaBase = totalDepois - totalAntes;

  const all = flattenSections(dados)
    .map((x) => ({
      sec: x.sec,
      nome: x.item.nome,
      d: delta(x.item.antes.percentual, x.item.depois.percentual),
      antes: x.item.antes.percentual,
      depois: x.item.depois.percentual,
    }))
    .sort((a, b) => Math.abs(b.d) - Math.abs(a.d));

  const topMoves = all.slice(0, 4);
  const topRise = [...all].sort((a, b) => b.d - a.d).slice(0, 4);
  const topDrop = [...all].sort((a, b) => a.d - b.d).slice(0, 4);
  const topRiseIMC = [...dados.imc].sort(
    (a, b) => delta(b.antes.percentual, b.depois.percentual) - delta(a.antes.percentual, a.depois.percentual)
  )[0];
  const topRisePA = [...dados.pressaoArterial].sort(
    (a, b) => delta(b.antes.percentual, b.depois.percentual) - delta(a.antes.percentual, a.depois.percentual)
  )[0];
  const topRiseGlic = [...dados.glicemiaCapilar].sort(
    (a, b) => delta(b.antes.percentual, b.depois.percentual) - delta(a.antes.percentual, a.depois.percentual)
  )[0];
  const acimaPesoDepois = dados.imc
    .filter((i) => i.nome === "Sobrepeso" || i.nome === "Obesidade" || i.nome === "Obesidade grave")
    .reduce((acc, i) => acc + i.depois.percentual, 0);
  const pressaoRiscoDepois = dados.pressaoArterial
    .filter((i) => i.nome === "Pre-hipertensao" || i.nome === "HA Estagio 1" || i.nome === "HA Estagio 2" || i.nome === "HA Estagio 3")
    .reduce((acc, i) => acc + i.depois.percentual, 0);

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.cover}>
          <View style={s.coverBandTop} />
          <View style={s.coverBandMid} />
          <View style={s.coverBandBot} />
          {logoPath ? <Image src={logoPath} style={s.coverLogo} /> : null}
          <Text style={s.coverEyebrow}>PORTAL EQUILIBRIO SST</Text>
          <Text style={s.coverTitle}>BI DASHBOARD{"\n"}COMPARATIVO</Text>
          <Text style={s.coverSub}>Relatorio premium com leitura visual de alto impacto</Text>
          <View style={s.chipRow}>
            <View style={s.chipA}><Text style={s.chipTxt}>ANTES</Text></View>
            <View style={s.chipB}><Text style={s.chipTxt}>DEPOIS</Text></View>
            <View style={s.chipC}><Text style={s.chipTxt}>VARIACAO</Text></View>
          </View>
          <View style={s.coverInfo}>
            <Text style={s.coverInfoTxt}>Empresa: {dados.empresa.nome}</Text>
            <Text style={s.coverInfoTxt}>Endereco: {dados.empresa.endereco || "-"}</Text>
            <Text style={s.coverInfoTxt}>Primeira data: {dados.empresa.primeiraData}</Text>
            <Text style={s.coverInfoTxt}>Segunda data: {dados.empresa.segundaData}</Text>
          </View>
        </View>
        <Footer page={1} />
      </Page>

      <Page size="A4" style={s.page}>
        <Header logoPath={logoPath} />
        <View style={s.body}>
          <Text style={s.secTitle}>1. Executive Snapshot</Text>
          <Text style={s.intro}>
            Leitura rapida dos principais movimentos entre os dois ciclos de coleta.
            Cores quentes indicam crescimento, e frias indicam queda.
          </Text>

          <View style={s.kpiGrid}>
            <Kpi label="Base avaliada" value={`${qtd(totalAntes)} -> ${qtd(totalDepois)}`} sub="participantes por ciclo" bg={c.blue} />
            <Kpi label="Variacao da base" value={`${deltaBase > 0 ? "+" : ""}${qtd(deltaBase)}`} sub="diferenca absoluta" bg={deltaBase >= 0 ? c.emerald : c.red} />
            <Kpi label="Maior oscilacao" value={topMoves[0] ? topMoves[0].nome : "-"} sub={topMoves[0] ? `${topMoves[0].sec} | ${topMoves[0].d > 0 ? "+" : ""}${pct(topMoves[0].d)}` : "-"} bg={c.violet} />
          </View>

          <View style={s.panel}>
            <Text style={s.panelTitle}>Top variacoes (heat cards)</Text>
            <View style={s.heatGrid}>
              {topMoves.map((m, idx) => (
                <View
                  key={`${m.sec}-${m.nome}`}
                  style={idx % 3 === 2
                    ? [s.heatCard, s.heatCardThird, { backgroundColor: m.d >= 0 ? (idx % 2 === 0 ? c.rose : c.orange) : (idx % 2 === 0 ? c.teal : c.cyan) }]
                    : [s.heatCard, { backgroundColor: m.d >= 0 ? (idx % 2 === 0 ? c.rose : c.orange) : (idx % 2 === 0 ? c.teal : c.cyan) }]}
                >
                  <Text style={s.heatName}>{m.sec}</Text>
                  <Text style={s.heatVal}>{m.nome}</Text>
                  <Text style={s.heatSub}>Antes {pct(m.antes)} | Depois {pct(m.depois)}</Text>
                  <Text style={s.heatSub}>Delta {m.d > 0 ? "+" : ""}{pct(m.d)}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={s.rankGrid}>
            <View style={[s.rankCol, { backgroundColor: "#fff1f2", borderColor: "#fecdd3" }]}>
              <Text style={[s.rankTitle, { color: c.rose }]}>Top altas</Text>
              {topRise.map((i) => (
                <Text key={`up-${i.sec}-${i.nome}`} style={[s.rankItem, { color: c.rose }]}>
                  {i.sec} | {i.nome} | +{pct(i.d)}
                </Text>
              ))}
            </View>
            <View style={[s.rankCol, { backgroundColor: "#ecfeff", borderColor: "#a5f3fc", marginRight: 0 }]}>
              <Text style={[s.rankTitle, { color: c.teal }]}>Top quedas</Text>
              {topDrop.map((i) => (
                <Text key={`down-${i.sec}-${i.nome}`} style={[s.rankItem, { color: c.teal }]}>
                  {i.sec} | {i.nome} | {pct(i.d)}
                </Text>
              ))}
            </View>
          </View>
        </View>
        <Footer page={2} />
      </Page>

      <Page size="A4" style={s.page}>
        <Header logoPath={logoPath} />
        <View style={s.body}>
          <Text style={s.secTitle}>2. Demografia Comparativa</Text>
          <ComparativePanel title="Faixa etaria" lines={dados.idade} afterColor={c.violet} />
          <ComparativePanel title="Genero" lines={dados.genero} afterColor={c.cyan} />
        </View>
        <Footer page={3} />
      </Page>

      <Page size="A4" style={s.page}>
        <Header logoPath={logoPath} />
        <View style={s.body}>
          <Text style={s.secTitle}>3. Clinico e Metabolico</Text>
          <ComparativePanel title="IMC" lines={dados.imc} afterColor={c.lime} />
          <ComparativePanel title="Pressao arterial" lines={dados.pressaoArterial} afterColor={c.amber} />
          <ComparativePanel title="Glicemia capilar" lines={dados.glicemiaCapilar} afterColor={c.rose} />
        </View>
        <Footer page={4} />
      </Page>

      <Page size="A4" style={s.page}>
        <Header logoPath={logoPath} />
        <View style={s.body}>
          <Text style={s.secTitle}>4. Resultados Encontrados e Interpretacao</Text>

          <View style={s.resultCard}>
            <View style={s.resultBlock}>
              <Text style={s.resultLabel}>Resultado demografico</Text>
              <Text style={s.resultText}>
                A base comparativa variou de {qtd(totalAntes)} para {qtd(totalDepois)} participantes ({deltaBase > 0 ? "+" : ""}
                {qtd(deltaBase)}), com oscilacao de distribuicao por faixa etaria e genero conforme os graficos das secoes anteriores.
              </Text>
            </View>

            <View style={s.resultBlock}>
              <Text style={s.resultLabel}>Resultado nutricional (IMC)</Text>
              <Text style={s.resultText}>
                A categoria com maior crescimento percentual no IMC foi {topRiseIMC?.nome ?? "-"}
                ({topRiseIMC ? `${topRiseIMC.antes.percentual.toFixed(1).replace(".", ",")}% para ${topRiseIMC.depois.percentual.toFixed(1).replace(".", ",")}%` : "-"}).
                No consolidado do segundo ciclo, o grupo acima do peso representa {pct(acimaPesoDepois)} da amostra.
              </Text>
            </View>

            <View style={s.resultBlock}>
              <Text style={s.resultLabel}>Resultado cardiovascular (Pressao arterial)</Text>
              <Text style={s.resultText}>
                A principal variacao na pressao arterial ocorreu em {topRisePA?.nome ?? "-"}
                ({topRisePA ? `${topRisePA.antes.percentual.toFixed(1).replace(".", ",")}% para ${topRisePA.depois.percentual.toFixed(1).replace(".", ",")}%` : "-"}).
                Somando pre-hipertensao e hipertensao (estagios 1-3), o risco pressorico no segundo ciclo atingiu {pct(pressaoRiscoDepois)}.
              </Text>
            </View>

            <View style={s.resultBlock}>
              <Text style={s.resultLabel}>Resultado metabolico (Glicemia capilar)</Text>
              <Text style={s.resultText}>
                A maior variacao em glicemia foi observada em {topRiseGlic?.nome ?? "-"}
                ({topRiseGlic ? `${topRiseGlic.antes.percentual.toFixed(1).replace(".", ",")}% para ${topRiseGlic.depois.percentual.toFixed(1).replace(".", ",")}%` : "-"}).
                Este achado reforca a necessidade de acompanhamento metabolico continuo e orientacao individualizada.
              </Text>
            </View>

            <View style={s.resultBlock}>
              <Text style={s.resultLabel}>Leitura executiva</Text>
              <Text style={s.resultText}>
                Em conjunto, os resultados apontam mudancas relevantes no perfil de risco, justificando plano preventivo estruturado,
                monitoramento recorrente e priorizacao das categorias com maior crescimento percentual de risco.
              </Text>
            </View>
          </View>
        </View>
        <Footer page={5} />
      </Page>

      <Page size="A4" style={s.page}>
        <Header logoPath={logoPath} />
        <View style={s.body}>
          <Text style={s.secTitle}>5. Prevencao e Atividades Preventivas</Text>

          <View style={s.narrativeCard}>
            <Text style={s.narrativeTitle}>Analise preventiva dos resultados</Text>
            <Text style={s.narrativeText}>
              Os dados comparativos indicam pontos de atencao para saude ocupacional, com destaque para excesso de peso
              (sobrepeso + obesidades) em {pct(acimaPesoDepois)} da populacao avaliada no segundo ciclo, e perfis pressoricos
              de risco em {pct(pressaoRiscoDepois)} (pre-hipertensao e hipertensao em seus estagios).
            </Text>
            <Text style={s.narrativeText}>
              A leitura nao possui finalidade diagnostica, mas subsidia decisoes preventivas e o planejamento de campanhas
              de saude, monitoramento periodico e encaminhamento assistencial quando necessario.
            </Text>
          </View>

          <View style={s.planCard}>
            <Text style={s.narrativeTitle}>Plano de atividades preventivas (90 dias)</Text>
            <View style={s.planItem}>
              <Text style={s.planNum}>1</Text>
              <Text style={s.planText}>
                Realizar campanha de educacao alimentar com foco em reducao de ultraprocessados e controle de consumo de sodio,
                acompanhada por comunicacao interna semanal.
              </Text>
            </View>
            <View style={s.planItem}>
              <Text style={s.planNum}>2</Text>
              <Text style={s.planText}>
                Implantar rotina de monitoramento de pressao arterial e glicemia para grupos de maior risco, com registro de
                evolucao e criterios de encaminhamento ao atendimento medico.
              </Text>
            </View>
            <View style={s.planItem}>
              <Text style={s.planNum}>3</Text>
              <Text style={s.planText}>
                Promover acoes de atividade fisica laboral (ginastica laboral, pausas ativas e desafios mensais), com metas de
                adesao por setor e acompanhamento por liderancas.
              </Text>
            </View>
            <View style={s.planItem}>
              <Text style={s.planNum}>4</Text>
              <Text style={s.planText}>
                Estruturar trilha educativa sobre prevencao cardiovascular, sono, manejo do estresse e cessacao do tabagismo,
                conectando os temas ao perfil de risco identificado no comparativo.
              </Text>
            </View>
          </View>

          <View style={s.closingCard}>
            <Text style={s.narrativeTitle}>Encaminhamento e apresentacao executiva</Text>
            <Text style={s.narrativeText}>
              Recomenda-se apresentacao deste relatorio ao comite gestor e liderancas operacionais, com definicao de
              responsaveis por cada frente preventiva, cronograma de execucao e nova coleta comparativa para avaliacao de
              efetividade. O acompanhamento continuo fortalece o cuidado com o colaborador e reduz fatores de risco no ambiente de trabalho.
            </Text>
          </View>
        </View>
        <Footer page={6} />
      </Page>
    </Document>
  );
}
