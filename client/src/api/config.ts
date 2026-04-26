/**
 * Resolve o prefixo da API: em build estático, use VITE_API_BASE_URL
 * (mesmo site ou outro subdomínio) para evitar pedidos ao host errado.
 */
export function getApiBaseUrl(): string {
  return (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
}

/**
 * `GET` com JSON, timeout simples e tratamento de resposta padrão da API.
 */
export async function fetchJson<T>(input: string, init: RequestInit = {}): Promise<T> {
  const base = getApiBaseUrl();
  const url = input.startsWith("http") ? input : `${base}${input.startsWith("/") ? "" : "/"}${input}`;

  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), 12_000);

  const h = new Headers();
  h.set("Accept", "application/json");
  if (init.headers) {
    new Headers(init.headers).forEach((v, k) => {
      h.set(k, v);
    });
  }
  const method = (init.method ?? "GET").toUpperCase();
  if (method !== "GET" && method !== "HEAD" && !h.has("Content-Type")) {
    h.set("Content-Type", "application/json");
  }

  try {
    const res = await fetch(url, {
      ...init,
      signal: ac.signal,
      headers: h,
    });
    if (!res.ok) {
      const errBody = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(errBody.error ?? res.statusText);
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(t);
  }
}
