import React from "react";
import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer";
import { DadosRelatorio } from "@/types";

// Cores do Portal Equilíbrio
const c = {
  navy: "#1e3a8a",
  blue: "#2563eb",
  lightBlue: "#dbeafe",
  green: "#22c55e",
  lightGreen: "#dcfce7",
  gray: "#64748b",
  lightGray: "#f1f5f9",
  white: "#ffffff",
  border: "#e2e8f0",
  text: "#334155",
  danger: "#ef4444",
  warning: "#f59e0b",
};

const s = StyleSheet.create({
  page: { padding: 0, fontFamily: "Helvetica", color: c.text, fontSize: 10 },

  // Capa
  cover: {
    backgroundColor: c.navy,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: c.white,
  },
  coverLogo: { width: 80, marginBottom: 40, backgroundColor: "white", padding: 10, borderRadius: 4 },
  coverTitle: { fontSize: 42, fontWeight: "bold", marginBottom: 10 },
  coverSubtitle: { fontSize: 24, marginBottom: 60, opacity: 0.9 },
  coverButton: {
    backgroundColor: c.green,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 100,
  },
  coverFooter: { position: "absolute", bottom: 40, fontSize: 12 },

  // Header e Footer Gerais
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "20 40",
    borderBottom: `1pt solid ${c.navy}`,
    marginBottom: 20,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    borderTop: `1pt solid ${c.border}`,
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: c.gray,
  },

  // Conteúdo
  container: { padding: "0 40 60 40" },
  section: { marginBottom: 25 },
  sectionTitle: {
    fontSize: 18,
    color: c.navy,
    fontWeight: "bold",
    borderBottom: `2pt solid ${c.green}`,
    paddingBottom: 5,
    marginBottom: 15,
  },
  subTitle: { fontSize: 14, color: c.navy, fontWeight: "bold", marginBottom: 10, marginTop: 10 },
  text: { marginBottom: 8, lineHeight: 1.5 },

  // Cards de Info (Cabeçalho da segunda página)
  infoGrid: {
    flexDirection: "row",
    backgroundColor: c.lightGray,
    padding: 20,
    borderRadius: 8,
    borderLeft: `4pt solid ${c.navy}`,
    marginBottom: 25,
  },
  infoCol: { flex: 1 },
  infoLabel: { fontWeight: "bold", color: c.navy, marginBottom: 2 },
  infoValue: { marginBottom: 8 },

  // Gráficos e Tabelas
  statRow: { flexDirection: "row", gap: 15, marginBottom: 20 },
  statCard: {
    flex: 1,
    backgroundColor: c.lightGray,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  statValue: { fontSize: 22, fontWeight: "bold", color: c.green },
  statLabel: { fontSize: 9, color: c.gray, marginTop: 4, textAlign: "center" },

  // Barras de Distribuição
  barContainer: { marginBottom: 15 },
  barLabelRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  barBg: { height: 16, backgroundColor: c.lightBlue, borderRadius: 8, overflow: "hidden" },
  barFill: { height: "100%", backgroundColor: c.navy },

  // Tabelas
  table: { marginTop: 10, border: `1pt solid ${c.border}`, borderRadius: 4, overflow: "hidden" },
  tableHeader: { flexDirection: "row", backgroundColor: c.navy, color: c.white, fontWeight: "bold", padding: 8 },
  tableRow: { flexDirection: "row", borderBottom: `1pt solid ${c.border}`, padding: 8 },
  tableCell: { flex: 1 },

  // Box de Destaque (Alerta/Sucesso)
  alertBox: {
    padding: 15,
    borderRadius: 8,
    borderLeft: "4pt solid",
    marginTop: 10,
    lineHeight: 1.4,
  }
});

const ProgressBar = ({ label, value, percent, color = c.navy }: any) => (
  <View style={s.barContainer}>
    <View style={s.barLabelRow}>
      <Text>{label}</Text>
      <Text style={{ fontWeight: "bold" }}>{percent.toFixed(1)}%</Text>
    </View>
    <View style={s.barBg}>
      <View style={[s.barFill, { width: `${percent}%`, backgroundColor: color }]} />
    </View>
  </View>
);

