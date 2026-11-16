# Radar IA · AI Radar

Portal de notícias de IA em **PT + EN**, com pipeline:

```
RSS públicos → LLM (resumo PT/EN) → Postgres → Next.js → CTA WhatsApp
```

Inspirado no formato de agregadores (hot + score), **marca e conteúdo próprios**.
Não é clone do aihot.news.

## Quick start

```bash
cp .env.example .env
docker compose up -d --build
curl -X POST http://localhost:3002/internal/ingest -H "x-ingest-secret: dev-ingest-secret"
open http://localhost:3000/pt
```

Ver README completo no repositório para API, fontes RSS e deploy VPS.
