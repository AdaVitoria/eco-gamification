"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();

  const [tab, setTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);

  const [loginForm, setLoginForm] = useState({ identifier: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    login: "",
    cpf: "",
    email: "",
    password: "",
    confirmPassword: "", // novo campo
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>,
    form: "login" | "register"
  ) {
    const { name, value } = e.target;
    if (form === "login") setLoginForm({ ...loginForm, [name]: value });
    else setRegisterForm({ ...registerForm, [name]: value });
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginForm),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      router.push("/");
    } else alert(data.error);
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    if (registerForm.password !== registerForm.confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    const { confirmPassword, ...body } = registerForm;

    const res = await fetch("/api/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (res.ok) router.push("/login");
    else alert(data.error);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f5f8ff] p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-1 text-center">
          Bem-vindo de volta!
        </h1>
        <p className="text-gray-500 text-center mb-6 text-sm">
          Entre na sua conta ou crie uma nova para começar sua jornada
        </p>

        <Tabs defaultValue="login" value={tab} onValueChange={setTab}>
          <TabsList className="grid grid-cols-2 mb-6 rounded-lg bg-gray-100 p-1">
            <TabsTrigger
              value="login"
              className={tab === "login" ? "bg-white shadow" : ""}
            >
              Entrar
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className={tab === "register" ? "bg-white shadow" : ""}
            >
              Registrar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <div className="flex items-center border rounded-lg p-2 mt-1">
                  <Mail className="w-4 h-4 text-gray-400 mr-2" />
                  <input
                    type="text"
                    name="identifier"
                    value={loginForm.identifier}
                    onChange={(e) => handleChange(e, "login")}
                    placeholder="seu@email.com"
                    className="w-full outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Senha</label>
                <div className="flex items-center border rounded-lg p-2 mt-1">
                  <Lock className="w-4 h-4 text-gray-400 mr-2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={loginForm.password}
                    onChange={(e) => handleChange(e, "login")}
                    placeholder="Sua senha"
                    className="w-full outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <a href="#" className="text-blue-600 text-sm">
                  Esqueceu a senha?
                </a>
              </div>

              <button className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
                Entrar
              </button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Nome completo */}
              <div>
                <label className="text-sm text-gray-600">Nome completo</label>
                <div className="flex items-center border rounded-lg p-2 mt-1">
                  <User className="w-4 h-4 text-gray-400 mr-2" />
                  <input
                    type="text"
                    name="name"
                    value={registerForm.name}
                    onChange={(e) => handleChange(e, "register")}
                    placeholder="Seu nome"
                    className="w-full outline-none"
                    required
                  />
                </div>
              </div>

              {/* Login */}
              <div>
                <label className="text-sm text-gray-600">Login</label>
                <div className="flex items-center border rounded-lg p-2 mt-1">
                  <User className="w-4 h-4 text-gray-400 mr-2" />
                  <input
                    type="text"
                    name="login"
                    value={registerForm.login}
                    onChange={(e) => handleChange(e, "register")}
                    placeholder="ex: ada123"
                    className="w-full outline-none"
                    required
                  />
                </div>
              </div>

              {/* CPF */}
              <div>
                <label className="text-sm text-gray-600">CPF</label>
                <div className="flex items-center border rounded-lg p-2 mt-1">
                  <User className="w-4 h-4 text-gray-400 mr-2" />
                  <input
                    type="text"
                    name="cpf"
                    value={registerForm.cpf}
                    onChange={(e) => handleChange(e, "register")}
                    placeholder="000.000.000-00"
                    className="w-full outline-none"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <div className="flex items-center border rounded-lg p-2 mt-1">
                  <Mail className="w-4 h-4 text-gray-400 mr-2" />
                  <input
                    type="email"
                    name="email"
                    value={registerForm.email}
                    onChange={(e) => handleChange(e, "register")}
                    placeholder="seu@email.com"
                    className="w-full outline-none"
                    required
                  />
                </div>
              </div>

              {/* Senha */}
              <div>
                <label className="text-sm text-gray-600">Senha</label>
                <div className="flex items-center border rounded-lg p-2 mt-1">
                  <Lock className="w-4 h-4 text-gray-400 mr-2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={registerForm.password}
                    onChange={(e) => handleChange(e, "register")}
                    placeholder="Crie uma senha"
                    className="w-full outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirmar senha */}
              <div>
                <label className="text-sm text-gray-600">Confirmar senha</label>
                <div className="flex items-center border rounded-lg p-2 mt-1">
                  <Lock className="w-4 h-4 text-gray-400 mr-2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={registerForm.confirmPassword}
                    onChange={(e) => handleChange(e, "register")}
                    placeholder="Repita a senha"
                    className="w-full outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
              >
                Criar conta
              </button>
            </form>
          </TabsContent>
        </Tabs>

        <p className="text-center text-sm text-gray-500 mt-6">
          Ao continuar, você concorda com nossos{" "}
          <a href="#" className="text-blue-600 underline">
            Termos de Uso
          </a>{" "}
          e{" "}
          <a href="#" className="text-blue-600 underline">
            Política de Privacidade
          </a>
        </p>
      </div>
    </main>
  );
}
