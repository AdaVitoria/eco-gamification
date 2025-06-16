// app/api/dashboard/ranking/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfWeek, endOfWeek } from "date-fns";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = Number(params.id);
    if (!userId) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const now = new Date();
    const start = startOfWeek(now, { weekStartsOn: 0 });
    const end = endOfWeek(now, { weekStartsOn: 0 });

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

    const rankingMap = new Map<
      number,
      { userId: number; userName: string; totalPoints: number }
    >();

    for (const cm of completed) {
      const uid = cm.userId;
      const uname = cm.user.name;
      const score = cm.mission.score;

      if (!rankingMap.has(uid)) {
        rankingMap.set(uid, { userId: uid, userName: uname, totalPoints: 0 });
      }
      rankingMap.get(uid)!.totalPoints += score;
    }

    const rankingArray = Array.from(rankingMap.values()).sort(
      (a, b) => b.totalPoints - a.totalPoints
    );

    const position =
      rankingArray.findIndex((entry) => entry.userId === userId) + 1;

    return NextResponse.json({
      position: position > 0 ? position : null,
      total: rankingArray.length,
    });
  } catch (error) {
    console.error("Erro ao calcular ranking do usuário:", error);
    return NextResponse.json({ error: "Erro no ranking" }, { status: 500 });
  }
}
