/**
 * Ponto de entrada do processo: base de dados e arranque do HTTP server.
 */
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./db/client.js";

async function start() {
  try {
    await prisma.$connect();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Falha ao conectar Prisma/SQLite:", e);
    process.exit(1);
  }

  const app = createApp();
  const port = env.PORT;
  const server = app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(
      `musicMind API a ouvir em http://localhost:${port}  (${env.API_PREFIX}/${env.API_VERSION}/…)`,
    );
  });

  const shutdown = () => {
    server.close(() => {
      void prisma.$disconnect();
      process.exit(0);
    });
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

void start();
