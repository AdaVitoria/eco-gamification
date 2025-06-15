import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando o seed das missões...");

  await prisma.mission.createMany({
    data: [
      {
        name: "Plantar uma árvore",
        description:
          "Plante uma árvore no seu bairro ou jardim e registre a ação.",
        score: 50,
      },
      {
        name: "Reduzir consumo de água",
        description: "Economize 20% do seu consumo de água em uma semana.",
        score: 30,
      },
      {
        name: "Reciclar lixo plástico",
        description: "Separe e entregue 5kg de lixo plástico para reciclagem.",
        score: 40,
      },
      {
        name: "Usar transporte público",
        description:
          "Utilize transporte público pelo menos 3 vezes nesta semana.",
        score: 25,
      },
      {
        name: "Evitar uso de plástico",
        description: "Use sacolas reutilizáveis em pelo menos 5 compras.",
        score: 20,
      },
      {
        name: "Participar de mutirão",
        description: "Participe de um mutirão de limpeza em sua comunidade.",
        score: 60,
      },
      {
        name: "Economizar energia",
        description:
          "Reduza o consumo de energia elétrica desligando aparelhos em standby por uma semana.",
        score: 30,
      },
      {
        name: "Compostar resíduos",
        description: "Comece uma composteira em casa para resíduos orgânicos.",
        score: 40,
      },
      {
        name: "Divulgar ação sustentável",
        description: "Compartilhe uma campanha ambiental nas redes sociais.",
        score: 10,
      },
      {
        name: "Comprar produtos locais",
        description:
          "Faça pelo menos 3 compras de produtos locais para reduzir a pegada de carbono.",
        score: 35,
      },
    ],
    skipDuplicates: true,
  });

  console.log("Missões inseridas com sucesso!");
}

main()
  .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
