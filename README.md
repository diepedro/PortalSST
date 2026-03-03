# Portal Equilibrio SST v2.0

Portal de Saude e Seguranca do Trabalho - MEGGA WORK

## Stack

- **Frontend**: Next.js 16 + React 19 + Tailwind CSS + shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js (JWT + bcrypt)
- **PDF**: @react-pdf/renderer
- **Excel**: ExcelJS

## Desenvolvimento Local

### Pre-requisitos
- Node.js 20+
- PostgreSQL (ou Docker)

### Setup
```bash
npm install
cp .env.example .env
# Editar .env com sua DATABASE_URL
npx prisma migrate dev
npm run db:seed
npm run dev
```

### Login padrao
- **Email**: admin@meggawork.com
- **Senha**: admin123

## Docker
```bash
docker compose up -d --build
```

### Docker + Cloudflare Tunnel
Use um token de tunnel ja criado no Cloudflare:
```bash
set CLOUDFLARE_TUNNEL_TOKEN=SEU_TOKEN_AQUI
docker compose --profile tunnel up -d --build
docker compose logs -f cloudflared
```

## Vercel
1. Crie um banco PostgreSQL no Neon ou Supabase
2. Configure DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL no Vercel
3. Deploy via vercel CLI ou conecte o repositorio
