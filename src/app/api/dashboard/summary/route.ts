// app/api/dashboard/summary/route.ts
import { prisma } from "@/lib/prisma";
import { startOfWeek, endOfWeek } from "date-fns";
import { NextResponse } from "next/server";

export async function GET() {
  const now = new Date();
  const start = startOfWeek(now, { weekStartsOn: 0 });
  const end = endOfWeek(now, { weekStartsOn: 0 });

  try {
    const users = await prisma.user.findMany({
      include: {
        missions: {
          include: {
            mission: true,
          },
        },
      },
    });

    const summary = users.map((user) => {
      const completedThisWeek = user.missions.filter((m) => {
        const date = new Date(m.completionDate);
        return date >= start && date <= end;
      });

      const totalPoints = user.missions.reduce(
        (acc, m) => acc + m.mission.score,
        0
      );

      const weeklyPoints = completedThisWeek.reduce(
        (acc, m) => acc + m.mission.score,
        0
      );

      return {
        userId: user.id,
        userName: user.name,
        totalPoints,
        weeklyPoints,
        totalMissions: user.missions.length,
        weeklyMissions: completedThisWeek.length,
      };
    });

    return NextResponse.json(summary);
  } catch (err) {
    return NextResponse.json(
      { error: "Erro ao gerar resumo" },
      { status: 500 }
    );
  }
}
