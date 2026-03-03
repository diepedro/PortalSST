DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    WHERE t.typname = 'Role' AND e.enumlabel = 'COLETA'
  ) THEN
    ALTER TYPE "Role" ADD VALUE 'COLETA';
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "planilhas" (
  "id" TEXT NOT NULL,
  "nome" TEXT NOT NULL,
  "tipo" TEXT NOT NULL,
  "tamanho" INTEGER NOT NULL,
  "arquivo_path" TEXT NOT NULL,
  "empresa_nome" TEXT,
  "data_coleta_texto" TEXT,
  "usuario_id" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "planilhas_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "planilhas_created_at_idx" ON "planilhas"("created_at");
CREATE INDEX IF NOT EXISTS "planilhas_usuario_id_idx" ON "planilhas"("usuario_id");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'planilhas_usuario_id_fkey'
  ) THEN
    ALTER TABLE "planilhas"
      ADD CONSTRAINT "planilhas_usuario_id_fkey"
      FOREIGN KEY ("usuario_id") REFERENCES "users"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
