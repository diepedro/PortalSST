import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { DadosRelatorio } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// Palette
// ─────────────────────────────────────────────────────────────────────────────
const c = {
  navy:        "#1e3a8a",
  blue:        "#3b82f6",
  blueLight:   "#93c5fd",
  blueBg:      "#eff6ff",
  green:       "#22c55e",
  greenDark:   "#16a34a",
  greenBg:     "#f0fdf4",
  greenText:   "#166534",
  teal:        "#0d9488",
  orange:      "#f97316",
  orangeBg:    "#fff7ed",
  orangeText:  "#9a3412",
  red:         "#ef4444",
  redDark:     "#991b1b",
  redBg:       "#fef2f2",
  redText:     "#991b1b",
  yellow:      "#eab308",
  pink:        "#ec4899",
  pinkBg:      "#fdf2f8",
  gray:        "#6b7280",
  grayLight:   "#9ca3af",
  bg:          "#f3f4f6",
  bgAlt:       "#f9fafb",
  white:       "#ffffff",
  black:       "#111827",
  border:      "#e5e7eb",
};

const ageColors  = ["#1e3a8a","#3b82f6","#60a5fa","#93c5fd"];
const imcColors  = { magreza:"#f59e0b", normal:"#10b981", sobrepeso:"#f97316", obesidade:"#ef4444", obesidadeGrave:"#991b1b" };
const paColors   = { otima:"#10b981", normal:"#059669", preHipertensao:"#eab308", hipertensaoEst1:"#f97316", hipertensaoEst2:"#ef4444", hipertensaoEst3:"#991b1b" };

