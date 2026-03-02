import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { RelatorioSaudePDF } from "./pdf-generator";
import { RelatorioComparativoPDF } from "./pdf-generator-comparativo";
import { DadosRelatorio, DadosRelatorioAny, DadosRelatorioComparativo } from "@/types";

function isComparativo(dados: DadosRelatorioAny): dados is DadosRelatorioComparativo {
  return (dados as DadosRelatorioComparativo).tipo === "COMPARATIVO";
}

export async function generatePdfBuffer(
  dados: DadosRelatorioAny,
  logoPath?: string
): Promise<Buffer> {
  const element = isComparativo(dados)
    ? <RelatorioComparativoPDF dados={dados} logoPath={logoPath} />
    : <RelatorioSaudePDF dados={dados as DadosRelatorio} logoPath={logoPath} />;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(element as any);
  return Buffer.from(buffer);
}
