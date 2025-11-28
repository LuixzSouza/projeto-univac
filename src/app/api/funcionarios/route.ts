import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// LISTAR FUNCIONÁRIOS
export async function GET() {
  try {
    // Buscamos todos, mas é boa prática NÃO retornar a senha hashed para o front
    const funcionarios = await prisma.funcionarioUsuario.findMany({
      orderBy: { nome: 'asc' },
      select: {
        id: true,
        nome: true,
        email: true,
        cpf: true,
        numeroRegistro: true,
        role: true,
        status: true,
      }
    });

    return NextResponse.json(funcionarios);
  } catch (error) {
    console.error("Erro ao buscar funcionários:", error);
    return NextResponse.json(
      { error: "Erro ao buscar funcionários" },
      { status: 500 }
    );
  }
}

// CRIAR FUNCIONÁRIO
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Apenas ADMIN pode criar novos usuários
    if (session?.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso negado. Apenas Admin." }, { status: 403 });
    }

    const body = await request.json();
    const { nome, email, cpf, numeroRegistro, senha, role, status } = body;

    // Validação Básica
    if (!nome || !email || !cpf || !senha || !numeroRegistro) {
      return NextResponse.json(
        { error: "Todos os campos obrigatórios devem ser preenchidos" },
        { status: 400 }
      );
    }

    // Verificar duplicidade (Email, CPF ou Registro)
    const existe = await prisma.funcionarioUsuario.findFirst({
      where: {
        OR: [
          { email },
          { cpf },
          { numeroRegistro: Number(numeroRegistro) }
        ]
      }
    });

    if (existe) {
      return NextResponse.json(
        { error: "Já existe um usuário com este Email, CPF ou Nº Registro." },
        { status: 409 }
      );
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Criar no Banco
    const novoFuncionario = await prisma.funcionarioUsuario.create({
      data: {
        nome,
        email,
        cpf,
        numeroRegistro: Number(numeroRegistro),
        senha: hashedPassword,
        role: role || "FUNCIONARIO",
        status: status !== undefined ? status : true
      }
    });

    const { senha: _, ...funcionarioSemSenha } = novoFuncionario;

    return NextResponse.json(funcionarioSemSenha, { status: 201 });

  } catch (error) {
    console.error("Erro ao criar funcionário:", error);
    return NextResponse.json(
      { error: "Erro interno ao criar funcionário" },
      { status: 500 }
    );
  }
}