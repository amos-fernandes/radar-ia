CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS articles (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_url    TEXT NOT NULL UNIQUE,
  source_name   TEXT NOT NULL,
  title_en      TEXT NOT NULL,
  title_pt      TEXT NOT NULL,
  summary_en    TEXT NOT NULL,
  summary_pt    TEXT NOT NULL,
  score         INT  NOT NULL DEFAULT 50 CHECK (score >= 0 AND score <= 100),
  category      TEXT NOT NULL DEFAULT 'industry',
  published_at  TIMESTAMPTZ,
  ingested_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status        TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'hidden'))
);

CREATE INDEX IF NOT EXISTS idx_articles_published ON articles (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_score ON articles (score DESC);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles (status);

CREATE TABLE IF NOT EXISTS daily_hot (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id  UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  rank        INT  NOT NULL,
  heat        INT  NOT NULL DEFAULT 0,
  day         DATE NOT NULL,
  UNIQUE (day, rank),
  UNIQUE (day, article_id)
);

CREATE INDEX IF NOT EXISTS idx_daily_hot_day ON daily_hot (day DESC);

CREATE TABLE IF NOT EXISTS leads (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel      TEXT NOT NULL CHECK (channel IN ('whatsapp', 'email', 'form')),
  value        TEXT NOT NULL,
  locale       TEXT NOT NULL DEFAULT 'pt' CHECK (locale IN ('pt', 'en')),
  source_page  TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_created ON leads (created_at DESC);
