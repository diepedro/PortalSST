import React from "react";
import { renderToBuffer, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { FolhaProfissional } from "@/lib/financeiro";

const s = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 9, color: "#0f172a", padding: 28 },
  title: { fontSize: 16, fontFamily: "Helvetica-Bold", color: "#1e3a8a", marginBottom: 4 },
  sub: { fontSize: 9, color: "#64748b", marginBottom: 2 },
  card: {
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#dbe3ec",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#f8fafc",
  },
  total: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#16a34a", marginTop: 4 },
  table: { marginTop: 8, borderWidth: 1, borderColor: "#dbe3ec", borderRadius: 6 },
  rowHead: { flexDirection: "row", backgroundColor: "#1e3a8a" },
  row: { flexDirection: "row", borderTopWidth: 1, borderTopColor: "#dbe3ec" },
  cellHead: { color: "#fff", fontSize: 8, fontFamily: "Helvetica-Bold", padding: 6, flex: 1 },
  cell: { fontSize: 8, padding: 6, flex: 1 },
  cellTotal: { fontSize: 8, padding: 6, flex: 1, fontFamily: "Helvetica-Bold" },
  foot: { position: "absolute", bottom: 16, left: 28, right: 28, borderTopWidth: 1, borderTopColor: "#e2e8f0", paddingTop: 4, fontSize: 7, color: "#94a3b8", textAlign: "right" },
});

function money(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(value: Date) {
  return new Date(value).toLocaleDateString("pt-BR");
}

export async function gerarFolhaProfissionalPdf(params: {
  profissional: FolhaProfissional;
  dataInicio?: string | null;
  dataFim?: string | null;
}): Promise<Buffer> {
  const { profissional, dataInicio, dataFim } = params;

  const element = (
    <Document>
      <Page size="A4" style={s.page}>
        <Text style={s.title}>Folha de Pagamento Individual</Text>
        <Text style={s.sub}>Profissional: {profissional.profissionalNome}</Text>
        <Text style={s.sub}>
          Periodo: {dataInicio || "-"} ate {dataFim || "-"}
        </Text>

        <View style={s.card}>
          <Text style={{ fontSize: 9, color: "#64748b" }}>Total do periodo</Text>
          <Text style={s.total}>{money(profissional.total)}</Text>
          <Text style={{ marginTop: 6, fontSize: 8, color: "#64748b" }}>
            Itens considerados: {profissional.itens.length}
          </Text>
        </View>

        <View style={s.table}>
          <View style={s.rowHead}>
            <Text style={s.cellHead}>Data</Text>
            <Text style={s.cellHead}>Tipo</Text>
            <Text style={s.cellHead}>Empresa</Text>
            <Text style={s.cellHead}>Base</Text>
            <Text style={s.cellHead}>Ajuda</Text>
            <Text style={s.cellHead}>Desloc.</Text>
            <Text style={s.cellHead}>Total</Text>
          </View>
          {profissional.itens.map((item) => (
            <View style={s.row} key={item.atividadeId}>
              <Text style={s.cell}>{formatDate(item.data)}</Text>
              <Text style={s.cell}>{item.tipo}</Text>
              <Text style={s.cell}>{item.empresa}</Text>
              <Text style={s.cell}>{money(item.valorBase)}</Text>
              <Text style={s.cell}>{money(item.ajudaCusto)}</Text>
              <Text style={s.cell}>{money(item.deslocamento)}</Text>
              <Text style={s.cellTotal}>{money(item.total)}</Text>
            </View>
          ))}
        </View>

        <Text style={s.foot}>Gerado automaticamente pelo Portal Equilibrio SST</Text>
      </Page>
    </Document>
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(element as any);
  return Buffer.from(buffer);
}

