# 🌱 EcoGamification

Plataforma gamificada com foco em **sustentabilidade** e **educação ambiental**.  
Este projeto integra **interface de usuário** e **API backend** utilizando **Next.js (App Router)** e **Prisma ORM**.

> Projeto desenvolvido como parte do trabalho prático da disciplina **Engenharia de Software**.

---

## 🚧 Status do Projeto

- [x] Página inicial
- [x] Tela de login
- [x] Tela de cadastro
- [x] API de login (`/api/user/login`)
- [x] API de registro (`/api/user/register`)
- [ ] Sistema de desafios
- [ ] Gamificação com pontos e recompensas
- [ ] Dashboard e perfil de usuário

---

## 🧱 Estrutura de Pastas

```
eco-game/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── loogin/page.tsx         # Tela de cadastro e login
│   │   ├── api/
│   │   │   └── user/
│   │   │       ├── login/route.ts      # Rota de login (API)
│   │   │       └── register/route.ts   # Rota de registro (API)
│   │   ├── page.tsx                    # Página inicial
│   │   ├── layout.tsx                  # Layout base
│   │   └── globals.css                 # Estilos globais
│   ├── components/ui/tabs.tsx          # Componente de abas personalizadas
│   └── lib/
│       ├── prisma.ts                   # Configuração do Prisma
│       └── utils.tsx                   # Funções auxiliares
└── README.md
```

---

## ⚙️ Tecnologias Utilizadas

- [Next.js 14 (App Router)](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Prisma ORM](https://www.prisma.io)
- [Lucide Icons](https://lucide.dev)
- [TypeScript](https://www.typescriptlang.org)

---

## 🚀 Como rodar o projeto localmente

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd eco-game
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o arquivo `.env`

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="sua_chave_secreta_segura"
```

> ⚠️ Substitua `"sua_chave_secreta_segura"` por um valor forte e único.

### 4. Rode as migrações iniciais (exige Prisma CLI)

```bash
npx prisma migrate dev --name init
```

### 5. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Abra seu navegador e acesse: [http://localhost:3000](http://localhost:3000)

---

## 🛠 Prisma Studio (opcional)

Para visualizar e manipular os dados do banco localmente:

```bash
npx prisma studio
```

---

## ☁️ Deploy

Este projeto pode ser facilmente publicado na [Vercel](https://vercel.com/) para frontend e backend (via API Routes do Next.js).

---

## 🤝 Contribuindo

Contribuições são bem-vindas!  
Sinta-se à vontade para abrir uma _issue_ ou enviar um _pull request_.

---

## 🧑‍💻 Autoria

Feito com 💚 por **Ada Vitória**
