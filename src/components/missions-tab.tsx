"use client";

import { useEffect, useState } from "react";
import { MissionCard } from "./mission-card"; // o seu componente
import { toast } from "sonner";

interface Mission {
  id: number;
  title: string;
  description: string;
  points: number;
  status: "ACTIVE" | "COMPLETED";
}

export function MissionsTab() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/missions", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMissions(data);
      })
      .catch((err) => {
        toast.error("Erro ao carregar missões");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleComplete = async (missionId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Usuário não autenticado");
        return;
      }

      // Decodifica o JWT para obter o userId
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.id;

      const res = await fetch("/api/complete-mission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, missionId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message || "Erro ao completar missão");
        return;
      }

      toast.success("Missão completada!");

      // Atualiza a missão no estado local
      setMissions((prev) =>
        prev.map((m) =>
          m.id === missionId ? { ...m, status: "COMPLETED" } : m
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Erro interno ao completar missão");
    }
  };

  if (loading) return <p>Carregando missões...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {missions.map((mission) => (
        <MissionCard
          key={mission.id}
          mission={mission}
          onComplete={() => handleComplete(mission.id)}
        />
      ))}
    </div>
  );
}
