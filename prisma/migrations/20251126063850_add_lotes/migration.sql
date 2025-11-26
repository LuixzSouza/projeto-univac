-- CreateTable
CREATE TABLE "Lote" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "validade" TIMESTAMP(3) NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vacinaId" INTEGER NOT NULL,

    CONSTRAINT "Lote_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Lote" ADD CONSTRAINT "Lote_vacinaId_fkey" FOREIGN KEY ("vacinaId") REFERENCES "TipoVacina"("id") ON DELETE CASCADE ON UPDATE CASCADE;
