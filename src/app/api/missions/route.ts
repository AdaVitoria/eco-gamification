// /app/api/missions/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth"; // helper para decodificar JWT

export async function GET(req: Request) {
  try {
    const user = await getUserFromToken(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Busca todas as missões e se foram completadas pelo usuário
    const allMissions = await prisma.mission.findMany({
      include: {
        completedBy: {
          where: { userId: user.id },
        },
      },
    });

    const formatted = allMissions.map((mission) => ({
      id: mission.id,
      title: mission.name,
      description: mission.description,
      points: mission.score,
      status: mission.completedBy.length > 0 ? "COMPLETED" : "ACTIVE",
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Erro ao buscar missões:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
