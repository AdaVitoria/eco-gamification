import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error("JWT_SECRET não definida");

function generateJWT(user: { id: number; login: string; email: string }) {
  return jwt.sign(
    {
      id: user.id,
      login: user.login,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
}

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
      data.password = await bcryptjs.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
    });

    const token = generateJWT(updatedUser); // ⚡ Gera novo token com dados atualizados

    return NextResponse.json({ token }, { status: 200 }); // ✅ Retorna o novo token
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
