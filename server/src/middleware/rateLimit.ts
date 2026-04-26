/**
 * Limite de frequência de pedidos por IP (camada básica anti abuso / DoS a nível de aplicação).
 * Em produção, reforce também no proxy (Nginx, Cloudflare, etc.).
 */
import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

export const globalRateLimit = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "Muitas requisições, tente novamente mais tarde" },
  /** Com `TRUST_PROXY=0`, desativa o aviso de X-Forwarded-For; com proxy, validação completa. */
  validate: env.TRUST_PROXY ? true : { xForwardedForHeader: false },
});
