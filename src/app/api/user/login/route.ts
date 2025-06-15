import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET não está definida no ambiente.");
}
const JWT_SECRET = process.env.JWT_SECRET;

async function findUserByIdentifier(identifier: string) {
  return prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { login: identifier }, { cpf: identifier }],
    },
  });
}

async function verifyPassword(plain: string, hash: string) {
  return bcryptjs.compare(plain, hash);
}

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Campos obrigatórios ausentes" },
        { status: 400 }
      );
    }

    const user = await findUserByIdentifier(identifier);
    if (!user) {
      // Por segurança, pode colocar mensagem genérica:
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    const token = generateJWT(user);

    return NextResponse.json({ token }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
