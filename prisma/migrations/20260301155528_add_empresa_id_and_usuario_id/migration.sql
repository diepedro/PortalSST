-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Role" ADD VALUE 'TECNICO';
ALTER TYPE "Role" ADD VALUE 'CLIENTE';

-- AlterEnum
ALTER TYPE "StatusAtividade" ADD VALUE 'SOLICITADA';

-- AlterTable
ALTER TABLE "relatorios" ADD COLUMN     "usuario_id" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "empresa_id" TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatorios" ADD CONSTRAINT "relatorios_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
