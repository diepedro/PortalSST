import { generatePdfBuffer } from "./render-pdf";
import { DadosRelatorioAny } from "@/types";

/**
 * Uploads a report PDF to Vercel Blob storage.
 * returns the full public URL of the uploaded file or internal:generate.
 * 
 * NOTA: DESATIVADO TEMPORARIAMENTE para evitar o erro de inicialização do SDK da Vercel.
 * Se desejar ativar, configure o BLOB_READ_WRITE_TOKEN no .env e descomente as linhas abaixo.
 */
export async function cacheReportPdf(
  relatorioId: string,
  _dados: DadosRelatorioAny
): Promise<string> {
  // Ignora completamente o cache e gera sempre localmente enquanto em desenvolvimento
  console.log("[pdf-cache] Pulando cache para relatório:", relatorioId, "Usando modo local.");
  return "internal:generate";
}

/**
 * Deletes a report PDF from Vercel Blob storage.
 */
export async function deleteReportPdf(url: string) {
  // Ignora remoção por enquanto
  return;
}
