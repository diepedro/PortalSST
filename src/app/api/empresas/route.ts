import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) return null;
  const user = session.user as { role?: string };
  if (user.role !== "ADMIN" && user.role !== "TECNICO") return null;
  return session;
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Acesso restrito" }, { status: 403 });
  }
  
  try {
    const empresas = await prisma.empresa.findMany({
      orderBy: { nome: "asc" },
      select: { id: true, nome: true }
    });
    return NextResponse.json(empresas);
  } catch (error) {
    console.error("Erro ao buscar empresas:", error);
    return NextResponse.json({ error: "Erro ao buscar empresas" }, { status: 500 });
  }
}
