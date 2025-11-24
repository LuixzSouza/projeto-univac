// app/api/funcionarios/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, numeroRegistro, cpf, email, senha, role, status } = body;

    if (!nome || !numeroRegistro || !cpf || !email || !senha) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const novoFuncionario = await prisma.funcionarioUsuario.create({
      data: {
        nome,
        numeroRegistro: Number(numeroRegistro),
        cpf,
        email,
        senha: senhaHash,
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

// =========================
// AQUI ESTÁ O GET ⬇⬇⬇
// =========================
export async function GET() {
  try {
    const funcionarios = await prisma.funcionarioUsuario.findMany({
      orderBy: { id: "desc" }
    });

    return NextResponse.json(funcionarios);
  } catch (error: any) {
    console.error("Erro no GET /api/funcionarios:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao buscar funcionários" },
      { status: 500 }
    );
  }
}
