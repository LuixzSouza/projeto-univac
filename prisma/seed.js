// # (Opcional) Script para popular o banco com dados iniciai
// /prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o seeding...');

  // Criptografar a senha
  const senhaAdmin = await bcrypt.hash('admin123', 10);

  // usuário Admin
  const admin = await prisma.funcionarioUsuario.upsert({
    where: { email: 'admin@vacina.com' }, // Procura por esse email
    update: {}, // Se achar, não faz nada
    create: {
      nome: 'Admin do Sistema',
      email: 'admin@vacina.com',
      senha: senhaAdmin,
      cpf: '00000000000',
      numeroRegistro: 12345,
      role: 'ADMIN', 
      status: true,
    },
  });

  console.log('Usuário Admin criado:');
  console.log(admin);
  console.log('Seeding concluído.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });