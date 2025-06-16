import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET não definido");
}

export interface AuthPayload {
  id: number;
  login: string;
  email: string;
}

export function verifyToken(token: string): AuthPayload {
  const decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload;

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    typeof decoded.id !== "number" ||
    typeof decoded.login !== "string" ||
    typeof decoded.email !== "string"
  ) {
    throw new Error("Token inválido: payload ausente ou malformado");
  }

  return {
    id: decoded.id,
    login: decoded.login,
    email: decoded.email,
  };
}

export async function getUserFromToken(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );
    return {
      id: payload.id,
      login: payload.login,
      email: payload.email,
    };
  } catch (err) {
    return null;
  }
}
