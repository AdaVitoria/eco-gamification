"use client";

import { useEffect, useState } from "react";

type RankingUser = {
  userId: number;
  userName: string;
  totalPoints: number;
  isCurrentUser?: boolean;
};

const medalColors = {
  1: "bg-yellow-400", // ouro
  2: "bg-gray-400", // prata
  3: "bg-orange-400", // bronze
};

export function RankingTab() {
  const [ranking, setRanking] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRanking() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/ranking");
        if (!res.ok) throw new Error("Falha ao carregar ranking");

        const data: RankingUser[] = await res.json();
        setRanking(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }

    fetchRanking();
  }, []);

  if (loading) return <p>Carregando ranking...</p>;
  if (error) return <p className="text-red-600">Erro: {error}</p>;
  if (ranking.length === 0)
    return <p>Nenhum usuário pontuou nesta semana ainda.</p>;

  return (
    <div className="space-y-3">
      {/* Título igual da imagem */}
      <h2 className="text-2xl font-bold text-black mb-4">Ranking Semanal</h2>

      {ranking.map((user, i) => {
        const position = i + 1;
        const isTop3 = position <= 3;
        const medalColor = medalColors[position as 1 | 2 | 3];
        const isCurrentUser = user.isCurrentUser;

        return (
          <div
            key={user.userId}
            className={`flex items-center justify-between p-4 rounded-lg border
              ${isCurrentUser ? "bg-blue-100" : "bg-white"}
              shadow-sm`}
          >
            <div className="flex items-center gap-4">
              {/* Medalha ou posição */}
              {isTop3 ? (
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-white font-bold ${medalColor}`}
                  title={`Posição ${position}`}
                >
                  {position === 1 && "🥇"}
                  {position === 2 && "🥈"}
                  {position === 3 && "🥉"}
                </div>
              ) : (
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-200 text-blue-800 font-semibold"
                  title={`Posição ${position}`}
                >
                  {position}
                </div>
              )}

              {/* Avatar placeholder */}
              <div className="w-10 h-10 rounded-full bg-gray-200" />

              {/* Nome e destaque "Você" */}
              <div>
                <p className="font-medium">{user.userName}</p>
                {isCurrentUser && (
                  <p className="text-xs font-semibold text-gray-700">Você</p>
                )}
              </div>
            </div>

            {/* Pontuação */}
            <div className="text-right">
              <p className="font-bold text-lg">{user.totalPoints}</p>
              <p className="text-xs text-gray-500">pontos</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
