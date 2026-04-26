import { z } from "zod";

/** Valida o filtro opcional `category` na listagem de faixas. */
export const listTracksQuerySchema = z.object({
  /** Query string única: `?category=theory` (evita ambiguidade de arrays em `req.query`) */
  category: z.enum(["theory", "genres", "instruments", "all"]).optional().default("all"),
});

export type ListTracksQuery = z.infer<typeof listTracksQuerySchema>;
