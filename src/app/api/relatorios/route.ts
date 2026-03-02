import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseExcel } from "@/lib/excel-parser";
import { parseExcelComparativo } from "@/lib/excel-parser-comparativo";
import { generatePdfBuffer } from "@/lib/render-pdf";
import path from "path";
import fs from "fs";
import ExcelJS from "exceljs";
import { DadosRelatorioAny, DadosRelatorioComparativo } from "@/types";

type TipoRelatorio = "SAUDE" | "COMPARATIVO";

function parseDateOrNow(input: string): Date {
  if (!input) return new Date();
  const parts = input.split("/");
  if (parts.length === 3) {
    const iso = `${parts[2]}-${parts[1]}-${parts[0]}`;
    const dt = new Date(iso);
    if (!Number.isNaN(dt.getTime())) return dt;
  }
  const dt = new Date(input);
  if (!Number.isNaN(dt.getTime())) return dt;
  return new Date();
}

async function detectTipoRelatorio(buffer: Buffer): Promise<TipoRelatorio> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer as unknown as ArrayBuffer);
  const ws = workbook.worksheets[0];
  const cellA3 = String(ws.getCell("A3").value ?? "").toLowerCase();
  if (cellA3.includes("primeira data")) return "COMPARATIVO";
  return "SAUDE";
}

function getDataColeta(dados: DadosRelatorioAny): Date {
  if ((dados as DadosRelatorioComparativo).tipo === "COMPARATIVO") {
    return parseDateOrNow((dados as DadosRelatorioComparativo).empresa.segundaData);
  }
  return parseDateOrNow((dados as { empresa: { dataColeta: string } }).empresa.dataColeta);
}

export async function GET() {
  const relatorios = await prisma.relatorio.findMany({
    include: { empresa: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(relatorios);
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const tipoForm = String(formData.get("tipo") ?? "").toUpperCase();
    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const tipo = (tipoForm === "COMPARATIVO" || tipoForm === "SAUDE")
      ? (tipoForm as TipoRelatorio)
      : await detectTipoRelatorio(buffer);

    const dados: DadosRelatorioAny = tipo === "COMPARATIVO"
      ? await parseExcelComparativo(buffer)
      : await parseExcel(buffer);

    // Find or create empresa
    let empresa = await prisma.empresa.findFirst({
      where: { nome: dados.empresa.nome },
    });
    if (!empresa) {
      empresa = await prisma.empresa.create({
        data: {
          nome: dados.empresa.nome,
          endereco: dados.empresa.endereco,
        },
      });
    }

    // Generate PDF
    const pdfBuffer = await generatePdfBuffer(dados);

    // Save PDF to disk
    const uploadsDir = path.join(process.cwd(), "uploads", "relatorios");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const fileName = `relatorio_${empresa.id}_${Date.now()}.pdf`;
    const filePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(filePath, pdfBuffer);

    // Save to database
    const relatorio = await prisma.relatorio.create({
      data: {
        empresaId: empresa.id,
        dataColeta: getDataColeta(dados),
        dados: JSON.parse(JSON.stringify(dados)),
        pdfUrl: fileName,
      },
      include: { empresa: true },
    });

    return NextResponse.json({
      success: true,
      relatorio,
      downloadUrl: `/api/relatorios/${relatorio.id}/download`,
    });
  } catch (error) {
    console.error("Erro ao gerar relatorio:", error);
    return NextResponse.json(
      {
        error: `Erro ao processar arquivo: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      },
      { status: 500 }
    );
  }
}
