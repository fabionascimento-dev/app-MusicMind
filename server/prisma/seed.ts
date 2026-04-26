/**
 * Carga de dados iniciais para desenvolvimento e demonstração.
 * Executa com: npm run db:seed -w server
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const tracks = [
  {
    title: "Introdução à Harmonia",
    description: "Conceitos básicos de acordes e progressões",
    category: "theory",
    difficulty: "beginner",
    imageUrl: "https://picsum.photos/seed/notes/600/400",
  },
  {
    title: "História do Jazz",
    description: "Das origens ao jazz moderno",
    category: "genres",
    difficulty: "intermediate",
    imageUrl: "https://picsum.photos/seed/jazz/600/400",
  },
  {
    title: "Técnicas de Guitarra",
    description: "Exercícios para melhorar sua habilidade",
    category: "instruments",
    difficulty: "advanced",
    imageUrl: "https://picsum.photos/seed/guitar/600/400",
  },
  {
    title: "Leitura de Partituras",
    description: "Aprenda a ler música",
    category: "theory",
    difficulty: "beginner",
    imageUrl: "https://picsum.photos/seed/sheet/600/400",
  },
];

const pathSteps = [
  { order: 1, title: "Fundamentos", description: "Notas, escalas e ritmos básicos" },
  { order: 2, title: "Harmonia", description: "Acordes, progressões e cadências" },
  { order: 3, title: "Estrutura Musical", description: "Formas e arranjos musicais" },
  { order: 4, title: "Estilos Musicais", description: "Características de diferentes gêneros" },
];

async function main() {
  await prisma.track.deleteMany();
  await prisma.learningPathStep.deleteMany();
  for (const t of tracks) {
    await prisma.track.create({ data: t });
  }
  for (const s of pathSteps) {
    await prisma.learningPathStep.create({ data: s });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
