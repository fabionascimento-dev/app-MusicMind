import { prisma } from "../db/client.js";
import type { ListTracksQuery } from "../validators/tracksQuery.js";

export async function listTracks(q: ListTracksQuery) {
  if (q.category && q.category !== "all") {
    return prisma.track.findMany({
      where: { category: q.category },
      orderBy: { createdAt: "asc" },
    });
  }
  return prisma.track.findMany({ orderBy: { createdAt: "asc" } });
}

export async function getTrackById(id: string) {
  return prisma.track.findUnique({ where: { id } });
}
