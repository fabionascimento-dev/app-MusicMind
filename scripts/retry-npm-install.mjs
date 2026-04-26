#!/usr/bin/env node
/**
 * Executa `npm install` com:
 * 1) NODE_OPTIONS com --dns-result-order=ipv4first (atenua EAI_AGAIN em redes IPv6/IPv4 mistas)
 * 2) várias tentativas com espera crescente (falhas transitórias de DNS/rede)
 *
 * Uso: node scripts/retry-npm-install.mjs
 *      npm run install:reliable
 */
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const maxAttempts = Number.parseInt(process.env.NPM_INSTALL_RETRIES ?? "6", 10);
const baseMs = Number.parseInt(process.env.NPM_INSTALL_RETRY_BASE_MS ?? "5000", 10);

const extraArgs = process.argv.slice(2);

if (!/dns-result-order/.test(process.env.NODE_OPTIONS ?? "")) {
  const prefix = (process.env.NODE_OPTIONS ?? "").trim();
  const dnsOpt = "--dns-result-order=ipv4first";
  process.env.NODE_OPTIONS = prefix ? `${prefix} ${dnsOpt}` : dnsOpt;
}

function runNpm() {
  return new Promise((resolve) => {
    const child = spawn("npm", ["install", ...extraArgs], {
      stdio: "inherit",
      shell: false,
      env: { ...process.env },
    });
    child.on("close", (code) => {
      resolve(code ?? 1);
    });
  });
}

for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
  if (attempt > 1) {
    const wait = baseMs * (attempt - 1);
    console.error(
      `[install:reliable] Tentativa ${attempt - 1} falhou. A aguardar ${wait / 1000}s (DNS/rede temporário ou EAI_AGAIN)…`,
    );
    await sleep(wait);
  }
  // eslint-disable-next-line no-console
  console.log(`[install:reliable] npm install (tentativa ${attempt}/${maxAttempts})…`);
  const code = await runNpm();
  if (code === 0) {
    process.exit(0);
  }
  if (attempt === maxAttempts) {
    console.error(
      `[install:reliable] Falhou após ${maxAttempts} tentativas. Código: ${code}. Não consegue resolver o registry: ver secção "npm install" no README (DNS, proxy, WSL, rede).`,
    );
    process.exit(code);
  }
}
