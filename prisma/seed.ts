import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 12);

  await prisma.user.upsert({
    where: { email: "admin@meggawork.com" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@meggawork.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  await prisma.empresa.upsert({
    where: { id: "seed-empresa-1" },
    update: {},
    create: {
      id: "seed-empresa-1",
      nome: "Empresa Demonstração",
      endereco: "Rua Exemplo, 123 - Londrina/PR",
      contato: "(43) 3333-4444",
    },
  });

  await prisma.profissional.upsert({
    where: { id: "seed-prof-1" },
    update: {},
    create: {
      id: "seed-prof-1",
      nome: "Dra. Eliane Bueno",
      profissao: "Enfermeira",
      especialidade: "Saúde do Trabalhador",
      disponibilidade: "Seg a Sex",
      contato: "(43) 99988-7766",
    },
  });

  console.log("Seed concluído com sucesso!");
  console.log("Login: admin@meggawork.com / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
