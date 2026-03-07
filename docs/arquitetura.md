# Arquitetura Tecnica - Portal Equilibrio SST

## 1. Visao Geral

Aplicacao web full-stack em Next.js para operacao de Saude e Seguranca do Trabalho (SST), cobrindo:
- autenticacao e perfis de acesso;
- agenda de atividades;
- gerenciamento de planilhas de coleta;
- geracao de relatorios PDF;
- controle de estoque;
- upload/download de arquivos;
- fechamento financeiro por regras de negocio.

Repositorio: `C:\Users\eliza\OneDrive\Área de Trabalho\PortalSST`  
Data deste levantamento: **06/03/2026**.

## 2. Stack Tecnologica

- Frontend: Next.js 16 (App Router), React 19, TypeScript.
- UI: Tailwind CSS v4, shadcn/ui, Radix UI, Lucide.
- Backend: Route Handlers do Next.js em `src/app/api`.
- Banco: PostgreSQL.
- ORM: Prisma.
- Auth: NextAuth v5 (provider Credentials + JWT).
- Hash de senha: bcryptjs.
- Excel: ExcelJS.
- PDF: `@react-pdf/renderer`.
- Maps: Leaflet / React Leaflet.
- Containerizacao: Docker + Docker Compose.

## 3. Estrutura do Projeto

- `src/app`: telas e rotas App Router.
- `src/app/api`: endpoints backend.
- `src/components`: componentes UI e dashboard.
- `src/lib`: regras de negocio e servicos (auth, parser, PDF, financeiro, estoque).
- `prisma`: schema, migrations e seed.
- `public`: assets estaticos.
- `uploads` (runtime): arquivos persistidos localmente (`planilhas`, `arquivos`).

## 4. Dominios Funcionais

### 4.1 Autenticacao e Sessao

- Implementacao em `src/lib/auth.ts`.
- Login por email/senha (`Credentials`).
- Sessao JWT contendo `id`, `role`, `empresaId`.
- Middleware de navegacao em `src/middleware.ts`:
  - bloqueia paginas privadas para usuarios nao autenticados;
  - redireciona autenticado em `/login` para `/dashboard`;
  - nao intercepta rotas `/api`.

### 4.2 Usuarios e Perfis

Perfis no Prisma:
- `ADMIN`
- `TECNICO`
- `USER`
- `CLIENTE`
- `COLETA`

API principal: `src/app/api/usuarios/route.ts`.

Regras observadas:
- apenas `ADMIN` gerencia usuarios;
- `CLIENTE` eh vinculado automaticamente a empresa "Hospitalar" (se necessario, criada em runtime).

### 4.3 Agenda de Atividades

API: `src/app/api/agenda/route.ts`.

Capacidades:
- criar, listar, editar e excluir atividades (`Atividade`);
- associacao com `Empresa` e `Profissional`;
- regras de calculo para deslocamento e horas de blitz;
- consumo de estoque no agendamento/edicao (movimentacoes `SAIDA`).

Regras de acesso:
- `COLETA`: sem acesso;
- `CLIENTE`: cria solicitacao com restricoes (status `SOLICITADA`, sem permissao para editar/excluir);
- `ADMIN`/`TECNICO`: gestao completa.

### 4.4 Planilhas e Coleta

APIs:
- `src/app/api/planilhas/route.ts`
- `src/app/api/planilhas/[id]/route.ts`
- `src/app/api/planilhas/[id]/gerar/route.ts`
- `src/app/api/planilhas/coleta/route.ts`
- `src/app/api/planilhas/coleta/triagem-pdf/route.ts`

Fluxo:
1. Upload/geracao de `.xlsx`.
2. Persistencia do arquivo no disco (`uploads/planilhas`).
3. Persistencia de metadados em `Planilha` (DB).
4. Edicao de dados em planilha via API.
5. Geracao de relatorio a partir da planilha.

### 4.5 Relatorios e PDF

