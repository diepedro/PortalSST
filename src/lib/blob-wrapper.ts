// import { put, del } from "@vercel/blob";

/**
 * Este arquivo isola as chamadas diretas ao Vercel Blob.
 * DESATIVADO TEMPORARIAMENTE para evitar erros de inicialização do SDK localmente.
 */

export async function uploadToBlob(fileName: string, buffer: Buffer, token: string) {
  // return await put(`relatorios/${fileName}`, buffer, {
  //   access: "public",
  //   contentType: "application/pdf",
  //   addRandomSuffix: true,
  //   token: token,
  // });
  throw new Error("Vercel Blob desativado localmente.");
}

export async function deleteFromBlob(url: string, token: string) {
  // return await del(url, { token });
  throw new Error("Vercel Blob desativado localmente.");
}