// ─────────────────────────────────────────────────────────────────────────────
// Styles — ALL borders use longhand (react-pdf doesn't support shorthand strings)
// ─────────────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  // Pages
  page: { fontFamily:"Helvetica", fontSize:10, color:c.black, backgroundColor:c.white },

  // ── Cover ──
  coverPage:      { backgroundColor:c.navy, flexDirection:"column", height:"100%" },
  coverTopAccent: { height:8, backgroundColor:c.green },
  coverBotAccent: { height:8, backgroundColor:c.green },
  coverTopBar:    { flexDirection:"row", justifyContent:"space-between", alignItems:"flex-start",
                    paddingHorizontal:44, paddingTop:36, paddingBottom:24 },
  coverLogo:      { width:130, height:42, objectFit:"contain" },
  coverTopLabel:  { alignItems:"flex-end" },
  coverTopLabelSm:{ fontSize:8, color:"#93c5fd", letterSpacing:2 },
  coverTopLabelLg:{ fontSize:10, fontFamily:"Helvetica-Bold", color:c.green, letterSpacing:1.5 },
  coverDivider:   { height:1, marginHorizontal:44, backgroundColor:"rgba(255,255,255,0.12)" },
  coverMain:      { flex:1, justifyContent:"center", alignItems:"center", paddingHorizontal:50 },
  coverEyebrow:   { fontSize:10, color:"#93c5fd", letterSpacing:3, marginBottom:14 },
  coverTitle:     { fontSize:36, fontFamily:"Helvetica-Bold", color:c.white, textAlign:"center", lineHeight:1.15 },
  coverLine:      { width:64, height:4, backgroundColor:c.green, marginVertical:20 },
  coverSubtitle:  { fontSize:12, color:"#bfdbfe", textAlign:"center" },
  coverInfoStrip: { marginHorizontal:44, marginBottom:0, paddingHorizontal:24, paddingVertical:18,
                    backgroundColor:"rgba(255,255,255,0.07)", borderRadius:12,
                    borderLeftWidth:3, borderLeftColor:c.green },
  coverInfoRow:   { flexDirection:"row", justifyContent:"space-between", marginBottom:4 },
  coverInfoItem:  { alignItems:"center" },
  coverInfoLabel: { fontSize:8, color:"#93c5fd", marginBottom:4 },
  coverInfoVal:   { fontSize:14, fontFamily:"Helvetica-Bold", color:c.white },
  coverInfoAddr:  { marginTop:12, paddingTop:10, borderTopWidth:1, borderTopColor:"rgba(255,255,255,0.10)" },
  coverInfoAddrTxt:{ fontSize:8, color:"#93c5fd", textAlign:"center" },

  // ── Page chrome ──
  header:       { flexDirection:"row", justifyContent:"space-between", alignItems:"center",
                  borderBottomWidth:2, borderBottomColor:c.navy,
                  paddingBottom:8, marginHorizontal:40, marginTop:28, marginBottom:18 },
  headerLogo:   { width:90, height:29, objectFit:"contain" },
  headerLabel:  { fontSize:8, color:c.gray },
  footer:       { position:"absolute", bottom:18, left:40, right:40,
                  flexDirection:"row", justifyContent:"space-between",
                  borderTopWidth:1, borderTopColor:c.border, paddingTop:7 },
  footerTxt:    { fontSize:7, color:c.grayLight },
  body:         { marginHorizontal:40, flex:1, paddingBottom:60 },

  // ── Typography ──
  secTitle:     { fontSize:15, fontFamily:"Helvetica-Bold", color:c.navy,
                  marginBottom:10, paddingBottom:5,
                  borderBottomWidth:2, borderBottomColor:c.green },
  subTitle:     { fontSize:11, fontFamily:"Helvetica-Bold", color:c.navy, marginBottom:6, marginTop:12 },
  bodyTxt:      { fontSize:10, lineHeight:1.65, color:c.black, textAlign:"justify", marginBottom:8 },

  // ── Info box (company card) ──
  infoBox:      { backgroundColor:c.bg, borderRadius:8, padding:14, marginBottom:14,
                  borderLeftWidth:4, borderLeftColor:c.navy },
  infoRow:      { flexDirection:"row", marginBottom:3 },
  infoLabel:    { fontSize:9, fontFamily:"Helvetica-Bold", color:c.gray, width:90 },
  infoVal:      { fontSize:9, color:c.black, flex:1 },

  // ── KPI metric strip ──
  kpiStrip:     { flexDirection:"row", marginBottom:14 },
  kpiCard:      { flex:1, backgroundColor:c.bg, borderRadius:8, padding:10,
                  alignItems:"center", marginHorizontal:3 },
  kpiVal:       { fontSize:20, fontFamily:"Helvetica-Bold", color:c.navy },
  kpiLbl:       { fontSize:7, color:c.gray, marginTop:2, textAlign:"center" },

  // ── Horizontal bar chart ──
  barRow:       { flexDirection:"row", alignItems:"center", marginBottom:5 },
  barLbl:       { width:68, fontSize:9, color:c.gray, textAlign:"right", paddingRight:8 },
  barTrack:     { flex:1, height:20, backgroundColor:c.bg, borderRadius:4, flexDirection:"row", alignItems:"center" },
  barFill:      { height:20, borderRadius:4, justifyContent:"center", paddingHorizontal:6 },
  barFillTxt:   { fontSize:7, fontFamily:"Helvetica-Bold", color:c.white },
  barPct:       { width:38, fontSize:9, fontFamily:"Helvetica-Bold", color:c.navy, textAlign:"right" },

  // ── Stacked bar ──
  stackWrap:    { marginVertical:8 },
  stackBar:     { flexDirection:"row", height:28, borderRadius:6 },
  stackSeg:     { height:28, justifyContent:"center", alignItems:"center" },
  stackSegTxt:  { fontSize:7, fontFamily:"Helvetica-Bold", color:c.white },
  legendRow:    { flexDirection:"row", flexWrap:"wrap", justifyContent:"center", marginTop:8 },
  legendItem:   { flexDirection:"row", alignItems:"center", marginRight:12, marginBottom:4 },
  legendDot:    { width:9, height:9, borderRadius:2, marginRight:4 },
  legendTxt:    { fontSize:8, color:c.gray },

  // ── Gender card pair ──
  genderRow:    { flexDirection:"row", marginTop:8 },
  genderCard:   { flex:1, borderRadius:8, padding:10, alignItems:"center", marginHorizontal:3 },
  genderBig:    { fontSize:20, fontFamily:"Helvetica-Bold" },
  genderSub:    { fontSize:8, color:c.gray, marginTop:2 },

  // ── Data table ──
  tbl:          { marginVertical:8, borderRadius:6, borderWidth:1, borderColor:c.border },
  tblHead:      { flexDirection:"row", backgroundColor:c.navy, borderTopLeftRadius:5, borderTopRightRadius:5 },
  tblHeadCell:  { flex:1, paddingVertical:7, paddingHorizontal:9, fontSize:9, fontFamily:"Helvetica-Bold", color:c.white },
  tblRow:       { flexDirection:"row", borderBottomWidth:1, borderBottomColor:c.border },
  tblRowAlt:    { flexDirection:"row", backgroundColor:c.bgAlt, borderBottomWidth:1, borderBottomColor:c.border },
  tblCell:      { flex:1, paddingVertical:6, paddingHorizontal:9, fontSize:9, color:c.black },
  tblCellBold:  { flex:1, paddingVertical:6, paddingHorizontal:9, fontSize:9, fontFamily:"Helvetica-Bold", color:c.black },

  // ── Callout boxes ──
  boxBlue:      { backgroundColor:c.blueBg, borderRadius:8, padding:12,
                  borderLeftWidth:4, borderLeftColor:c.blue, marginVertical:7 },
  boxGreen:     { backgroundColor:c.greenBg, borderRadius:8, padding:12,
                  borderLeftWidth:4, borderLeftColor:c.green, marginVertical:7 },
  boxOrange:    { backgroundColor:c.orangeBg, borderRadius:8, padding:12,
                  borderLeftWidth:4, borderLeftColor:c.orange, marginVertical:7 },
  boxRed:       { backgroundColor:c.redBg, borderRadius:8, padding:12,
                  borderLeftWidth:4, borderLeftColor:c.red, marginVertical:7 },
  boxTxtBlue:   { fontSize:9, color:c.navy, lineHeight:1.55 },
  boxTxtGreen:  { fontSize:9, color:c.greenText, lineHeight:1.55 },
  boxTxtOrange: { fontSize:9, color:c.orangeText, lineHeight:1.55 },
  boxTxtRed:    { fontSize:9, color:c.redText, lineHeight:1.55 },

  // ── Bullet list ──
  summaryBox:   { backgroundColor:c.bg, borderRadius:8, padding:14, marginTop:10 },
  bulletRow:    { flexDirection:"row", alignItems:"center", marginBottom:5 },
  bulletDot:    { width:6, height:6, borderRadius:3, backgroundColor:c.navy, marginRight:8 },
  bulletTxt:    { fontSize:10, color:c.black, flex:1 },

  // ── Risk analysis — simple horizontal layout ──
  riskRow:      { flexDirection:"row", marginVertical:10 },
  riskCard:     { flex:1, borderRadius:8, padding:14, marginHorizontal:4, alignItems:"center" },
  riskCardVal:  { fontSize:22, fontFamily:"Helvetica-Bold", marginBottom:2 },
  riskCardLbl:  { fontSize:9, fontFamily:"Helvetica-Bold", textAlign:"center", marginBottom:2 },
  riskCardSub:  { fontSize:8, color:c.gray, textAlign:"center" },

  // ── Recommendation cards ──
  recCard:      { borderRadius:8, padding:9, marginBottom:4,
                  borderLeftWidth:4, backgroundColor:c.blueBg },
  recTitle:     { fontSize:10, fontFamily:"Helvetica-Bold", color:c.navy, marginBottom:3 },
  recBody:      { fontSize:9, color:c.navy, lineHeight:1.55 },

  // ── Status badge (inline) ──
  badge:        { paddingVertical:2, paddingHorizontal:7, borderRadius:10 },
  badgeTxt:     { fontSize:7, fontFamily:"Helvetica-Bold", color:c.white },
});

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function pct(val: number): string {
  const v = val > 0 && val <= 1 ? val * 100 : val;
  return `${v.toFixed(1).replace(".", ",")}%`;
}
function num(val: number): string { return Math.round(val).toString(); }
function dec(val: number, d = 1): string { return val.toFixed(d).replace(".", ","); }

