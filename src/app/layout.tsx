import type React from "react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EcoGamification",
  description: "Plataforma de gamificação sustentável",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-white text-gray-900 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
