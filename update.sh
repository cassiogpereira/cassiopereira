#!/bin/bash
set -e

# ============================================================
# Deploy do site cassiopereira.com.br — rodar NO DROPLET
# Uso: bash update.sh
#
# O droplet não precisa de Node: o build (node build.mjs) roda no PC,
# o public/ é commitado, e este script apenas puxa e copia para o
# diretório servido pelo nginx/docker.
# ============================================================

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
SITE_DIR="/opt/saas/projetos/cassiopereira/site"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo -e "${GREEN}=== Atualizando cassiopereira.com.br ===${NC}"

cd "$REPO_DIR"

# Garante remote
if ! git remote get-url origin > /dev/null 2>&1; then
  git remote add origin https://github.com/cassiogpereira/cassiopereira.git
fi

git pull origin main

if [ ! -f "$REPO_DIR/public/index.html" ]; then
  echo -e "${RED}[ERRO] public/index.html não encontrado no repo.${NC}"
  echo "No PC: edite os fontes, rode 'node build.mjs', commit e push."
  exit 1
fi

mkdir -p "$SITE_DIR"
cp "$REPO_DIR/public/index.html" "$SITE_DIR/index.html"
cp "$REPO_DIR/public/style.css" "$SITE_DIR/style.css"

# Verificação básica
if grep -q "5533933006316" "$SITE_DIR/index.html"; then
  echo -e "${GREEN}[OK] Telefone correto (5533933006316) presente no index.html publicado.${NC}"
else
  echo -e "${YELLOW}[AVISO] Telefone 5533933006316 não encontrado — confira o .env no PC e rebuild.${NC}"
fi

echo -e "${GREEN}[OK] Site atualizado em $SITE_DIR${NC}"
echo ""
