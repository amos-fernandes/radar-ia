#!/usr/bin/env bash
# Radar IA — deploy na VPS (Ubuntu/Debian)
# Uso:
#   DOMAIN=radaria.com.br API_PUBLIC=https://api.radaria.com.br bash deploy/vps.sh
#   # ou só IP:
#   API_PUBLIC=http://SEU_IP:3002 bash deploy/vps.sh
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/radar-ia}"
REPO="https://github.com/amos-fernandes/radar-ia.git"
DOMAIN="${DOMAIN:-}"
API_PUBLIC="${API_PUBLIC:-}"

echo "==> Radar IA deploy → $APP_DIR"

if ! command -v docker >/dev/null 2>&1; then
  echo "==> Instalando Docker..."
  curl -fsSL https://get.docker.com | sh
  systemctl enable --now docker || true
fi

mkdir -p "$APP_DIR"
if [ -d "$APP_DIR/.git" ]; then
  git -C "$APP_DIR" pull --ff-only
else
  git clone "$REPO" "$APP_DIR"
fi
cd "$APP_DIR"

if [ ! -f .env ]; then
  cp .env.example .env
  SECRET=$(openssl rand -hex 16 2>/dev/null || echo "radar-$(date +%s)")
  sed -i "s|INGEST_SECRET=change-me-in-production|INGEST_SECRET=$SECRET|" .env
fi

sed -i 's/5562999999999/5562981647087/g' .env || true
grep -q 'WHATSAPP_LEAD_NUMBER=' .env || echo 'WHATSAPP_LEAD_NUMBER=5562981647087' >> .env
grep -q 'NEXT_PUBLIC_WA_LINK=' .env || echo 'NEXT_PUBLIC_WA_LINK=https://wa.me/5562981647087?text=Oi!%20Quero%20o%20Radar%20IA' >> .env

if [ -n "$API_PUBLIC" ]; then
  if grep -q '^NEXT_PUBLIC_API_URL=' .env; then
    sed -i "s|^NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=$API_PUBLIC|" .env
  else
    echo "NEXT_PUBLIC_API_URL=$API_PUBLIC" >> .env
  fi
fi

echo "==> docker compose up"
docker compose up -d --build

echo "==> Aguardando API..."
for i in $(seq 1 30); do
  if curl -sf http://127.0.0.1:3002/health >/dev/null; then
    echo "    API ok"
    break
  fi
  sleep 2
done

echo "==> Primeira ingestão"
SECRET=$(grep '^INGEST_SECRET=' .env | cut -d= -f2-)
curl -sf -X POST http://127.0.0.1:3002/internal/ingest \
  -H "x-ingest-secret: ${SECRET:-dev-ingest-secret}" || echo "(ingest pode demorar / falhar sem LLM — ok)"

echo ""
echo "=========================================="
echo "  Radar IA no ar"
echo "  Site:  http://$(hostname -I | awk '{print $1}'):3000/pt"
echo "  API:   http://$(hostname -I | awk '{print $1}'):3002/health"
echo "  WA:    +55 62 98164-7087"
if [ -n "$DOMAIN" ]; then
  echo "  Nginx: veja deploy/nginx.conf.example → $DOMAIN"
fi
echo "=========================================="
