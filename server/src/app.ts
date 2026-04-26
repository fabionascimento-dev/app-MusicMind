/**
 * Aplicação Express com camadas: segurança, parsing limitado, rotas versionadas, SPA opcional.
 */
import path from "node:path";
import compression from "compression";
import cors from "cors";
import express from "express";
import type { RequestHandler } from "express";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import { env } from "./config/env.js";
import { getHelmetOptions } from "./config/helmetOptions.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { globalRateLimit } from "./middleware/rateLimit.js";
import { notFound } from "./middleware/notFound.js";
import { healthRouter } from "./routes/health.js";
import { tracksRouter } from "./routes/api/v1/tracks.js";
import { learningPathRouter } from "./routes/api/v1/learningPath.js";

export function createApp() {
  const app = express();
  if (env.TRUST_PROXY) {
    app.set("trust proxy", 1);
  }
  app.disable("x-powered-by");

  const serve = Boolean(env.SERVE_CLIENT && env.CLIENT_DIST_PATH);
  app.use(helmet(getHelmetOptions(serve)));

  app.use(
    cors({
      optionsSuccessStatus: 204,
      credentials: false,
      /** Lista explícita; se vazia (pouco provável), evita CORS indevido em testes. */
      origin: env.corsOrigins.length > 0 ? env.corsOrigins : true,
    }) as RequestHandler,
  );

  app.use(compression() as RequestHandler);
  if (env.NODE_ENV !== "test") {
    app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev") as RequestHandler);
  }
  app.use(express.json({ limit: "20kb" }));
  app.use(express.urlencoded({ extended: false, limit: "20kb" }));
  app.use(hpp() as RequestHandler);

  const api = `${env.API_PREFIX}/${env.API_VERSION}`;
  app.get(`${env.API_PREFIX}/health`, (_req, res) => {
    return res.json({ ok: true, time: new Date().toISOString() });
  });
  app.use(`${api}/status`, healthRouter);
  app.use(`${api}/tracks`, globalRateLimit, tracksRouter);
  app.use(`${api}/learning-path`, globalRateLimit, learningPathRouter);

  if (serve) {
    const staticPath = path.isAbsolute(env.CLIENT_DIST_PATH as string)
      ? (env.CLIENT_DIST_PATH as string)
      : path.resolve(process.cwd(), env.CLIENT_DIST_PATH as string);
    const indexHtml = path.join(staticPath, "index.html");
    app.use(
      express.static(staticPath, {
        maxAge: env.NODE_ENV === "production" ? "1y" : 0,
        etag: true,
        index: false,
        setHeaders: (r, filePath) => {
          if (filePath.endsWith("index.html")) {
            r.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            r.setHeader("Pragma", "no-cache");
            return;
          }
          if (env.NODE_ENV === "production" && filePath.includes(`${path.sep}assets${path.sep}`)) {
            r.setHeader("Cache-Control", "public, max-age=31536000, immutable");
          }
        },
      } as const),
    );
    app.get("*", (req, res, next) => {
      if (req.path.startsWith(env.API_PREFIX)) {
        return res.status(404).json({ ok: false, error: "Não encontrado" });
      }
      if (req.method !== "GET" && req.method !== "HEAD") {
        return next();
      }
      return res.sendFile(indexHtml, (err) => {
        if (err) {
          next(err);
        }
      });
    });
  } else {
    app.use(notFound);
  }
  app.use(errorHandler);
  return app;
}
