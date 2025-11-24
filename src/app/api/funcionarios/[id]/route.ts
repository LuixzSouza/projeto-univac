// app/api/funcionarios/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

interface Params {
  params: { id: string }
}

// GET - Buscar funcionário
export async function GET(request: Request, { params }: Params) {
  try {
    const funcionario = await prisma.funcionarioUsuario.findUnique({
      where: { id: Number(params.id) },
    })

    if (!funcionario)
      return NextResponse.json({ error: 'Funcionário não encontrado' }, { status: 404 })

    return NextResponse.json(funcionario, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar funcionário' }, { status: 500 })
  }
}

// PUT - Atualizar funcionário
export async function PUT(request: Request, { params }: Params) {
  try {
    const data = await request.json()
    const { nome, email, numeroRegistro, cpf, senha, role, status } = data

    const updateData: any = { nome, email, numeroRegistro: Number(numeroRegistro), cpf, role, status }

    if (senha) {
      updateData.senha = await bcrypt.hash(senha, 10)
    }

    const funcionarioAtualizado = await prisma.funcionarioUsuario.update({
      where: { id: Number(params.id) },
      data: updateData,
    })

    return NextResponse.json(funcionarioAtualizado, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao atualizar funcionário' }, { status: 500 })
  }
}

// DELETE - Excluir funcionário
export async function DELETE(request: Request, { params }: Params) {
  try {
    await prisma.funcionarioUsuario.delete({
      where: { id: Number(params.id) },
    })

    return NextResponse.json({ message: 'Funcionário excluído com sucesso' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao excluir funcionário' }, { status: 500 })
  }
}
