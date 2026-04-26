/**
 * Carrega e valida variáveis de ambiente com Zod.
 * Em **produção**, `CORS_ORIGIN` tem de ser definida explicitamente (mín. um URL) — nunca fica "aberta" por omissão.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import { z } from "zod";

const here = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(here, "../../.env") });

const boolish = (v: string | undefined) => v === "1" || v === "true" || v === "yes";

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().int().positive().default(4000),
    DATABASE_URL: z.string().min(1, "DATABASE_URL é obrigatório (ex.: file:./dev.db)"),
    CORS_ORIGIN: z.preprocess(
      (val) => {
        const s = val === undefined || val === null ? "" : String(val).trim();
        if (s.length > 0) return s;
        const p = process.env.NODE_ENV;
        if (p === "production") return "";
        return "http://localhost:5173,http://127.0.0.1:5173";
      },
      z.string(),
    ),
    TRUST_PROXY: z
      .string()
      .optional()
      .transform((v) => boolish(v)),
    RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(15 * 60 * 1000),
    RATE_LIMIT_MAX: z.coerce.number().int().positive().default(200),
    API_PREFIX: z.string().default("/api"),
    API_VERSION: z.string().default("v1"),
    SERVE_CLIENT: z
      .string()
      .optional()
      .transform((v) => boolish(v)),
    CLIENT_DIST_PATH: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.NODE_ENV !== "production") return;
    const list = data.CORS_ORIGIN.split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (list.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["CORS_ORIGIN"],
        message:
          "Em produção, defina CORS_ORIGIN com a(s) origem(ns) pública(s) (vírgula se forem várias), ex: https://app.exemplo.com",
      });
    }
    for (const o of list) {
      try {
        const u = new URL(o);
        if (u.protocol !== "https:" && u.protocol !== "http:") {
          throw new Error("protocolo");
        }
      } catch {
        ctx.addIssue({
          code: "custom",
          path: ["CORS_ORIGIN"],
          message: `CORS_ORIGIN: origem inválida (URL absoluto, http/https): ${o}`,
        });
      }
    }
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Variáveis de ambiente inválidas:", parsed.error.flatten().fieldErrors, parsed.error.issues);
  process.exit(1);
}

const origins = parsed.data.CORS_ORIGIN.split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export const env = {
  ...parsed.data,
  corsOrigins: origins,
} as const;

export type AppEnv = typeof env;
