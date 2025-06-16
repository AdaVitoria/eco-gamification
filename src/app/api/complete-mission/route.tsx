// app/api/complete-mission/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, missionId } = await req.json();

    if (!userId || !missionId) {
      return NextResponse.json(
        { error: "Parâmetros ausentes" },
        { status: 400 }
      );
    }

    // Verifica se a missão já foi completada
    const alreadyCompleted = await prisma.completedMission.findFirst({
      where: { userId, missionId },
    });

    if (alreadyCompleted) {
      return NextResponse.json(
        { message: "Missão já completada" },
        { status: 400 }
      );
    }

    // Busca a missão para saber quantos pontos vale
    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
    });

    if (!mission) {
      return NextResponse.json(
        { error: "Missão não encontrada" },
        { status: 404 }
      );
    }

    // Cria registro de missão completada
    await prisma.completedMission.create({
      data: {
        userId,
        missionId,
      },
    });

    // Atualiza os pontos do usuário
    await prisma.user.update({
      where: { id: userId },
      data: {
        points: { increment: mission.score },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
