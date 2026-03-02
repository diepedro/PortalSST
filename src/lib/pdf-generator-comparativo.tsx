import React from "react";
import { Document, Page, Text, StyleSheet } from "@react-pdf/renderer";
import { DadosRelatorioComparativo } from "@/types";

const s = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica" },
  title: { fontSize: 20, marginBottom: 20 },
  text: { fontSize: 12, marginBottom: 10 }
});

export function RelatorioComparativoPDF({ dados }: { dados: DadosRelatorioComparativo; logoPath?: string }) {
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <Text style={s.title}>Relatório Comparativo - Recomeçando</Text>
        <Text style={s.text}>Empresa: {dados.empresa.nome}</Text>
        <Text style={s.text}>Aguardando nova implementação do layout...</Text>
      </Page>
    </Document>
  );
}