APIs:
- `src/app/api/relatorios/route.ts`
- `src/app/api/relatorios/[id]/route.ts`
- `src/app/api/relatorios/[id]/pdf/route.ts`

Servicos:
- `src/lib/report-service.ts`
- parsers:
  - `src/lib/excel-parser.ts` (SAUDE)
  - `src/lib/excel-parser-comparativo.ts`
  - `src/lib/excel-parser-nps.ts`

Tipos suportados:
- `SAUDE`
- `COMPARATIVO`
- `NPS`

PDF:
- geracao local quando `pdfUrl = "internal:generate"`;
- fallback para leitura por URL externa quando `pdfUrl` contem link remoto.

### 4.6 Estoque

Modelo:
- `Product`
- `StockBatch`
- `StockMovement`

Leitura API: `src/app/api/estoque/route.ts`  
Acoes server-side: `src/lib/actions/stock.ts`

Funcionalidades:
- cadastro de produtos e lotes;
- movimentacoes de entrada/saida;
- validacao de vencimento e saldo;
- vinculo opcional da saida com atividade agendada.

### 4.7 Financeiro

API: `src/app/api/financeiro/route.ts`  
Regras: `src/lib/financeiro.ts`

Funcoes:
- calculo de folha por periodo;
- regras por tipo de atividade (blitz/palestra);
- ajuda de custo;
- deslocamento por cidade/km.

Acesso:
- somente `ADMIN`.

### 4.8 Arquivos

APIs:
- `src/app/api/arquivos/route.ts`
- `src/app/api/arquivos/[id]/route.ts`

Fluxo:
- upload multiplo com persistencia no disco (`uploads/arquivos`);
- metadados em tabela `Arquivo`;
- download e exclusao por id.

## 5. Modelo de Dados (Resumo)

Principais entidades:
- `User` <-> `Empresa`
- `Relatorio` -> `Empresa` e `User`
- `Atividade` -> `Empresa`, `User`, `Profissional` (principal/secundario)
- `Planilha` -> `User`
- `Arquivo`
- `Product` -> `StockBatch` -> `StockMovement`

Enums relevantes:
- `Role`, `TipoAtividade`, `StatusAtividade`, `Transporte`, `MovementType`.

## 6. Infraestrutura e Deploy

### 6.1 Local

Scripts npm:
- `dev`, `build`, `start`
- `db:migrate`, `db:seed`, `db:reset`, `db:studio`

Variaveis de ambiente base em `.env.example`:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- `BLOB_READ_WRITE_TOKEN` (opcional)

### 6.2 Docker

`docker-compose.yml` sobe:
- `db` (Postgres 16)
- `app` (Next.js)
- `cloudflared` (profile opcional `tunnel`)

Volumes:
- `postgres_data`
- `uploads_data`

## 7. Seguranca e Controle de Acesso

- Autenticacao por credenciais com senha hasheada (`bcrypt`).
- Sessao JWT com claims de autorizacao (`role`, `empresaId`).
- Validacao de permissao em cada endpoint sensivel.
- Restricoes por papel na navegacao lateral (UI) e nas rotas de API.

## 8. Pontos de Atencao Tecnicos

- O projeto usa armazenamento local em disco para arquivos; em ambiente escalado, recomenda-se storage externo (S3/Blob) para alta disponibilidade.
- Existem strings com acentuacao corrompida em algumas respostas/labels (`Nao`, `Permissao`, etc.), indicando necessidade de padronizacao de encoding.
- Next.js 16 emite aviso de deprecacao para `middleware` (migracao futura para `proxy`).
- Parte das regras de autorizacao esta distribuida por rota; pode evoluir para camada centralizada de policy.

## 9. Correcoes Aplicadas Neste Ciclo

- Corrigido erro de sintaxe em `src/app/api/relatorios/route.ts` (declaracao duplicada de funcao).
- Removidos blocos mortos/inconsistentes na mesma rota para estabilizar compilacao.
- Removida dependencia de `next/font/google` em `src/app/layout.tsx` para evitar falha de build em ambiente sem acesso externo.
