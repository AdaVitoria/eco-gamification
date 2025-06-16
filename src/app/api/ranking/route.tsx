import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfWeek, endOfWeek } from "date-fns";

export async function GET() {
  try {
    const now = new Date();

    // Semana: domingo (0) a sábado (6)
    const start = startOfWeek(now, { weekStartsOn: 0 }); // domingo
    const end = endOfWeek(now, { weekStartsOn: 0 }); // sábado

    // Busca missões completadas na semana atual, trazendo missão e usuário
    const completed = await prisma.completedMission.findMany({
      where: {
        completionDate: {
          gte: start,
          lte: end,
        },
      },
      include: {
        user: true,
        mission: true,
      },
    });

    // Agrupa por usuário e soma as pontuações
    const rankingMap = new Map<
      number,
      { userId: number; userName: string; totalPoints: number }
    >();

    for (const cm of completed) {
      const userId = cm.userId;
      const userName = cm.user.name;
      const score = cm.mission.score;

      if (!rankingMap.has(userId)) {
        rankingMap.set(userId, { userId, userName, totalPoints: 0 });
      }
      rankingMap.get(userId)!.totalPoints += score;
    }

    // Converte para array e ordena decrescente por pontos
    const ranking = Array.from(rankingMap.values()).sort(
      (a, b) => b.totalPoints - a.totalPoints
    );

    return NextResponse.json(ranking);
  } catch (error) {
    console.error("[API] weekly-ranking error:", error);
    return NextResponse.json(
      { error: "Erro ao buscar ranking semanal" },
      { status: 500 }
    );
  }
}