export function RelatorioSaudePDF({ dados, logoPath }: { dados: DadosRelatorio; logoPath?: string }) {
  const { empresa, adesao, idade, genero, imc, pressaoArterial, glicemia, participantes } = dados;
  const glicemiaDados = glicemia ?? { normal: 0, alterada: 0 };

  return (
    <Document>
      {/* CAPA */}
      <Page size="A4" style={s.page}>
        <View style={s.cover}>
          {logoPath && <Image src={logoPath} style={s.coverLogo} />}
          <Text style={s.coverTitle}>Relatorio de Saude</Text>
          <Text style={s.coverSubtitle}>{empresa.nome}</Text>
          <View style={s.coverButton}>
            <Text>PROJETO EQUILIBRIO SST</Text>
          </View>
          <Text style={s.coverFooter}>Data da Coleta: {empresa.dataColeta}</Text>
        </View>
      </Page>

      {/* METODOLOGIA E SUMÁRIO */}
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          {logoPath && <Image src={logoPath} style={{ width: 40 }} />}
          <Text style={{ color: c.gray }}>Portal Equilíbrio SST</Text>
        </View>

        <View style={s.container}>
          <View style={s.infoGrid}>
            <View style={s.infoCol}>
              <Text style={s.infoLabel}>Empresa:</Text>
              <Text style={s.infoValue}>{empresa.nome}</Text>
              <Text style={s.infoLabel}>Endereço:</Text>
              <Text style={s.infoValue}>{empresa.endereco}</Text>
            </View>
            <View style={s.infoCol}>
              <Text style={s.infoLabel}>Data:</Text>
              <Text style={s.infoValue}>{empresa.dataColeta}</Text>
              <Text style={s.infoLabel}>Colaboradores:</Text>
              <Text style={s.infoValue}>{adesao.totalParticipantes} de {adesao.totalEquipe}</Text>
            </View>
          </View>

          <View style={s.section}>
            <Text style={s.sectionTitle}>Metodologia Aplicada</Text>
            <Text style={s.text}>
              Realizada coleta de dados por amostragem, com a participação de {adesao.totalParticipantes} colaboradores da empresa, 
              no dia {empresa.dataColeta}, de acordo com o horário disponibilizado pela empresa ({empresa.horario}).
            </Text>

            <Text style={s.subTitle}>Execução</Text>
            <Text style={s.text}>
              Foram coletados dados pessoais básicos e mensurados quantitativamente os seguintes indicadores por colaborador: 
              (1) Perfil do colaborador; (2) Glicemia; (3) Pressão Arterial; (4) Frequência Cardíaca; (5) IMC.
            </Text>

            <Text style={s.subTitle}>Sumário da Análise</Text>
            <View style={{ marginLeft: 10 }}>
              <Text style={s.text}>• 1. Perfil Demográfico e Indicadores de Saúde</Text>
              <Text style={s.text}>• 1.1 Perfil Antropométrico (IMC)</Text>
              <Text style={s.text}>• 1.2 Parâmetros Vitais — Pressão Arterial</Text>
              <Text style={s.text}>• 2. Bem-Estar e Análise Integrada</Text>
              <Text style={s.text}>• 3. Discussão dos Resultados e Conclusão</Text>
            </View>
          </View>
        </View>

        <View style={s.footer}>
          <Text>MEGGA WORK — Saúde e Segurança do Trabalho</Text>
          <Text>Pagina 2</Text>
        </View>
      </Page>

      {/* PERFIL DEMOGRÁFICO */}
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          {logoPath && <Image src={logoPath} style={{ width: 40 }} />}
          <Text style={{ color: c.gray }}>Portal Equilíbrio SST</Text>
        </View>

        <View style={s.container}>
          <Text style={s.sectionTitle}>1. Perfil Demográfico e Indicadores de Saúde</Text>

          <View style={s.statRow}>
            <View style={s.statCard}>
              <Text style={s.statValue}>{adesao.totalEquipe}</Text>
              <Text style={s.statLabel}>Equipe Total</Text>
            </View>
            <View style={s.statCard}>
              <Text style={s.statValue}>{adesao.totalParticipantes}</Text>
              <Text style={s.statLabel}>Participantes</Text>
            </View>
            <View style={s.statCard}>
              <Text style={s.statValue}>{adesao.percentualAdesao.toFixed(1)}%</Text>
              <Text style={s.statLabel}>Adesão</Text>
            </View>
            <View style={s.statCard}>
              <Text style={s.statValue}>{idade.mediaIdade.toFixed(1)}</Text>
              <Text style={s.statLabel}>Idade Média</Text>
            </View>
          </View>

          <Text style={s.subTitle}>Distribuição por Faixa Etária</Text>
          {idade.faixas.map((f, i) => (
            <ProgressBar 
              key={i} 
              label={f.label} 
              percent={(f.valor / adesao.totalParticipantes) * 100} 
              color={i % 2 === 0 ? c.navy : c.blue} 
            />
          ))}

          <Text style={s.subTitle}>Distribuição por Gênero</Text>
          <View style={{ flexDirection: "row", height: 30, borderRadius: 4, overflow: "hidden", marginBottom: 10 }}>
            <View style={{ flex: genero.feminino, backgroundColor: "#ec4899", justifyContent: "center", alignItems: "center" }}>
              <Text style={{ color: "white", fontSize: 8 }}>{((genero.feminino / adesao.totalParticipantes) * 100).toFixed(1)}% Fem</Text>
            </View>
            <View style={{ flex: genero.masculino, backgroundColor: c.navy, justifyContent: "center", alignItems: "center" }}>
              <Text style={{ color: "white", fontSize: 8 }}>{((genero.masculino / adesao.totalParticipantes) * 100).toFixed(1)}% Masc</Text>
            </View>
          </View>
        </View>

        <View style={s.footer}>
          <Text>MEGGA WORK — Saúde e Segurança do Trabalho</Text>
          <Text>Pagina 3</Text>
        </View>
      </Page>

      {/* IMC */}
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          {logoPath && <Image src={logoPath} style={{ width: 40 }} />}
          <Text style={{ color: c.gray }}>Portal Equilíbrio SST</Text>
        </View>

        <View style={s.container}>
          <Text style={s.sectionTitle}>1.1 Perfil Antropométrico (IMC)</Text>
          <Text style={s.text}>O Índice de Massa Corpórea (IMC) é o parâmetro adotado pela OMS para avaliar a relação entre peso e altura.</Text>

          <View style={s.table}>
            <View style={s.tableHeader}>
              <Text style={s.tableCell}>Classificação</Text>
              <Text style={s.tableCell}>IMC (kg/m²)</Text>
              <Text style={s.tableCell}>Risco Associado</Text>
            </View>
            <View style={s.tableRow}><Text style={s.tableCell}>Magreza</Text><Text style={s.tableCell}>{"< 18,5"}</Text><Text style={s.tableCell}>Elevado</Text></View>
            <View style={s.tableRow}><Text style={s.tableCell}>Normal</Text><Text style={s.tableCell}>18,5 – 24,9</Text><Text style={s.tableCell}>Normal</Text></View>
            <View style={s.tableRow}><Text style={s.tableCell}>Sobrepeso</Text><Text style={s.tableCell}>25,0 – 29,9</Text><Text style={s.tableCell}>Aumentado</Text></View>
            <View style={s.tableRow}><Text style={s.tableCell}>Obesidade</Text><Text style={s.tableCell}>{"> 30,0"}</Text><Text style={s.tableCell}>Alto / Muito Alto</Text></View>
          </View>

          <Text style={s.subTitle}>Distribuição dos Colaboradores por IMC</Text>
          <ProgressBar label="Normal" percent={imc.normal * 100} color={c.green} />
          <ProgressBar label="Sobrepeso" percent={imc.sobrepeso * 100} color={c.warning} />
          <ProgressBar label="Obesidade" percent={imc.obesidade * 100} color={c.danger} />

          <View style={[s.alertBox, { backgroundColor: c.lightGreen, borderLeftColor: c.green }]}>
            <Text style={{ color: c.navy, fontWeight: "bold" }}>Análise:</Text>
            <Text>{(imc.normal * 100).toFixed(1)}% dos colaboradores apresentam IMC na faixa saudável.</Text>
          </View>
        </View>

        <View style={s.footer}>
          <Text>MEGGA WORK — Saúde e Segurança do Trabalho</Text>
          <Text>Pagina 4</Text>
        </View>
      </Page>

      {/* PRESSÃO ARTERIAL E GLICEMIA */}
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          {logoPath && <Image src={logoPath} style={{ width: 40 }} />}
          <Text style={{ color: c.gray }}>Portal Equilíbrio SST</Text>
        </View>

        <View style={s.container}>
          <Text style={s.sectionTitle}>1.2 Parâmetros Vitais</Text>

          <Text style={s.subTitle}>Pressão Arterial</Text>
          <ProgressBar label="Normal / Ótima" percent={(pressaoArterial.otima / adesao.totalParticipantes) * 100} color={c.green} />
          <ProgressBar label="Pré-Hipertensão / Elevada" percent={(pressaoArterial.preHipertensao / adesao.totalParticipantes) * 100} color={c.warning} />
          <ProgressBar label="Hipertensão" percent={((pressaoArterial.hipertensaoEst1 + pressaoArterial.hipertensaoEst2) / adesao.totalParticipantes) * 100} color={c.danger} />

          <Text style={[s.subTitle, { marginTop: 30 }]}>Glicemia Capilar</Text>
            <View style={s.statRow}>
              <View style={[s.statCard, { backgroundColor: c.lightGreen }]}>
              <Text style={s.statValue}>{glicemiaDados.normal}</Text>
                <Text style={s.statLabel}>Normal</Text>
              </View>
              <View style={[s.statCard, { backgroundColor: "#fee2e2" }]}>
              <Text style={s.statValue}>{glicemiaDados.alterada}</Text>
                <Text style={s.statLabel}>Alterada</Text>
              </View>
            </View>

          <View style={[s.alertBox, { backgroundColor: c.lightBlue, borderLeftColor: c.navy, marginTop: 40 }]}>
            <Text style={{ color: c.navy, fontWeight: "bold" }}>Conclusão Geral:</Text>
            <Text>
              Com base nos dados coletados, observamos que a maioria da equipe mantém indicadores dentro da normalidade, 
              porém há pontos de atenção em relação ao IMC e Pressão Arterial que devem ser monitorados através de ações 
              preventivas de saúde e incentivo a hábitos saudáveis.
            </Text>
          </View>
        </View>

        <View style={s.footer}>
          <Text>MEGGA WORK — Saúde e Segurança do Trabalho</Text>
          <Text>Pagina 5</Text>
        </View>
      </Page>
    </Document>
  );
}

