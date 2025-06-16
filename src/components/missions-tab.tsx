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

  const handleComplete = (missionId: number) => {
    // Aqui você poderia fazer uma chamada POST para completar a missão
    toast.success("Missão completada! (mock)");
    setMissions((prev) =>
      prev.map((m) => (m.id === missionId ? { ...m, status: "COMPLETED" } : m))
    );
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
