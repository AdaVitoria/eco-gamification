import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Token ausente" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  let user;
  try {
    user = verifyToken(token);
  } catch (err) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  const completedMissions = await prisma.completedMission.findMany({
    where: { userId: user.id },
    include: {
      mission: true,
    },
  });

  return NextResponse.json(completedMissions.map((c) => c.mission));
}
