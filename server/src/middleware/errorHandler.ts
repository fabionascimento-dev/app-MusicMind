/**
 * Converte erros (incl. Zod) em respostas JSON com código HTTP adequado
 * e sem vazar detalhes de stack em produção.
 */
import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { env } from "../config/env.js";

type ApiError = Error & { status?: number; code?: string };

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (res.headersSent) return;
  if (err instanceof ZodError) {
    return res.status(400).json({
      ok: false,
      error: "Dados de entrada inválidos",
      details: env.NODE_ENV === "development" ? err.flatten() : undefined,
    });
  }
  const status = (err as ApiError).status ?? 500;
  const message =
    status >= 500 && env.NODE_ENV === "production" ? "Erro interno do servidor" : err.message;
  return res.status(status).json({ ok: false, error: message, code: (err as ApiError).code });
};
