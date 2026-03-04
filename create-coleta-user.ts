import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "coleta@meggawork.com";
  const password = "coleta123";
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: "COLETA"
    },
    create: {
      name: "Usuario Coleta",
      email,
      password: hashedPassword,
      role: "COLETA",
    },
  });

  console.log("-----------------------------------------");
  console.log("Usuario COLETA criado/atualizado:");
  console.log(`Email: ${email}`);
  console.log(`Senha: ${password}`);
  console.log("-----------------------------------------");
}

main()
  .catch((e) => {
    console.error("Erro ao criar usuario:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
