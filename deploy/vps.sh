#!/usr/bin/env bash
# Radar IA — deploy rápido na VPS (Ubuntu/Debian)
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/radar-ia}"
REPO="https://github.com/amos-fernandes/radar-ia.git"
DOMAIN="${DOMAIN:-}"          # ex: radaria.com.br
API_PUBLIC="${API_PUBLIC:-}"  # ex: https://api.radaria.com.br  (ou http://IP:3002)

echo "==> Radar IA deploy"
echo "    APP_DIR=$APP_DIR"

if ! command -v docker >/dev/null 2>&1; then
  echo "==> Instalando Docker..."
  curl -fsSL https://get.docker.com | sh
  systemctl enable --now docker
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "==> Docker Compose plugin ok?"
  docker compose version || true
fi

mkdir -p "$APP_DIR"
if [ -d "$APP_DIR/.git" ]; then
  echo "==> git pull"
  git -C "$APP_DIR" pull --ff-only
else
  echo "==> git clone"
  git clone "$REPO" "$APP_DIR"
fi

cd "$APP_DIR"

if [ ! -f .env ]; then
  cp .env.example .env
  # defaults de produção
  sed -i 's|INGEST_SECRET=change-me-in-production|INGEST_SECRET='