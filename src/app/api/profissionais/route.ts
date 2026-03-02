import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function GET() {
  const profissionais = await prisma.profissional.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(profissionais);
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let nome = "";
    let profissao = "";
    let especialidade: string | null = null;
    let disponibilidade: string | null = null;
    let contato: string | null = null;
    let portfolioUrl: string | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      nome = String(formData.get("nome") || "");
      profissao = String(formData.get("profissao") || "");
      especialidade = String(formData.get("especialidade") || "") || null;
      disponibilidade = String(formData.get("disponibilidade") || "") || null;
      contato = String(formData.get("contato") || "") || null;
      const portfolio = formData.get("portfolio") as File | null;

      if (portfolio) {
        const uploadsDir = path.join(process.cwd(), "public", "uploads", "portfolio");
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const safeName = portfolio.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const fileName = `${Date.now()}_${safeName}`;
        const filePath = path.join(uploadsDir, fileName);
        const buffer = Buffer.from(await portfolio.arrayBuffer());
        fs.writeFileSync(filePath, buffer);
        portfolioUrl = `/uploads/portfolio/${fileName}`;
      }
    } else {
      const body = await req.json();
      nome = body.nome;
      profissao = body.profissao;
      especialidade = body.especialidade || null;
      disponibilidade = body.disponibilidade || null;
      contato = body.contato || null;
      portfolioUrl = body.portfolioUrl || null;
    }

    const profissional = await prisma.profissional.create({
      data: {
        nome,
        profissao,
        especialidade,
        disponibilidade,
        contato,
        portfolioUrl,
      },
    });
    return NextResponse.json(profissional, { status: 201 });
  } catch (error) {
    console.error("Erro ao cadastrar profissional", error);
    return NextResponse.json(
      { error: "Erro ao cadastrar profissional" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    const profissional = await prisma.profissional.update({
      where: { id },
      data,
    });
    return NextResponse.json(profissional);
  } catch (error) {
    console.error("Erro ao atualizar profissional", error);
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
  }
}
