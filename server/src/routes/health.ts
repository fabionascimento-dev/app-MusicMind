import { Router } from "express";
import { prisma } from "../db/client.js";

const router = Router();

/** Verificação simples: processo e base de dados acessível */
router.get("/", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.json({ ok: true, status: "ok", time: new Date().toISOString() });
  } catch {
    return res.status(503).json({ ok: false, status: "degraded" });
  }
});

export { router as healthRouter };
