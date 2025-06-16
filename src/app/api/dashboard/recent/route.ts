// app/api/dashboard/recent/route.ts
import { prisma } from "@/lib/prisma";
import { startOfWeek, endOfWeek } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = Number(req.nextUrl.searchParams.get("userId"));

  const start = startOfWeek(new Date(), { weekStartsOn: 0 });
  const end = endOfWeek(new Date(), { weekStartsOn: 0 });

  if (!userId) {
    return NextResponse.json(
      { error: "ID do usuário é obrigatório" },
      { status: 400 }
    );
  }

  try {
    const completions = await prisma.completedMission.findMany({
      where: {
        userId,
        completionDate: {
          gte: start,
          lte: end,
        },
      },
      include: {
        mission: true,
      },
    });

    return NextResponse.json(completions);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar conquistas recentes" },
      { status: 500 }
    );
  }
}
