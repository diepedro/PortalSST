#!/bin/sh
set -e

echo ""
echo "========================================="
echo "  Portal Equilibrio SST v2.0"
echo "  MEGGA WORK - Saude e Seguranca"
echo "========================================="
echo ""

echo "[1/3] Aplicando migracoes do banco..."
npx prisma migrate deploy
echo ""

echo "[2/3] Verificando dados iniciais..."
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();
async function seed() {
  const exists = await prisma.user.findUnique({ where: { email: 'admin@meggawork.com' } });
  if (exists) { console.log('  Dados ja existem, pulando seed.'); return; }
  const hash = await bcrypt.hash('admin123', 12);
  await prisma.user.create({ data: { name: 'Administrador', email: 'admin@meggawork.com', password: hash, role: 'ADMIN' } });
  await prisma.empresa.create({ data: { id: 'seed-empresa-1', nome: 'Empresa Demonstracao', endereco: 'Rua Exemplo, 123 - Londrina/PR', contato: '(43) 3333-4444' } });
  await prisma.profissional.create({ data: { id: 'seed-prof-1', nome: 'Dra. Eliane Bueno', profissao: 'Enfermeira', especialidade: 'Saude do Trabalhador', disponibilidade: 'Seg a Sex', contato: '(43) 99988-7766' } });
  console.log('  Seed concluido com sucesso!');
  console.log('  Login: admin@meggawork.com / admin123');
}
seed().catch(e => console.error('Erro no seed:', e)).finally(() => prisma.\$disconnect());
"
echo ""

echo "[3/3] Iniciando servidor na porta 3000..."
echo ""
echo "  Acesse: http://localhost:3000"
echo "  Login:  admin@meggawork.com / admin123"
echo ""
exec node server.js
