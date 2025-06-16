import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { format, startOfWeek, endOfWeek, subWeeks } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = parseInt(url.searchParams.get("userId") || "");
    if (isNaN(userId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const drawText = (text: string, y: number) =>
      page.drawText(text, {
        x: 50,
        y,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });

    let y = 760;
    drawText("Relatório Semanal de Desempenho", y);
    y -= 30;

    const numSemanas = 4; // últimas 4 semanas
    const agora = new Date();

    for (let i = numSemanas - 1; i >= 0; i--) {
      const semanaInicio = startOfWeek(subWeeks(agora, i), { weekStartsOn: 0 });
      const semanaFim = endOfWeek(subWeeks(agora, i), { weekStartsOn: 0 });

      // Missões do usuário na semana
      const missoesUser = await prisma.completedMission.findMany({
        where: {
          userId,
          completionDate: {
            gte: semanaInicio,
            lte: semanaFim,
          },
        },
      });

      // Todas as missões da semana (para calcular o ranking)
      const todas = await prisma.completedMission.findMany({
        where: {
          completionDate: {
            gte: semanaInicio,
            lte: semanaFim,
          },
        },
        include: {
          mission: true,
          user: true,
        },
      });

      // Calcular pontos por usuário
      const rankingMap = new Map<number, number>();
      for (const cm of todas) {
        const id = cm.userId;
        const pontos = cm.mission.score;
        rankingMap.set(id, (rankingMap.get(id) || 0) + pontos);
      }

      const rankingOrdenado = Array.from(rankingMap.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([id]) => id);

      const posicao = rankingOrdenado.indexOf(userId) + 1;

      // Texto da semana
      drawText(
        `Semana de ${format(semanaInicio, "dd/MM/yyyy", { locale: ptBR })}:`,
        y
      );
      y -= 20;
      drawText(`- Missões completadas: ${missoesUser.length}`, y);
      y -= 20;
      drawText(
        `- Posição no ranking: ${
          posicao > 0 ? "#" + posicao : "Fora do ranking"
        }`,
        y
      );
      y -= 30;
    }

    const pdfBytes = await pdfDoc.save();

    return new Response(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=relatorio-semanal.pdf`,
      },
    });
  } catch (err) {
    console.error("Erro ao gerar relatório semanal", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
