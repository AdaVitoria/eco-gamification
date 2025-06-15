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

  const completed = await prisma.completedMission.findMany({
    where: { userId: user.id },
    select: { missionId: true },
  });

  const completedIds = completed.map((c) => c.missionId);

  const pendingMissions = await prisma.mission.findMany({
    where: {
      id: {
        notIn: completedIds.length > 0 ? completedIds : [0],
      },
    },
  });

  return NextResponse.json(pendingMissions);
}
