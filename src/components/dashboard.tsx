"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Summary = {
  totalPoints: number;
  weeklyPoints: number;
  totalMissions: number;
  weeklyMissions: number;
};

type RecentMission = {
  mission: { name: string; score: number };
};

export function Dashboard() {
  const [userId, setUserId] = useState<number | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [recent, setRecent] = useState<RecentMission[]>([]);
  const [ranking, setRanking] = useState<string>("...");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const payload = JSON.parse(atob(token.split(".")[1]));
    const id = payload.id;
    setUserId(id);

    // Busca resumo
    fetch("/api/dashboard/summary")
      .then((res) => res.json())
      .then((data) => {
        const userSummary = data.find((d: any) => d.userId === id);
        setSummary(userSummary);
      });

    // Busca conquistas recentes
    fetch(`/api/dashboard/recent?userId=${id}`)
      .then((res) => res.json())
      .then(setRecent);

    // Busca ranking semanal
    fetch(`/api/dashboard/ranking/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.position) {
          setRanking(`#${data.position} de ${data.total}`);
        } else {
          setRanking("Fora do ranking");
        }
      });
  }, []);

  return (
    <div className="space-y-6 px-6">
      {/* Cards superiores */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card
          title="Pontos Totais"
          value={summary?.totalPoints}
          extra={`+${summary?.weeklyPoints} esta semana`}
        />
        <Card
          title="Ranking"
          value={ranking}
          extra={`+${summary?.weeklyPoints} pts`}
        />
        <Card
          title="Missões Completas"
          value={summary?.totalMissions}
          extra={`+${summary?.weeklyMissions} esta semana`}
        />
      </div>

      {/* Conquistas recentes */}
      <div className="bg-white rounded-xl p-4 shadow">
        <h2 className="text-lg font-semibold">Conquistas Recentes</h2>
        <p className="text-sm text-gray-500 mb-4">
          Suas últimas missões completadas
        </p>
        <div className="space-y-2">
          {recent.map((item, i) => (
            <div
              key={i}
              className="bg-green-50 rounded-md px-4 py-2 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{item.mission.name}</p>
                <p className="text-sm text-green-700">
                  +{item.mission.score} pontos
                </p>
              </div>
              <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                Completa
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Botão de relatório */}
      <a href="/api/dashboard/relatorio" target="_blank">
        <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700">
          Gerar Relatório
        </Button>
      </a>
    </div>
  );
}

function Card({
  title,
  value,
  extra,
}: {
  title: string;
  value: any;
  extra: string;
}) {
  return (
    <div className="bg-white shadow rounded-xl p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold">{value ?? "..."}</h2>
      <p className="text-xs text-gray-400">{extra}</p>
    </div>
  );
}
