// app/api/funcionarios/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, numeroRegistro, cpf, email, senha, role, status } = body;

    // Validação
    if (!nome || !numeroRegistro || !cpf || !email || !senha) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }

    // Criptografa a senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Cria o funcionário
    const novoFuncionario = await prisma.funcionarioUsuario.create({
      data: {
        nome,
        numeroRegistro: Number(numeroRegistro), // <- Corrigido
        cpf,
        email,
        senha: senhaHash,                       // <- Corrigido
        role,
        status,
      },
    });

    return NextResponse.json(novoFuncionario, { status: 201 });

  } catch (error: any) {
    console.error("Erro no POST /api/funcionarios:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao criar funcionário" },
      { status: 500 }
    );
  }
}