function badgeColor(status: string): string {
  switch (status) {
    case "Adequado": case "Boa": case "Saudavel": return c.green;
    case "Moderado": case "Moderada": case "Informativo": return c.blue;
    case "Atencao": case "Alerta": return c.orange;
    case "Risco": case "Baixa": return c.red;
    case "Risco Alto": case "Critico": return c.redDark;
    default: return c.gray;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────
function Header({ logo }: { logo?: string }) {
  return (
    <View style={s.header}>
      {logo
        ? <Image src={logo} style={s.headerLogo} />
        : <Text style={{ fontSize:10, fontFamily:"Helvetica-Bold", color:c.navy }}>MEGGA WORK</Text>}
      <Text style={s.headerLabel}>Portal Equilibrio SST</Text>
    </View>
  );
}

function Footer({ page }: { page: number }) {
  return (
    <View style={s.footer} fixed>
      <Text style={s.footerTxt}>MEGGA WORK — Saude e Seguranca do Trabalho</Text>
      <Text style={s.footerTxt}>Pagina {page}</Text>
    </View>
  );
}

function BarChart({ data, total, colorFn }: {
  data: { label: string; value: number }[];
  total?: number;
  colorFn?: (i: number, lbl: string) => string;
}) {
  const max = Math.max(...data.map(d => d.value), 1);
  const sum = total ?? data.reduce((a, b) => a + b.value, 0);
  return (
    <View>
      {data.map((item, i) => {
        const widthPct = Math.max((item.value / max) * 100, 3);
        const barClr = colorFn ? colorFn(i, item.label) : ageColors[i % ageColors.length];
        const proportion = sum > 0 ? (item.value / sum) * 100 : 0;
        return (
          <View key={i} style={s.barRow}>
            <Text style={s.barLbl}>{item.label}</Text>
            <View style={s.barTrack}>
              <View style={[s.barFill, { width:`${widthPct}%`, backgroundColor:barClr }]}>
                {widthPct > 22 && <Text style={s.barFillTxt}>{num(item.value)}</Text>}
              </View>
            </View>
            <Text style={s.barPct}>{proportion.toFixed(0)}%</Text>
          </View>
        );
      })}
    </View>
  );
}

function StackedBar({ segments, asPercent }: {
  segments: { label: string; value: number; color: string }[];
  asPercent?: boolean;
}) {
  const total = segments.reduce((a, b) => a + b.value, 0);
  if (total === 0) return null;
  const active = segments.filter(s => s.value > 0);
  return (
    <View style={s.stackWrap}>
      <View style={s.stackBar}>
        {active.map((seg, i) => {
          const w = (seg.value / total) * 100;
          const first = i === 0, last = i === active.length - 1;
          return (
            <View key={i} style={[s.stackSeg, {
              width:`${w}%`, backgroundColor:seg.color,
              borderTopLeftRadius:  first ? 6 : 0,
              borderBottomLeftRadius:  first ? 6 : 0,
              borderTopRightRadius: last  ? 6 : 0,
              borderBottomRightRadius: last  ? 6 : 0,
            }]}>
              {w > 10 && (
                <Text style={s.stackSegTxt}>
                  {asPercent ? `${w.toFixed(0)}%` : pct(seg.value)}
                </Text>
              )}
            </View>
          );
        })}
      </View>
      <View style={s.legendRow}>
        {active.map((seg, i) => (
          <View key={i} style={s.legendItem}>
            <View style={[s.legendDot, { backgroundColor:seg.color }]} />
            <Text style={s.legendTxt}>
              {seg.label}: {asPercent
                ? `${((seg.value/total)*100).toFixed(1).replace(".",",")}% (${num(seg.value)})`
                : pct(seg.value)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function DataTable({ headers, rows, statusCol }: {
  headers: string[];
  rows: string[][];
  statusCol?: number;
}) {
  return (
    <View style={s.tbl}>
      <View style={s.tblHead}>
        {headers.map((h, i) => <Text key={i} style={s.tblHeadCell}>{h}</Text>)}
      </View>
      {rows.map((row, ri) => (
        <View key={ri} style={ri % 2 === 0 ? s.tblRow : s.tblRowAlt}>
          {row.map((cell, ci) =>
            statusCol !== undefined && ci === statusCol
              ? (
                <View key={ci} style={[s.tblCell, { justifyContent:"center" }]}>
                  <View style={[s.badge, { backgroundColor: badgeColor(cell), alignSelf:"flex-start" }]}>
                    <Text style={s.badgeTxt}>{cell}</Text>
                  </View>
                </View>
              )
              : <Text key={ci} style={ci === 0 ? s.tblCellBold : s.tblCell}>{cell}</Text>
          )}
        </View>
      ))}
    </View>
  );
}

function IMCRefTable() {
  return (
    <DataTable
      headers={["Classificacao","IMC (kg/m²)","Risco Associado"]}
      rows={[
        ["Magreza","< 18,5","Elevado"],
        ["Normal","18,5 – 24,9","Normal"],
        ["Sobrepeso","25,0 – 29,9","Aumentado"],
        ["Obesidade I","30,0 – 34,9","Alto"],
        ["Obesidade II","35,0 – 39,9","Muito Alto"],
        ["Obesidade III","≥ 40","Extremamente Alto"],
      ]}
    />
  );
}

function PARefTable() {
  return (
    <DataTable
      headers={["Classificacao","Sistolica (mmHg)","Diastolica (mmHg)"]}
      rows={[
        ["Otima","< 120","< 80"],
        ["Normal","120 – 129","80 – 84"],
        ["Pre-Hipertensao","130 – 139","85 – 89"],
        ["HA Estagio 1","140 – 159","90 – 99"],
        ["HA Estagio 2","160 – 179","100 – 109"],
        ["HA Estagio 3","≥ 180","≥ 110"],
      ]}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Document
// ─────────────────────────────────────────────────────────────────────────────
export function RelatorioSaudePDF({ dados, logoPath }: {
  dados: DadosRelatorio;
  logoPath?: string;
}) {
  const { empresa, adesao, idade, genero, imc, pressaoArterial: pa } = dados;

  // ── Derived values ──────────────────────────────────────────────────────
  const genTotal        = genero.feminino + genero.masculino;
  const femPct          = genTotal > 0 ? (genero.feminino  / genTotal) * 100 : 0;
  const mascPct         = genTotal > 0 ? (genero.masculino / genTotal) * 100 : 0;
  const genPred         = mascPct >= femPct ? "masculino" : "feminino";
  const genPredPct      = Math.max(femPct, mascPct);

  const acimaPeso       = imc.sobrepeso + imc.obesidade + imc.obesidadeGrave;
  const obesos          = imc.obesidade + imc.obesidadeGrave;

  const totalPA         = pa.otima + pa.normal + pa.preHipertensao + pa.hipertensaoEst1 + pa.hipertensaoEst2 + pa.hipertensaoEst3;
  const paBons          = pa.otima + pa.normal;
  const hipertensos     = pa.hipertensaoEst1 + pa.hipertensaoEst2 + pa.hipertensaoEst3;
  const emRiscoPA       = pa.preHipertensao + hipertensos;

  const totalIdade      = idade.faixas.reduce((a, f) => a + f.valor, 0);

  // Guard: adhesion percentage
  const adesaoPct       = adesao.percentualAdesao > 0
    ? adesao.percentualAdesao
    : adesao.totalEquipe > 0
      ? (adesao.totalParticipantes / adesao.totalEquipe) * 100
      : 0;

  return (
    <Document>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* PAGE 1 — Cover                                                    */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <Page size="A4" style={s.page}>
        <View style={s.coverPage}>
          {/* Top green accent */}
          <View style={s.coverTopAccent} />

          {/* Top bar: logo + project label */}
          <View style={s.coverTopBar}>
            {logoPath
              ? <Image src={logoPath} style={s.coverLogo} />
              : <Text style={{ fontSize:14, fontFamily:"Helvetica-Bold", color:c.white }}>MEGGA WORK</Text>}
            <View style={s.coverTopLabel}>
              <Text style={s.coverTopLabelSm}>PROJETO</Text>
              <Text style={s.coverTopLabelLg}>EQUILIBRIO SST</Text>
            </View>
          </View>

          <View style={s.coverDivider} />

          {/* Main centered content */}
          <View style={s.coverMain}>
            <Text style={s.coverEyebrow}>RELATORIO DE SAUDE OCUPACIONAL</Text>
            <Text style={s.coverTitle}>{empresa.nome}</Text>
            <View style={s.coverLine} />
            <Text style={s.coverSubtitle}>Triagem de Saude Ocupacional</Text>
          </View>

          {/* Info strip at bottom */}
          <View style={s.coverInfoStrip}>
            <View style={s.coverInfoRow}>
              <View style={s.coverInfoItem}>
                <Text style={s.coverInfoLabel}>DATA DA COLETA</Text>
                <Text style={s.coverInfoVal}>{empresa.dataColeta}</Text>
              </View>
              <View style={s.coverInfoItem}>
                <Text style={s.coverInfoLabel}>COLABORADORES</Text>
                <Text style={s.coverInfoVal}>{empresa.qtdColaboradores}</Text>
              </View>
              <View style={s.coverInfoItem}>
                <Text style={s.coverInfoLabel}>PARTICIPANTES</Text>
                <Text style={s.coverInfoVal}>{adesao.totalParticipantes}</Text>
              </View>
            </View>
            {empresa.endereco ? (
              <View style={s.coverInfoAddr}>
                <Text style={s.coverInfoAddrTxt}>{empresa.endereco}</Text>
              </View>
            ) : null}
          </View>

          {/* Spacer before bottom accent */}
          <View style={{ height:32 }} />

          {/* Bottom green accent */}
          <View style={s.coverBotAccent} />
        </View>
      </Page>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* PAGE 2 — Methodology                                              */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <Page size="A4" style={s.page}>
        <Header logo={logoPath} />
        <View style={s.body}>
          <View style={s.infoBox}>
            {[
              ["Empresa",        empresa.nome],
              ["Endereco",       empresa.endereco],
              ["Data",           empresa.dataColeta],
              ["Horario",        empresa.horario],
              ["Colaboradores",  String(empresa.qtdColaboradores)],
            ].map(([lbl, val], i) => (
              <View key={i} style={s.infoRow}>
                <Text style={s.infoLabel}>{lbl}:</Text>
                <Text style={s.infoVal}>{val}</Text>
              </View>
            ))}
          </View>

          <Text style={s.secTitle}>Metodologia Aplicada</Text>
          <Text style={s.bodyTxt}>
            Realizada coleta de dados por amostragem, com a participacao de{" "}
            {empresa.qtdColaboradores} colaboradores da empresa, no dia{" "}
            {empresa.dataColeta}, das {empresa.horario}, de acordo com o horario
            disponibilizado pela empresa.
          </Text>

          <Text style={s.subTitle}>Execucao</Text>
          <Text style={s.bodyTxt}>
            Foram coletados dados pessoais basicos e mensurados quantitativamente
            os seguintes indicadores por colaborador: (1) Perfil do colaborador;
            (2) Glicemia; (3) Pressao Arterial; (4) Frequencia Cardiaca.
          </Text>

          <Text style={s.subTitle}>Responsabilidade dos Dados</Text>
          <Text style={s.bodyTxt}>
            Todos os dados foram coletados com o intuito de parametrizar o perfil
            de saude dos funcionarios da empresa. Nao foi autorizada a divulgacao
            de dados que possibilitem a identificacao individual de cada
            colaborador.
          </Text>

          <Text style={s.subTitle}>Sumario da Analise</Text>
          <View style={s.summaryBox}>
            {[
              "1.   Perfil Demografico e Indicadores de Saude",
              "1.1  Perfil Antropometrico (IMC)",
              "1.2  Parametros Vitais — Pressao Arterial",
              "2.   Bem-Estar e Analise Integrada",
              "3.   Discussao dos Resultados",
              "4.   Conclusao",
              "5.   Sugestoes e Recomendacoes",
            ].map((item, i) => (
              <View key={i} style={s.bulletRow}>
                <View style={s.bulletDot} />
                <Text style={s.bulletTxt}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
        <Footer page={2} />
      </Page>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* PAGE 3 — Demographics                                             */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <Page size="A4" style={s.page}>
        <Header logo={logoPath} />
        <View style={s.body}>
          <Text style={s.secTitle}>1. Perfil Demografico e Indicadores de Saude</Text>

          {/* KPI strip */}
          <View style={s.kpiStrip}>
            <View style={s.kpiCard}>
              <Text style={s.kpiVal}>{num(adesao.totalEquipe)}</Text>
              <Text style={s.kpiLbl}>Equipe Total</Text>
            </View>
            <View style={s.kpiCard}>
              <Text style={s.kpiVal}>{num(adesao.totalParticipantes)}</Text>
              <Text style={s.kpiLbl}>Participantes</Text>
            </View>
            <View style={[s.kpiCard, { borderTopWidth:2, borderTopColor: adesaoPct >= 70 ? c.green : adesaoPct >= 50 ? c.orange : c.red }]}>
              <Text style={[s.kpiVal, { color: adesaoPct >= 70 ? c.green : adesaoPct >= 50 ? c.orange : c.red }]}>
                {dec(adesaoPct)}%
              </Text>
              <Text style={s.kpiLbl}>Adesao</Text>
            </View>
            <View style={s.kpiCard}>
              <Text style={s.kpiVal}>{dec(idade.mediaIdade)}</Text>
              <Text style={s.kpiLbl}>Idade Media</Text>
            </View>
          </View>

          {/* Age distribution */}
          <Text style={s.subTitle}>Distribuicao por Faixa Etaria</Text>
          {totalIdade > 0 ? (
            <>
              <BarChart
                data={idade.faixas.filter(f => f.valor > 0).map(f => ({ label:f.label, value:f.valor }))}
                total={totalIdade}
                colorFn={(i) => ageColors[i % ageColors.length]}
              />
              <DataTable
                headers={["Faixa Etaria","Quantidade","Percentual"]}
                rows={idade.faixas.filter(f => f.valor > 0).map(f => [
                  f.label,
                  num(f.valor),
                  totalIdade > 0 ? `${((f.valor/totalIdade)*100).toFixed(1).replace(".",",")}%` : "—",
                ])}
              />
            </>
          ) : (
            <View style={s.boxOrange}>
              <Text style={s.boxTxtOrange}>Dados de faixa etaria nao disponíveis neste arquivo.</Text>
            </View>
          )}

          {/* Gender */}
          <Text style={s.subTitle}>Distribuicao por Genero</Text>
          {genTotal > 0 ? (
            <>
              <StackedBar segments={[
                { label:"Feminino",  value:genero.feminino,  color:c.pink  },
                { label:"Masculino", value:genero.masculino, color:c.navy  },
              ]} />
              <View style={s.genderRow}>
                <View style={[s.genderCard, { backgroundColor:c.pinkBg }]}>
                  <Text style={[s.genderBig, { color:c.pink }]}>{num(genero.feminino)}</Text>
                  <Text style={s.genderSub}>Feminino — {dec(femPct)}%</Text>
                </View>
                <View style={[s.genderCard, { backgroundColor:c.blueBg }]}>
                  <Text style={[s.genderBig, { color:c.navy }]}>{num(genero.masculino)}</Text>
                  <Text style={s.genderSub}>Masculino — {dec(mascPct)}%</Text>
                </View>
              </View>
            </>
          ) : (
            <View style={s.boxOrange}>
              <Text style={s.boxTxtOrange}>Dados de genero nao disponíveis neste arquivo.</Text>
            </View>
          )}

          <View style={s.boxBlue}>
            <Text style={s.boxTxtBlue}>
              {genTotal > 0
                ? `Predominancia do genero ${genPred} (${dec(genPredPct)}%). `
                : ""}
              {totalIdade > 0
                ? `Idade media de ${dec(idade.mediaIdade)} anos — ${dec(idade.percentual18a30)}% entre 18-30 anos e ${dec(idade.percentualAcima50)}% acima de 50 anos.`
                : ""}
            </Text>
          </View>
        </View>
        <Footer page={3} />
      </Page>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* PAGE 4 — BMI                                                      */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <Page size="A4" style={s.page}>
        <Header logo={logoPath} />
        <View style={s.body}>
          <Text style={s.secTitle}>1.1 Perfil Antropometrico (IMC)</Text>
          <Text style={s.bodyTxt}>
            O Indice de Massa Corporea (IMC) e o parametro adotado pela OMS para
            avaliar a relacao entre peso e altura. Valores fora da faixa normal
            indicam riscos para doencas cardiovasculares, diabetes tipo 2 e outras
            comorbidades cronicas.
          </Text>

          <Text style={s.subTitle}>Classificacao de Referencia — OMS</Text>
          <IMCRefTable />

          <Text style={s.subTitle}>Distribuicao dos Colaboradores por IMC</Text>
          {(imc.magreza + imc.normal + imc.sobrepeso + imc.obesidade + imc.obesidadeGrave) > 0 ? (
            <>
              <StackedBar segments={[
                { label:"Magreza",        value:imc.magreza,        color:imcColors.magreza        },
                { label:"Normal",         value:imc.normal,         color:imcColors.normal         },
                { label:"Sobrepeso",      value:imc.sobrepeso,      color:imcColors.sobrepeso      },
                { label:"Obesidade",      value:imc.obesidade,      color:imcColors.obesidade      },
                { label:"Obesidade Grave",value:imc.obesidadeGrave, color:imcColors.obesidadeGrave },
              ]} />

              <BarChart
                data={[
                  { label:"Magreza",     value:imc.magreza        },
                  { label:"Normal",      value:imc.normal         },
                  { label:"Sobrepeso",   value:imc.sobrepeso      },
                  { label:"Obesidade",   value:imc.obesidade      },
                  { label:"Ob. Grave",   value:imc.obesidadeGrave },
                ].filter(d => d.value > 0)}
                colorFn={(_i, lbl) => {
                  if (lbl === "Magreza")    return imcColors.magreza;
                  if (lbl === "Normal")     return imcColors.normal;
                  if (lbl === "Sobrepeso")  return imcColors.sobrepeso;
                  if (lbl === "Obesidade")  return imcColors.obesidade;
                  return imcColors.obesidadeGrave;
                }}
              />

              {imc.normal >= 0.5
                ? <View style={s.boxGreen}><Text style={s.boxTxtGreen}>{pct(imc.normal)} dos colaboradores apresentam IMC na faixa normal — perfil saudavel.</Text></View>
                : <View style={s.boxOrange}><Text style={s.boxTxtOrange}>Apenas {pct(imc.normal)} dos colaboradores estao na faixa normal. Recomenda-se programa de saude e nutricao.</Text></View>
              }
              {acimaPeso > 0 && (
                <View style={acimaPeso > 0.5 ? s.boxRed : s.boxOrange}>
                  <Text style={acimaPeso > 0.5 ? s.boxTxtRed : s.boxTxtOrange}>
                    {pct(acimaPeso)} dos colaboradores estao acima do peso — {pct(imc.sobrepeso)} com sobrepeso e {pct(obesos)} com obesidade.
                  </Text>
                </View>
              )}
            </>
          ) : (
            <View style={s.boxOrange}>
              <Text style={s.boxTxtOrange}>Dados de IMC nao disponíveis neste arquivo.</Text>
            </View>
          )}
        </View>
        <Footer page={4} />
      </Page>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* PAGE 5 — Blood Pressure                                           */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <Page size="A4" style={s.page}>
        <Header logo={logoPath} />
        <View style={s.body}>
          <Text style={s.secTitle}>1.2 Parametros Vitais — Pressao Arterial</Text>
          <Text style={s.bodyTxt}>
            A pressao arterial (PA) indica a forca exercida pelo sangue sobre as
            paredes das arterias. E um dos principais indicadores de risco
            cardiovascular. Os valores abaixo refletem a medicao pontual realizada
            durante a triagem.
          </Text>

          <Text style={s.subTitle}>Classificacao — 7a Diretriz Brasileira de Hipertensao Arterial</Text>
          <PARefTable />

          <Text style={s.subTitle}>Distribuicao de Pressao Arterial dos Colaboradores</Text>
          {totalPA > 0 ? (
            <>
              <StackedBar
                segments={[
                  { label:"Otima",          value:pa.otima,           color:paColors.otima           },
                  { label:"Normal",         value:pa.normal,          color:paColors.normal          },
                  { label:"Pre-Hipertensao",value:pa.preHipertensao,  color:paColors.preHipertensao  },
                  { label:"HA Est. 1",      value:pa.hipertensaoEst1, color:paColors.hipertensaoEst1 },
                  { label:"HA Est. 2",      value:pa.hipertensaoEst2, color:paColors.hipertensaoEst2 },
                  { label:"HA Est. 3",      value:pa.hipertensaoEst3, color:paColors.hipertensaoEst3 },
                ]}
                asPercent
              />

              <BarChart
                data={[
                  { label:"Otima",    value:pa.otima           },
                  { label:"Normal",   value:pa.normal          },
                  { label:"Pre-HA",   value:pa.preHipertensao  },
                  { label:"HA Est.1", value:pa.hipertensaoEst1 },
                  { label:"HA Est.2", value:pa.hipertensaoEst2 },
                  { label:"HA Est.3", value:pa.hipertensaoEst3 },
                ].filter(d => d.value > 0)}
                total={totalPA}
                colorFn={(_i, lbl) => {
                  if (lbl === "Otima")    return paColors.otima;
                  if (lbl === "Normal")   return paColors.normal;
                  if (lbl === "Pre-HA")   return paColors.preHipertensao;
                  if (lbl === "HA Est.1") return paColors.hipertensaoEst1;
                  if (lbl === "HA Est.2") return paColors.hipertensaoEst2;
                  return paColors.hipertensaoEst3;
                }}
              />

              {paBons > 0 && (
                <View style={s.boxGreen}>
                  <Text style={s.boxTxtGreen}>
                    {num(paBons)} colaboradores ({totalPA > 0 ? ((paBons/totalPA)*100).toFixed(0) : 0}%) apresentam PA normal ou otima.
                  </Text>
                </View>
              )}
              {hipertensos > 0 && (
                <View style={s.boxRed}>
                  <Text style={s.boxTxtRed}>
                    {num(hipertensos)} colaboradores ({totalPA > 0 ? ((hipertensos/totalPA)*100).toFixed(0) : 0}%) apresentam sinais de hipertensao arterial. Recomenda-se avaliacao medica.
                  </Text>
                </View>
              )}
            </>
          ) : (
            <View style={s.boxOrange}>
              <Text style={s.boxTxtOrange}>Dados de pressao arterial nao disponíveis neste arquivo.</Text>
            </View>
          )}

          <View style={s.boxOrange}>
            <Text style={s.boxTxtOrange}>
              Nota: A afericao nao foi precedida do periodo de repouso recomendado. Os valores devem ser confirmados por profissional de saude em ambiente controlado.
            </Text>
          </View>
        </View>
        <Footer page={5} />
      </Page>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* PAGE 6 — Well-being dashboard                                     */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <Page size="A4" style={s.page}>
        <Header logo={logoPath} />
        <View style={s.body}>
          <Text style={s.secTitle}>2. Bem-Estar e Analise Integrada</Text>
          <Text style={s.bodyTxt}>
            A avaliacao integrada dos indicadores permite identificar os principais
            fatores de risco presentes na populacao e direcionar acoes de promocao
            de saude e prevencao de doencas cronicas nao transmissiveis (DCNT).
          </Text>

          <Text style={s.subTitle}>Painel de Indicadores de Saude</Text>
          <DataTable
            headers={["Indicador","Resultado","Classificacao"]}
            statusCol={2}
            rows={[
              ["Adesao a triagem",       `${dec(adesaoPct)}%`,
               adesaoPct >= 70 ? "Boa" : adesaoPct >= 50 ? "Moderada" : "Baixa"],
              ["Idade media",            `${dec(idade.mediaIdade)} anos`,             "Informativo"],
              ["Genero predominante",
               genTotal > 0 ? `${genPred.charAt(0).toUpperCase()+genPred.slice(1)} (${dec(genPredPct)}%)` : "—",
               "Informativo"],
              ["IMC — peso normal",       pct(imc.normal),
               imc.normal >= 0.5 ? "Adequado" : "Atencao"],
              ["IMC — acima do peso",     pct(acimaPeso),
               acimaPeso > 0.5 ? "Alerta" : "Moderado"],
              ["PA normal ou otima",     `${num(paBons)} (${totalPA > 0 ? ((paBons/totalPA)*100).toFixed(0) : 0}%)`,
               paBons / (totalPA||1) >= 0.6 ? "Adequado" : "Atencao"],
              ["Pre-hipertensos",        num(pa.preHipertensao),
               pa.preHipertensao > 0 ? "Atencao" : "Adequado"],
              ["Hipertensos (HA 1-3)",   num(hipertensos),
               hipertensos > 0 ? "Risco" : "Adequado"],
            ]}
          />

          {/* Risk analysis — simple stacked layout to avoid flex overflow */}
          <Text style={s.subTitle}>Analise de Risco Integrada</Text>

          <View style={s.riskRow}>
            {/* Nutritional risk */}
            <View style={[s.riskCard, {
              backgroundColor: acimaPeso > 0.5 ? c.redBg : c.greenBg,
              borderTopWidth: 3,
              borderTopColor: acimaPeso > 0.5 ? c.red : c.green,
            }]}>
              <Text style={[s.riskCardVal, { color: acimaPeso > 0.5 ? c.red : c.green }]}>
                {pct(acimaPeso)}
              </Text>
              <Text style={[s.riskCardLbl, { color: acimaPeso > 0.5 ? c.redText : c.greenText }]}>
                Risco Nutricional
              </Text>
              <Text style={s.riskCardSub}>Sobrepeso + Obesidade</Text>
            </View>

            {/* Cardiovascular risk */}
            <View style={[s.riskCard, {
              backgroundColor: hipertensos > 0 ? c.redBg : c.greenBg,
              borderTopWidth: 3,
              borderTopColor: hipertensos > 0 ? c.red : c.green,
            }]}>
              <Text style={[s.riskCardVal, { color: hipertensos > 0 ? c.red : c.green }]}>
                {num(hipertensos)}
              </Text>
              <Text style={[s.riskCardLbl, { color: hipertensos > 0 ? c.redText : c.greenText }]}>
                Risco Cardiovascular
              </Text>
              <Text style={s.riskCardSub}>Hipertensao Est. 1-3</Text>
            </View>

            {/* Pre-hypertension */}
            <View style={[s.riskCard, {
              backgroundColor: pa.preHipertensao > 0 ? c.orangeBg : c.greenBg,
              borderTopWidth: 3,
              borderTopColor: pa.preHipertensao > 0 ? c.orange : c.green,
            }]}>
              <Text style={[s.riskCardVal, { color: pa.preHipertensao > 0 ? c.orange : c.green }]}>
                {num(pa.preHipertensao)}
              </Text>
              <Text style={[s.riskCardLbl, { color: pa.preHipertensao > 0 ? c.orangeText : c.greenText }]}>
                Risco Moderado
              </Text>
              <Text style={s.riskCardSub}>Pre-Hipertensao</Text>
            </View>
          </View>

          <View style={s.boxBlue}>
            <Text style={s.boxTxtBlue}>
              A analise integrada possibilita acoes direcionadas de promocao da saude e prevencao de DCNT, orientando investimentos em saude ocupacional com base em evidencias.
            </Text>
          </View>
        </View>
        <Footer page={6} />
      </Page>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* PAGE 7 — Discussion + Conclusion                                  */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <Page size="A4" style={s.page}>
        <Header logo={logoPath} />
        <View style={s.body}>
          <Text style={s.secTitle}>3. Discussao dos Resultados</Text>
          <Text style={s.bodyTxt}>
            Com base nos dados coletados na triagem de saude realizada na empresa{" "}
            {empresa.nome}, foi possivel tracar o perfil de saude dos colaboradores
            e identificar os principais fatores de risco presentes na populacao avaliada.
          </Text>
          <Text style={s.bodyTxt}>
            A adesao foi de {dec(adesaoPct)}% ({num(adesao.totalParticipantes)} de{" "}
            {num(adesao.totalEquipe)} colaboradores).
            {adesaoPct >= 70
              ? " Indice satisfatorio, demonstrando engajamento com as acoes de saude."
              : " Recomenda-se estrategias para aumentar a participacao nas proximas edicoes."}
          </Text>

          {acimaPeso > 0.4 && (
            <View style={s.boxOrange}>
              <Text style={[s.boxTxtOrange, { fontFamily:"Helvetica-Bold", marginBottom:3 }]}>Alerta Nutricional</Text>
              <Text style={s.boxTxtOrange}>
                {pct(acimaPeso)} dos colaboradores estao acima do peso ideal.
                Isso representa risco para doencas cardiovasculares, diabetes tipo 2 e dislipidemias.
                Recomenda-se reeducacao alimentar e incentivo a atividade fisica.
              </Text>
            </View>
          )}

          {hipertensos > 0 && (
            <View style={s.boxRed}>
              <Text style={[s.boxTxtRed, { fontFamily:"Helvetica-Bold", marginBottom:3 }]}>Alerta Cardiovascular</Text>
              <Text style={s.boxTxtRed}>
                {num(hipertensos)} colaboradores apresentaram PA compativel com hipertensao arterial.
                A afericao nao foi precedida de repouso — e necessario acompanhamento medico para confirmacao diagnostica.
              </Text>
            </View>
          )}

          {emRiscoPA > 0 && (
            <View style={s.boxOrange}>
              <Text style={[s.boxTxtOrange, { fontFamily:"Helvetica-Bold", marginBottom:3 }]}>Atencao — Pre-Hipertensao</Text>
              <Text style={s.boxTxtOrange}>
                {num(pa.preHipertensao)} colaboradores apresentaram pressao pre-hipertensiva, categoria de atencao que exige monitoramento e mudanca de estilo de vida.
              </Text>
            </View>
          )}

          <Text style={s.bodyTxt}>
            Os dados nao possuem carater diagnostico, servindo como parametro
            inicial para acoes de saude ocupacional. Colaboradores com alteracoes
            devem ser encaminhados para avaliacao medica especializada.
          </Text>

          {/* ── Conclusion ── */}
          <Text style={[s.secTitle, { marginTop:18 }]}>4. Conclusao</Text>
          <Text style={s.bodyTxt}>
            A triagem realizada em {empresa.dataColeta} na empresa {empresa.nome}{" "}
            contou com {num(adesao.totalParticipantes)} participantes ({dec(adesaoPct)}% de adesao).
          </Text>

          <Text style={s.subTitle}>Principais Achados</Text>
          <View style={s.summaryBox}>
            {[
              `Adesao: ${dec(adesaoPct)}% — ${num(adesao.totalParticipantes)} de ${num(adesao.totalEquipe)} colaboradores`,
              genTotal > 0 ? `Genero predominante: ${genPred} (${dec(genPredPct)}%)` : null,
              totalIdade > 0 ? `Idade media: ${dec(idade.mediaIdade)} anos` : null,
              (imc.normal + acimaPeso) > 0 ? `IMC normal: ${pct(imc.normal)} | Acima do peso: ${pct(acimaPeso)}` : null,
              totalPA > 0 ? `PA normal/otima: ${num(paBons)} | Hipertensos: ${num(hipertensos)}` : null,
            ].filter(Boolean).map((item, i) => (
              <View key={i} style={s.bulletRow}>
                <View style={[s.bulletDot, { backgroundColor: [c.navy,c.green,c.blue,c.orange,c.teal][i % 5] }]} />
                <Text style={s.bulletTxt}>{item}</Text>
              </View>
            ))}
          </View>

          <Text style={[s.bodyTxt, { marginTop:10 }]}>
            A empresa demonstra compromisso com a saude ao promover esta acao.
            Recomenda-se a continuidade do programa com realizacoes periodicas
            e acompanhamento individualizado dos colaboradores com alteracoes.
          </Text>
        </View>
        <Footer page={7} />
      </Page>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* PAGE 8 — Recommendations + Responsible                            */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <Page size="A4" style={s.page}>
        <Header logo={logoPath} />
        <View style={s.body}>
          <Text style={s.secTitle}>5. Sugestoes e Recomendacoes</Text>
          <Text style={s.bodyTxt}>
            Com base nos resultados obtidos, sugerimos as seguintes acoes para
            promocao da saude e prevencao de agravos no ambiente de trabalho:
          </Text>

          {[
            { title:"1. Programa de Acompanhamento Nutricional",
              desc: "Palestras e acompanhamento nutricional focados em reeducacao alimentar, controle do peso e habitos saudaveis, com monitoramento periodico do IMC dos colaboradores.",
              color:c.green },
            { title:"2. Monitoramento da Pressao Arterial",
              desc: "Acompanhamento periodico de colaboradores com PA elevada, encaminhamento para avaliacao medica e orientacao sobre controle de fatores de risco: reducao do sal, sedentarismo e estresse.",
              color:c.blue },
            { title:"3. Incentivo a Atividade Fisica",
              desc: "Ginastica laboral diaria, parcerias com academias e eventos esportivos para incentivar a pratica regular de exercicios fisicos, reduzindo riscos cardiovasculares e metabolicos.",
              color:c.orange },
            { title:"4. Campanhas de Conscientizacao",
              desc: "Campanhas periodicas sobre alimentacao saudavel, controle do estresse, prevencao de DCNT, saude mental e qualidade do sono — adaptadas ao perfil de risco identificado.",
              color:c.teal },
            { title:"5. Triagens Periodicas de Saude",
              desc: "Manutencao de triagens semestrais ou anuais para acompanhamento da evolucao dos indicadores, avaliacao da eficacia das acoes e identificacao precoce de novos fatores de risco.",
              color:c.navy },
            { title:"6. Encaminhamento Individualizado",
              desc: "Colaboradores com alteracoes significativas devem ser encaminhados individualmente para acompanhamento medico e/ou nutricional, garantindo atencao personalizada e efetiva.",
              color:c.red },
          ].map((item, i) => (
            <View key={i} style={[s.recCard, { borderLeftColor:item.color }]}>
              <Text style={[s.recTitle, { color:item.color }]}>{item.title}</Text>
              <Text style={s.recBody}>{item.desc}</Text>
            </View>
          ))}

          {/* Responsible — plain text styles, NO flex:1, so nothing clips */}
          <View style={{
            marginTop:16, backgroundColor:c.greenBg, borderRadius:8, padding:14,
            borderLeftWidth:4, borderLeftColor:c.green,
          }}>
            <Text style={{ fontSize:8, fontFamily:"Helvetica-Bold", color:c.greenDark, letterSpacing:1, marginBottom:6 }}>
              RESPONSAVEL TECNICA
            </Text>
            <Text style={{ fontSize:11, fontFamily:"Helvetica-Bold", color:c.black, marginBottom:3 }}>
              Dra. Eliane Bueno
            </Text>
            <Text style={{ fontSize:9, color:c.black, marginBottom:2 }}>
              Enfermeira — Especialista em Saude do Trabalhador
            </Text>
            <Text style={{ fontSize:9, color:c.gray }}>
              MEGGA WORK — Saude e Seguranca do Trabalho
            </Text>
          </View>
        </View>
        <Footer page={8} />
      </Page>

    </Document>
  );
}
