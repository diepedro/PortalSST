import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import path from "path";
import fs from "fs";

const UPLOADS_DIR = path.join(process.cwd(), "uploads", "arquivos");

function ensureDir() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }
  const arquivos = await prisma.arquivo.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(arquivos);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }
  try {
    ensureDir();
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (files.length === 0) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    const results = [];
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const safeName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const filePath = path.join(UPLOADS_DIR, safeName);
      fs.writeFileSync(filePath, buffer);

      const arquivo = await prisma.arquivo.create({
        data: {
          nome: file.name,
          tipo: file.type,
          tamanho: file.size,
          url: safeName,
        },
      });
      results.push(arquivo);
    }

    return NextResponse.json(results, { status: 201 });
  } catch (error) {
    console.error("Erro upload:", error);
    return NextResponse.json({ error: "Erro no upload" }, { status: 500 });
  }
}
