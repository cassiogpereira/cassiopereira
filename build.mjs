#!/usr/bin/env node
/**
 * Build do site estático (cassiopereira.com.br).
 *
 * Lê site/.env (ver .env.example), injeta TELEFONE_PRINCIPAL nos
 * placeholders __TELEFONE_PRINCIPAL__ do index.html e gera site/dist/.
 *
 * Uso: node site/build.mjs   (depois subir o conteúdo de site/dist/)
 */

import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));

function loadEnv(path) {
  if (!existsSync(path)) return {};
  const env = {};
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

const env = loadEnv(join(root, '.env'));
const telefone = env.TELEFONE_PRINCIPAL;

if (!telefone) {
  console.error('[ERRO] TELEFONE_PRINCIPAL não definido. Copie site/.env.example para site/.env e preencha.');
  process.exit(1);
}

if (!/^\d{12,13}$/.test(telefone)) {
  console.error(`[ERRO] TELEFONE_PRINCIPAL inválido: "${telefone}" (esperado só dígitos com DDI+DDD, ex.: 5533933006316).`);
  process.exit(1);
}

const html = readFileSync(join(root, 'index.html'), 'utf8');
const outDir = join(root, 'dist');

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'index.html'), html.replaceAll('__TELEFONE_PRINCIPAL__', telefone));
copyFileSync(join(root, 'style.css'), join(outDir, 'style.css'));

console.log(`[OK] site/dist gerado com TELEFONE_PRINCIPAL=${telefone}`);
