/**
 * Rotas REST v1: faixas (conteúdo de recomendações)
 */
import { Router } from "express";
import { z } from "zod";
import { listTracksQuerySchema } from "../../../validators/tracksQuery.js";
import { getTrackById, listTracks } from "../../../services/trackService.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const raw = req.query.category;
    const single = Array.isArray(raw) ? raw[0] : raw;
    const query = listTracksQuerySchema.parse({ category: single });
    const data = await listTracks(query);
    return res.json({ ok: true, data });
  } catch (e) {
    return next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = z.object({ id: z.string().min(1).max(128) }).parse(req.params);
    const row = await getTrackById(id);
    if (!row) return res.status(404).json({ ok: false, error: "Faixa não encontrada" });
    return res.json({ ok: true, data: row });
  } catch (e) {
    return next(e);
  }
});

export { router as tracksRouter };
