# musicMind

Monorepo com **React (Vite) + TypeScript** no front-end, **Node.js (Express)** com camadas de **segurança** (Helmet, CORS controlado, rate limit, HPP, corpo limitado) e **SQLite** via **Prisma** (consultas seguras, sem SQL concatenado). Adequado para repositório público e para deploy (CI incluída).

> **Nota de nomenclatura:** “React” aqui designa a biblioteca usada com **Vite** para a Web. **React Native** (iOS/Android) seria outro repositivo e *stack* distinta. Este projeto concentra-se no site responsivo (mobile-first no CSS), não em aplicações nativas móveis.

## Arquitetura (resumo)

- **`client/`** — SPA, componentes, hooks de dados, `fetch` tipado, proxy `/api` em desenvolvimento.
- **`server/`** — API REST ` /api/v1/...` , validação (Zod), orm (Prisma), health check com query à base.
- **Dados** — ficheiro SQLite (leve, zero servidor de BD em separado para ambientes pequenos).

## Requisitos

- [Node.js](https://nodejs.org/) 20+ (ver [`.nvmrc`](.nvmrc) para a versão alvo)

## Resolução de `npm install` (EAI_AGAIN / DNS)

1. **Usar o script do repositório:** `npm run install:reliable` (várias passagens com espera, `NODE_OPTIONS` com `--dns-result-order=ipv4first`).

2. **Ficheiro [`.npmrc`](.npmrc):** o npm volta a pedir o mesmo ficheiro ao *registry* várias vezes, com *timeouts* mais largos, útil para falhas intermitentes (não substitui DNS totalmente inacessível).

3. **DNS de sistema:** tente trocar temporariamente o resolver (ex. `1.1.1.1` / `8.8.8.8`) no SO ou, no WSL, verificar o resolv a apontar para o DNS do Windows. Depois: `ping registry.npmjs.org`.

4. **Rede restringida / proxy:** `npm config set proxy` / `https-proxy` e variáveis `HTTP_PROXY` conforme a sua rede corporativa.

5. **Ainda falha?** Aumente tentativas do *wrapper*: `NPM_INSTALL_RETRIES=10 npm run install:reliable`.

## Início local

1. `git clone` e, na raiz, instalar dependências:

   ```bash
   npm install
   ```

   Se ocorrer **`EAI_AGAIN` / `getaddrinfo` em `registry.npmjs.org`** (falha de DNS/rede, comum com rede instável, WSL, VPN, ou IPv6 incompatível com o *registry*), use a instalação com **repetições e prioridade IPv4**:

   ```bash
   npm run install:reliable
   ```

   A raiz do projeto inclui [`.npmrc`](.npmrc) (mais tentativas e *timeouts* por pedido de pacote). Para uma única instalação manual, também pode fazer: `export NODE_OPTIONS="--dns-result-order=ipv4first"` e voltar a correr `npm install`.

2. Criar `server/.env` a partir de [`server/.env.example`](server/.env.example). Com **`NODE_ENV=production`**, é **obrigatório** definir `CORS_ORIGIN` com URLs reais (http/https) — o servidor recusa arrancar com lista vazia, para não expor a API a qualquer origem.

3. Criar a base e carregar o seed (faixas + trilha):

   ```bash
   cp server/.env.example server/.env
   cd server
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   cd ..
   ```

4. **Dois processos (recomendado):**

   ```bash
   npm run dev
   ```

   Abre a UI em [http://localhost:5173](http://localhost:5173) e a API em [http://localhost:4000](http://localhost:4000).

### Rotas de API (exemplos)

- `GET /api/health` — alive simples
- `GET /api/v1/status` — verifica ligação ao SQLite
- `GET /api/v1/tracks?category=theory` — listagem (filtro opcional: `all`, `theory`, `genres`, `instruments`)
- `GET /api/v1/tracks/:id` — detalhe
- `GET /api/v1/learning-path` — passos da jornada

## Construção (produção)

```bash
npm run build
```

Gera `client/dist` e `server/dist` (TypeScript do servidor). Arranque:

```bash
npm run start
```

(executa o script `start` do `server`).

### Servir o build do React pelo mesmo processo (opcional)

1. Garantir `npm run build` na raiz.  
2. No `server/.env`: `SERVE_CLIENT=1` e `CLIENT_DIST_PATH=../client/dist` (caminho relativo ao *cwd* de arranque, normalmente a raiz de `server/` se executar a partir dali, ou ajuste para absoluto em produção).

3. Ajuste `CORS_ORIGIN` para a origem pública do site se o back-end estiver noutro domínio. Em *same-origin* (ficheiros estáticos e API no mesmo *host*), a política fica simples.

### Variáveis de ambiente (cliente em produção)

- `VITE_API_BASE_URL` — URL pública do backend, ex.: `https://api.seusite.com`. Em dev, o proxy do Vite aponta `/api` → `http://127.0.0.1:4000` (ver `client/vite.config.ts`).

## Docker (produção)

Ficheiro [`Dockerfile`](Dockerfile) (API + ficheiro estáticos do React no mesmo processo, SQLite semeado no *build* de imagem):

```bash
docker build -t musicmind .
docker run --rm -p 4000:4000 \
  -e CORS_ORIGIN="http://localhost:4000" \
  musicmind
```

Ajuste `CORS_ORIGIN` à origem pública (incl. `https://`). Veja comentários no ficheiro para volumes e `DATABASE_URL`.

## Segurança

- [Segurança: visão e reporte de vulnerabilidades](SECURITY.md)
- *Dependabot* (`.github/dependabot.yml`) propõe atualizações de dependências.

## Camada de segurança (descrição curta)

| Tópico        | O que o projeto faz |
|---------------|------------------------|
| **Transporte** | Use **HTTPS** em produção (termina TLS no *reverse proxy* ou *platform*). |
| **Cabeçalhos** | **Helmet** afinado (CSP desativada na API pura; reavalie se servir HTML). |
| **CORS**     | **Origem explícita** via `CORS_ORIGIN` (lista com vírgulas se necessário). |
| **Flood/abuso** | **Rate limiting** (Express, por IP) — complementar com limites no *edge* (Nginx, Cloudflare, etc.). |
| **Poluição de parâmetros** | **HPP** mitiga *parameter pollution* em pares de query/body. |
| **Tamanho do corpo** | `express.json` e `urlencoded` com **limite baixo** (20kb), adequado a APIs JSON pequenas. |
| **SQL**      | **Prisma** (consultas parametrizadas) evita *SQL injection* de SQL manual. |
| **Validação** | **Zod** em *query* e *params* antes de aceder a serviços. |
| **Erros**     | *Handler* de erros centralizado; *stack* não exposta no cliente em produção. |
| **Links externos** | No client, `rel="noreferrer noopener"` onde aplicável. |

> Autenticação, OAuth e CSRF *cookie-based* não estão no âmbito desta demo. Para APIs autenticadas, acrescente JWT ou sessões, cookies `Secure`/`HttpOnly`/`SameSite` e, se necessário, proteção CSRF adequada ao teu *stack* de sessão.

## Estrutura de pastas

```text
.
├── client/                 # React + Vite + TypeScript
│   ├── src/
│   │   ├── api/            # Cliente HTTP
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── styles/
│   │   └── main.tsx
│   └── vite.config.ts
├── server/                 # Express + Prisma
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── src/
│       ├── config/         # env + validação
│       ├── db/             # cliente Prisma
│       ├── middleware/
│       ├── routes/
│       ├── services/
│       └── validators/
├── .github/workflows/      # CI
├── LICENSE
└── package.json            # *workspaces* npm
```

## CI

O *workflow* [`.github/workflows/ci.yml`](.github/workflows/ci.yml) instala, cria SQLite de teste, aplica o esquema, corre o seed (Prisma) e gera o build. Ajusta ramos alvo conforme a tua *branch* principal.

## Manutenção

- Lógica de negócio concentrada em `server/src/services/`.
- Rotas finas em `server/src/routes/`.
- Tipos e contratos partilhados: no *front*, `client/src/types/api.ts` — alinha com a resposta JSON.
- Pós-alteração ao *schema* Prisma: `npx prisma db push` ou migrações formais (quando tiveres ambientes múltiplos, prefere `prisma migrate`).

## Licença

MIT. Ver [LICENSE](LICENSE).
