// context/AuthContext.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";

interface AuthPayload {
  id: number;
  login: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: AuthPayload | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserFromToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: AuthPayload = JSON.parse(atob(token.split(".")[1]));
        setUser(decoded);
      } catch (e) {
        console.error("Token inválido", e);
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(
    async (identifier: string, password: string) => {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      if (!res.ok) {
        throw new Error("Login falhou");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);

      const decoded: AuthPayload = JSON.parse(atob(data.token.split(".")[1]));
      setUser(decoded);
      router.push("/");
    },
    [router]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  }, [router]);

  const updateUserFromToken = (token: string) => {
    try {
      const decoded: AuthPayload = JSON.parse(atob(token.split(".")[1]));
      localStorage.setItem("token", token);
      setUser(decoded);
    } catch (e) {
      console.error("Token inválido", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        updateUserFromToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  }
  return context;
}
