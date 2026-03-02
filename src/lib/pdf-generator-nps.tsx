import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { DadosRelatorioNPS } from "@/types";

const c = {
  navy: "#1e3a8a",
  green: "#22c55e",
  blue: "#3b82f6",
  red: "#ef4444",
  yellow: "#eab308",
  gray: "#6b7280",
  white: "#ffffff",
  bg: "#f3f4f6",
};

const s = StyleSheet.create({
  page: { fontFamily: "Helvetica", padding: 40, fontSize: 10 },
  header: { marginBottom: 20, borderBottomWidth: 2, borderBottomColor: c.navy, paddingBottom: 10 },
  title: { fontSize: 24, fontFamily: "Helvetica-Bold", color: c.navy, marginBottom: 5 },
  subtitle: { fontSize: 12, color: c.gray, marginBottom: 20 },
  card: { backgroundColor: c.bg, padding: 15, borderRadius: 10, marginBottom: 15 },
  cardTitle: { fontSize: 14, fontFamily: "Helvetica-Bold", color: c.navy, marginBottom: 10 },
  score: { fontSize: 40, fontFamily: "Helvetica-Bold", textAlign: "center", marginVertical: 20 },
  barContainer: { height: 20, backgroundColor: "#e5e7eb", borderRadius: 10, flexDirection: "row", overflow: "hidden", marginVertical: 10 },
  barDetrator: { backgroundColor: c.red, height: "100%" },
  barPassivo: { backgroundColor: c.yellow, height: "100%" },
  barPromotor: { backgroundColor: c.green, height: "100%" },
  legend: { flexDirection: "row", justifyContent: "space-between", marginTop: 5 },
  legendText: { fontSize: 8, color: c.gray },
});

export function RelatorioNPSPDF({ dados }: { dados: DadosRelatorioNPS }) {
  const { empresa, score, distribuicao } = dados;

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.title}>Relatório NPS</Text>
          <Text style={s.subtitle}>{empresa.nome} - {empresa.data}</Text>
        </View>

        <View style={s.card}>
          <Text style={s.cardTitle}>Net Promoter Score (NPS)</Text>
          <Text style={[s.score, { color: score >= 70 ? c.green : score >= 50 ? c.blue : score >= 0 ? c.yellow : c.red }]}>
            {score.toFixed(1)}
          </Text>
          <View style={s.barContainer}>
            <View style={[s.barDetrator, { width: `${distribuicao.detratores.percentual}%` }]} />
            <View style={[s.barPassivo, { width: `${distribuicao.passivos.percentual}%` }]} />
            <View style={[s.barPromotor, { width: `${distribuicao.promotores.percentual}%` }]} />
          </View>
          <View style={s.legend}>
            <Text style={s.legendText}>Detratores: {distribuicao.detratores.percentual.toFixed(1)}%</Text>
            <Text style={s.legendText}>Passivos: {distribuicao.passivos.percentual.toFixed(1)}%</Text>
            <Text style={s.legendText}>Promotores: {distribuicao.promotores.percentual.toFixed(1)}%</Text>
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={s.cardTitle}>Metodologia</Text>
          <Text>
            O NPS é calculado subtraindo o percentual de Detratores do percentual de Promotores.
            Promotores (notas 9-10), Passivos (notas 7-8) e Detratores (notas 0-6).
          </Text>
          <Text style={{ marginTop: 10 }}>Total de respostas coletadas: {empresa.totalRespostas}</Text>
        </View>
      </Page>
    </Document>
  );
}
