/// <reference types="vite/client" />

/** URL base pública da API (produção). Vazio = mesmo host / proxy em dev. */
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
