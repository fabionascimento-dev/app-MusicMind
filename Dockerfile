# Imagem de produção (API + front estáticos no mesmo processo, após build).
# CORS: o browser usa a origem pública; para testar local: -e CORS_ORIGIN="http://localhost:4000"
#
# docker build -t musicmind .
# docker run --rm -p 4000:4000 -e CORS_ORIGIN="http://localhost:4000,http://127.0.0.1:4000" musicmind

FROM node:20-alpine AS build
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app
COPY package.json package-lock.json* ./
COPY client/package.json client/
COPY server/package.json server/
RUN npm run install:reliable
COPY . .
# Base SQLite (image); persistência: monte volume em /data e use DATABASE_URL=file:/data/app.db
ENV DATABASE_URL="file:./prisma/prod.db"
ENV NODE_ENV=development
RUN cd server && npx prisma generate && npx prisma db push && npx prisma db seed
RUN npm run build

# --- Runtiime ---
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000
ENV TRUST_PROXY=0
ENV SERVE_CLIENT=1
ENV CLIENT_DIST_PATH=/app/client/dist
ENV DATABASE_URL="file:./prisma/prod.db"
# Origens permitidas: ajuste ao domínio real em produção
ENV CORS_ORIGIN="http://localhost:4000,http://127.0.0.1:4000"

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
COPY --from=build /app/client/dist ./client/dist
COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/server/prisma ./server/prisma
RUN chown -R 1000:1000 /app
USER 1000:1000
WORKDIR /app/server
EXPOSE 4000
# SQLite em /data se montar volume e definir env em runtime
CMD ["node", "dist/index.js"]
