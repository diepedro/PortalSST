import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { RelatorioSaudePDF } from "./pdf-generator";
import { RelatorioComparativoPDF } from "./pdf-generator-comparativo";
import { RelatorioNPSPDF } from "./pdf-generator-nps";
import { DadosRelatorio, DadosRelatorioAny, DadosRelatorioComparativo, DadosRelatorioNPS } from "@/types";

function isComparativo(dados: DadosRelatorioAny): dados is DadosRelatorioComparativo {
  return (dados as DadosRelatorioComparativo).tipo === "COMPARATIVO";
}

function isNPS(dados: DadosRelatorioAny): dados is DadosRelatorioNPS {
  return (dados as DadosRelatorioNPS).tipo === "NPS";
}

export async function generatePdfBuffer(
  dados: DadosRelatorioAny,
  logoPath?: string
): Promise<Buffer> {
  let element;
  
  if (isComparativo(dados)) {
    element = <RelatorioComparativoPDF dados={dados} logoPath={logoPath} />;
  } else if (isNPS(dados)) {
    element = <RelatorioNPSPDF dados={dados} />;
  } else {
    element = <RelatorioSaudePDF dados={dados as DadosRelatorio} logoPath={logoPath} />;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(element as any);
  return Buffer.from(buffer);
}
