"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface AuthPayload {
  id: number;
  login: string;
  email: string;
}

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<AuthPayload | null>(null);
  const [loading, setLoading] = useState(true);

  // Verifica o token no carregamento da página
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decoded: AuthPayload = JSON.parse(atob(token.split(".")[1])); // decodifica o payload do JWT
      setUser(decoded);
    } catch (e) {
      console.error("Token inválido", e);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    async (identifier: string, password: string) => {
      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ identifier, password }),
        });

        if (!res.ok) {
          throw new Error("Login falhou");
        }

        const data = await res.json();
        localStorage.setItem("token", data.token);

        const decoded: AuthPayload = JSON.parse(atob(data.token.split(".")[1]));
        setUser(decoded);

        router.push("/"); // ou dashboard, etc.
      } catch (err) {
        console.error("Erro no login:", err);
        throw err;
      }
    },
    [router]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  }, [router]);

  return {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
  };
}
