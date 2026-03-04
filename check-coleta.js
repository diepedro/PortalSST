const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: { role: "COLETA" },
    select: { email: true, name: true, role: true }
  });
  console.log("Usuarios com perfil COLETA:");
  console.log(JSON.stringify(users, null, 2));
}

main().finally(() => prisma.$disconnect());
