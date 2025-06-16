import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcryptjs from "bcryptjs";

// PATCH /api/users/:id
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = Number(params.id);
  if (isNaN(userId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const body = await req.json();
  const { login, name, email, password } = body;

  // Não permitir campos proibidos como cpf ou points
  if (body.cpf || body.points !== undefined) {
    return NextResponse.json(
      {
        error:
          "Campos 'cpf' e 'points' não podem ser atualizados por esta rota.",
      },
      { status: 403 }
    );
  }

  try {
    const data: any = {};

    if (login !== undefined) data.login = login;
    if (name !== undefined) data.name = name;
    if (email !== undefined) data.email = email;
    if (password !== undefined) {
      // Se senha for enviada, criptografa
      data.password = await bcryptjs.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
    });

    // Por segurança, não retorna a senha
    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json(userWithoutPassword, { status: 200 });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Campo único já existente (login, email...)" },
        { status: 400 }
      );
    }

    console.error(error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
