-- CreateEnum
CREATE TYPE "Transporte" AS ENUM ('MOTORISTA', 'CARRO_PROPRIO');

-- AlterTable
ALTER TABLE "profissionais"
ADD COLUMN "portfolio_url" TEXT;

-- AlterTable
ALTER TABLE "atividades"
ADD COLUMN "profissional_2_id" TEXT,
ADD COLUMN "cidade" TEXT,
ADD COLUMN "gps_lat" DOUBLE PRECISION,
ADD COLUMN "gps_lng" DOUBLE PRECISION,
ADD COLUMN "ajuda_custo" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "transporte" "Transporte",
ADD COLUMN "blitz_horas" INTEGER,
ADD COLUMN "km_rodado" DOUBLE PRECISION;

-- AddForeignKey
ALTER TABLE "atividades"
ADD CONSTRAINT "atividades_profissional_2_id_fkey"
FOREIGN KEY ("profissional_2_id") REFERENCES "profissionais"("id") ON DELETE SET NULL ON UPDATE CASCADE;
