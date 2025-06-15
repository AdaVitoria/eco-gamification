import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcryptjs from "bcryptjs";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { login, name, cpf, email, password } = body;

  if (!login || !name || !cpf || !email || !password) {
    return NextResponse.json(
      { error: "Campos obrigatórios ausentes" },
      { status: 400 }
    );
  }

  try {
    // Gera o hash da senha (10 é o saltRounds padrão, ok pra maioria dos casos)
    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        login,
        name,
        cpf,
        email,
        password: hashedPassword, // salva o hash, nunca a senha em texto puro
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
