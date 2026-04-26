import { prisma } from "../db/client.js";

export function listLearningPath() {
  return prisma.learningPathStep.findMany({ orderBy: { order: "asc" } });
}
