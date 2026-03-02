import React from "react";
import { renderToBuffer, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

type TriagemItem = {
  nome: string;
  alertas: string[];
};

const s = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 10, color: "#0f172a", padding: 26 },
  title: { fontSize: 16, fontFamily: "Helvetica-Bold", color: "#1e3a8a", marginBottom: 4 },
  sub: { fontSize: 9, color: "#64748b", marginBottom: 2 },
  box: { marginTop: 12, borderWidth: 1, borderColor: "#dbe3ec", borderRadius: 8, padding: 10 },
  row: { borderTopWidth: 1, borderTopColor: "#e2e8f0", paddingTop: 8, marginTop: 8 },
  name: { fontSize: 11, fontFamily: "Helvetica-Bold", marginBottom: 4 },
  alert: { fontSize: 10, color: "#b45309", marginBottom: 2 },
  ok: { fontSize: 10, color: "#16a34a" },
  foot: { position: "absolute", bottom: 16, left: 26, right: 26, borderTopWidth: 1, borderTopColor: "#e2e8f0", paddingTop: 4, fontSize: 8, color: "#94a3b8", textAlign: "right" },
});

export async function gerarTriagemColetaPdf(params: {
  empresaNome: string;
  dataColeta: string;
  totalParticipantes: number;
  itens: TriagemItem[];
}): Promise<Buffer> {
  const { empresaNome, dataColeta, totalParticipantes, itens } = params;

  const element = (
    <Document>
      <Page size="A4" style={s.page}>
        <Text style={s.title}>Triagem Rapida de Alertas</Text>
        <Text style={s.sub}>Empresa: {empresaNome || "-"}</Text>
        <Text style={s.sub}>Data da coleta: {dataColeta || "-"}</Text>
        <Text style={s.sub}>Participantes avaliados: {totalParticipantes}</Text>
        <Text style={s.sub}>Participantes com alerta: {itens.length}</Text>

        <View style={s.box}>
          {itens.length === 0 ? (
            <Text style={s.ok}>Nenhum alerta clinico identificado na coleta atual.</Text>
          ) : (
            itens.map((item, idx) => (
              <View key={`${item.nome}-${idx}`} style={idx === 0 ? undefined : s.row}>
                <Text style={s.name}>{item.nome || "Participante"}</Text>
                {item.alertas.map((a, i) => (
                  <Text key={`${a}-${i}`} style={s.alert}>- {a}</Text>
                ))}
              </View>
            ))
          )}
        </View>

        <Text style={s.foot}>Gerado automaticamente pelo fluxo de coleta</Text>
      </Page>
    </Document>
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(element as any);
  return Buffer.from(buffer);
}
