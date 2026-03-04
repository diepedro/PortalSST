import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: { role: "COLETA" },
    select: { email: true, name: true }
  });
  console.log("Usuarios com perfil COLETA:");
  console.log(users);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
