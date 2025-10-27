-- CreateTable
CREATE TABLE "FuncionarioUsuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "numeroRegistro" INTEGER NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'FUNCIONARIO',
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "FuncionarioUsuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoVacina" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "obrigatoriedade" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TipoVacina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AplicacoesVacina" (
    "id" SERIAL NOT NULL,
    "dataAplicacao" TIMESTAMP(3) NOT NULL,
    "lote" TEXT NOT NULL,
    "funcionarioId" INTEGER NOT NULL,
    "vacinaId" INTEGER NOT NULL,

    CONSTRAINT "AplicacoesVacina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agendamento" (
    "id" SERIAL NOT NULL,
    "dataAgendamento" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "funcionarioId" INTEGER NOT NULL,
    "vacinaId" INTEGER NOT NULL,

    CONSTRAINT "Agendamento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FuncionarioUsuario_numeroRegistro_key" ON "FuncionarioUsuario"("numeroRegistro");

-- CreateIndex
CREATE UNIQUE INDEX "FuncionarioUsuario_cpf_key" ON "FuncionarioUsuario"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "FuncionarioUsuario_email_key" ON "FuncionarioUsuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TipoVacina_nome_key" ON "TipoVacina"("nome");

-- AddForeignKey
ALTER TABLE "AplicacoesVacina" ADD CONSTRAINT "AplicacoesVacina_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES "FuncionarioUsuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AplicacoesVacina" ADD CONSTRAINT "AplicacoesVacina_vacinaId_fkey" FOREIGN KEY ("vacinaId") REFERENCES "TipoVacina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES "FuncionarioUsuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_vacinaId_fkey" FOREIGN KEY ("vacinaId") REFERENCES "TipoVacina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
