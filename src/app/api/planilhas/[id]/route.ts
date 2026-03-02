import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";
import { aplicarEdicaoDadosPlanilha, extrairDadosPlanilha, PlanilhaLinhaInput } from "@/lib/planilha-editor";
import { readPlanilhaMetadata } from "@/lib/report-service";

function canAccess(role: string, userId: string, ownerId: string | null) {
  if (role === "ADMIN") return true;
  return ownerId === userId;
}

async function getScopedPlanilha(id: string, role: string, userId: string) {
  const planilha = await prisma.planilha.findUnique({ where: { id } });
  if (!planilha) return { error: NextResponse.json({ error: "Planilha nao encontrada" }, { status: 404 }) };
  if (!canAccess(role, userId, planilha.usuarioId)) {
    return { error: NextResponse.json({ error: "Acesso negado" }, { status: 403 }) };
  }
  return { planilha };
}

function getFilePath(fileName: string) {
  return path.join(process.cwd(), "uploads", "planilhas", fileName);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }

  const role = (session.user as any).role as string;
  if (role === "CLIENTE") {
    return NextResponse.json({ error: "Permissao insuficiente" }, { status: 403 });
  }

  const { id } = await params;
  const scoped = await getScopedPlanilha(id, role, session.user.id);
  if (scoped.error) return scoped.error;

  const filePath = getFilePath(scoped.planilha!.arquivoPath);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Arquivo nao encontrado no disco" }, { status: 404 });
  }

  const mode = req.nextUrl.searchParams.get("mode");
  if (mode === "dados") {
    const buffer = fs.readFileSync(filePath);
    const linhas = await extrairDadosPlanilha(buffer);
    return NextResponse.json({
      id: scoped.planilha!.id,
      nome: scoped.planilha!.nome,
      tipo: scoped.planilha!.tipo,
      linhas,
    });
  }

  const fileBuffer = fs.readFileSync(filePath);
  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${scoped.planilha!.nome}"`,
    },
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }

  const role = (session.user as any).role as string;
  if (role === "CLIENTE") {
    return NextResponse.json({ error: "Permissao insuficiente" }, { status: 403 });
  }

  const { id } = await params;
  const scoped = await getScopedPlanilha(id, role, session.user.id);
  if (scoped.error) return scoped.error;

  try {
    const body = await req.json();
    const linhas = (body?.linhas ?? []) as PlanilhaLinhaInput[];
    if (!Array.isArray(linhas)) {
      return NextResponse.json({ error: "Payload invalido" }, { status: 400 });
    }

    const filePath = getFilePath(scoped.planilha!.arquivoPath);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Arquivo nao encontrado no disco" }, { status: 404 });
    }

    const originalBuffer = fs.readFileSync(filePath);
    const updatedBuffer = await aplicarEdicaoDadosPlanilha(originalBuffer, linhas);
    fs.writeFileSync(filePath, updatedBuffer);

    const meta = await readPlanilhaMetadata(updatedBuffer);

    const tipoBody = String(body?.tipo ?? "").toUpperCase();
    const tipoFinal =
      tipoBody === "SAUDE" || tipoBody === "COMPARATIVO" || tipoBody === "NPS"
        ? tipoBody
        : scoped.planilha!.tipo;

    const updated = await prisma.planilha.update({
      where: { id: scoped.planilha!.id },
      data: {
        nome: body?.nome ? String(body.nome) : scoped.planilha!.nome,
        tipo: tipoFinal,
        tamanho: updatedBuffer.byteLength,
        empresaNome: meta.empresaNome || null,
        dataColetaTexto: meta.dataColetaTexto || null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erro ao atualizar planilha:", error);
    return NextResponse.json({ error: "Erro ao atualizar planilha" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }

  const role = (session.user as any).role as string;
  if (role === "CLIENTE") {
    return NextResponse.json({ error: "Permissao insuficiente" }, { status: 403 });
  }

  const { id } = await params;
  const scoped = await getScopedPlanilha(id, role, session.user.id);
  if (scoped.error) return scoped.error;

  const filePath = getFilePath(scoped.planilha!.arquivoPath);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  await prisma.planilha.delete({ where: { id: scoped.planilha!.id } });
  return NextResponse.json({ success: true });
}
