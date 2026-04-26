import type { HelmetOptions } from "helmet";

/**
 * API JSON: sem CSP; CORP adequado a API consumida por outras origens.
 * SPA: CSP restrita; `imgSrc` inclui `https:` (capas externas em produção).
 */
export function getHelmetOptions(serveClient: boolean): HelmetOptions {
  if (serveClient) {
    return {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'"],
          fontSrc: ["'self'", "data:"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
        },
      },
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: "same-site" },
    };
  }
  return {
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  };
}
