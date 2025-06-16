"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { DashboardTabs } from "@/components/dashboard-tabs";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      // Monta objeto user mockado com base no JWT
      const userData = {
        id: payload.id,
        name: payload.login || "Usuário",
        email: payload.email,
        totalPoints: 0,
        level: 1,
        rank: 0,
        completedMissions: 0,
        avatar: "",
      };

      setUser(userData);
    } catch (error) {
      console.error("Erro ao decodificar token:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header user={user} />
      <main className="px-4 py-6">
        <DashboardTabs />
      </main>
    </div>
  );
}
