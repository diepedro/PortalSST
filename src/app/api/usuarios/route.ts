import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) return null;
  const user = session.user as { role?: string };
  if (user.role !== "ADMIN") return null;
  return session;
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Acesso restrito" }, { status: 403 });
  }
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      empresaId: true,
      empresa: { select: { nome: true } },
    },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Acesso restrito" }, { status: 403 });
  }
  try {
    const { name, email, password, role, empresaId } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Nome, email e senha sao obrigatorios" }, { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email ja cadastrado" }, { status: 409 });
    }
    const hash = await bcrypt.hash(password, 12);

    let finalEmpresaId = role === "CLIENTE" ? empresaId : (empresaId === "none" ? null : empresaId);

    // Se for CLIENTE, forcar a empresa "Hospitalar"
    if (role === "CLIENTE") {
      let hospitalar = await prisma.empresa.findFirst({
        where: { nome: { equals: "Hospitalar", mode: "insensitive" } },
      });
      if (!hospitalar) {
        hospitalar = await prisma.empresa.create({
          data: { nome: "Hospitalar" },
        });
      }
      finalEmpresaId = hospitalar.id;
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hash,
        role: role || "USER",
        empresaId: finalEmpresaId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        empresa: { select: { nome: true } },
      },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar usuario:", error);
    return NextResponse.json({ error: "Erro ao criar usuario" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Acesso restrito" }, { status: 403 });
  }
  try {
    const { id } = await req.json();
    const me = session.user as { id?: string };
    if (me.id === id) {
      return NextResponse.json({ error: "Nao e possivel excluir o proprio usuario" }, { status: 400 });
    }
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir usuario:", error);
    return NextResponse.json({ error: "Erro ao excluir usuario" }, { status: 500 });
  }
}
