# Política de segurança

## Versões

Utilize [Node.js 20 LTS](https://nodejs.org/) (ver `.nvmrc`) e as dependências bloqueadas em `package-lock.json`.

## Reporte de vulnerabilidades

Se detetar uma **vulnerabilidade de segurança** (ex.: fuga de dados, injeção, lógica de *auth* que vise este código), abra um **issue** privado ou contacte os mantenedores; não publique pormenores exploráveis até corrigir.

## Boas práticas em produção

- `NODE_ENV=production` e `CORS_ORIGIN` com origens reais (não use wildcard implícito).
- HTTPS (terminação no proxy, *load balancer* ou *platform*).
- `TRUST_PROXY=1` **apenas** com proxy de confiança; sem proxy, deixe `0`.
- Base de dados: em SQLite, ficheiro com permissões mínimas e *backup* regular; em escala, avalie *managed* SQL.
- *Secrets* apenas em variáveis de ambiente; nunca em repositório.

O projeto aplica: Helmet, CORS explícito, *rate limit*, corpo de pedido limitado, HPP, Prisma (parametrização), Zod (entrada de API), *handler* de erros unificado.
