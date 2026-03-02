-- AlterTable
ALTER TABLE "atividades" ADD COLUMN     "usuario_id" TEXT;

-- AddForeignKey
ALTER TABLE "atividades" ADD CONSTRAINT "atividades_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
