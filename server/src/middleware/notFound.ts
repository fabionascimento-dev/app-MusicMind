/**
 * 404 em formato JSON coerente com a API.
 */
import type { RequestHandler } from "express";

export const notFound: RequestHandler = (req, res) => {
  return res.status(404).json({ ok: false, error: "Recurso não encontrado", path: req.path });
};
