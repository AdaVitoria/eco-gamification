"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProfileTab() {
  const [userId, setUserId] = useState<number | null>(null);
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.id);
      setLogin(payload.login || "");
      setEmail(payload.email || "");
    } catch (err) {
      console.error("Erro ao decodificar token", err);
    }
  }, []);

  const handleSubmit = async () => {
    setError(null);
    setMessage(null);

    if (password && password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/user/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login,
          email,
          ...(password ? { password } : {}),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao atualizar perfil.");
      } else {
        setMessage("Perfil atualizado com sucesso!");
        // Atualiza o token se login/email mudarem? (opcional)
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-4 space-y-4 bg-white shadow-md rounded-xl p-6">
      <h2 className="text-xl font-semibold text-center">Editar Perfil</h2>

      <div className="space-y-2">
        <Label htmlFor="login">Login</Label>
        <Input
          id="login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Nova Senha</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm">Confirmar Nova Senha</Label>
        <Input
          id="confirm"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {password && confirmPassword && password !== confirmPassword && (
          <p className="text-sm text-red-500">Senhas não coincidem</p>
        )}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        {isSubmitting ? "Salvando..." : "Salvar Alterações"}
      </Button>

      {message && <p className="text-sm text-green-600">{message}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
