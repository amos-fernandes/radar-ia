import Parser from 'rss-parser';
import { query } from '../db.js';
import { FEEDS } from '../sources.js';
import { summarizeItem } from './llm.js';

const parser = new Parser({
  timeout: 15000,
  headers: { 'User-Agent': 'RadarIA/0.1 (+https://radaria.com.br)' },
});

const MAX_AGE_HOURS = 48;
const MAX_PER_FEED = 8;

export async function runIngest(): Promise<{ inserted: number; skipped: number }> {
  let inserted = 0;
  let skipped = 0;
  const cutoff = Date.now() - MAX_AGE_HOURS * 3600 * 1000;

  for (const feed of FEEDS) {
    try {
      console.log(`[ingest] fetching ${feed.name}`);
      const parsed = await parser.parseURL(feed.url);
      const items = (parsed.items || []).slice(0, MAX_PER_FEED);

      for (const item of items) {
        const url = item.link || item.guid;
        if (!url) { skipped++; continue; }

        const pub = item.pubDate ? new Date(item.pubDate).getTime() : Date.now();
        if (pub < cutoff) { skipped++; continue; }

        const exists = await query('SELECT id FROM articles WHERE source_url = $1', [url]);
        if (exists.rows.length > 0) { skipped++; continue; }

        const title = (item.title || 'Untitled').trim();
        const snippet = (item.contentSnippet || item.content || item.summary || '').replace(/<[^>]+>/g, '').trim();

        const llm = await summarizeItem({ title, snippet, source: feed.name });

        await query(
          `INSERT INTO articles
           (source_url, source_name, title_en, title_pt, summary_en, summary_pt, score, category, published_at, status)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'published')
           ON CONFLICT (source_url) DO NOTHING`,
          [url, feed.name, llm.title_en, llm.title_pt, llm.summary_en, llm.summary_pt, llm.score, llm.category,
           item.pubDate ? new Date(item.pubDate) : new Date()]
        );
        inserted++;
        console.log(`[ingest] + ${llm.title_en.slice(0, 60)} (score ${llm.score})`);
      }
    } catch (err: any) {
      console.error(`[ingest] feed ${feed.name} failed:`, err.message);
    }
  }

  await rebuildDailyHot();
  console.log(`[ingest] done inserted=${inserted} skipped=${skipped}`);
  return { inserted, skipped };
}

async function rebuildDailyHot() {
  const day = new Date().toISOString().slice(0, 10);
  await query('DELETE FROM daily_hot WHERE day = $1', [day]);

  const top = await query(
    `SELECT id, score FROM articles
     WHERE status = 'published' AND published_at > NOW() - INTERVAL '36 hours'
     ORDER BY score DESC, published_at DESC LIMIT 15`
  );

  let rank = 1;
  for (const row of top.rows) {
    const heat = Math.round(Number(row.score) * 100 + (15 - rank) * 50);
    await query(
      `INSERT INTO daily_hot (article_id, rank, heat, day) VALUES ($1,$2,$3,$4) ON CONFLICT DO NOTHING`,
      [row.id, rank, heat, day]
    );
    rank++;
  }
}

const isMain = process.argv[1]?.includes('ingest');
if (isMain) {
  runIngest()
    .then((r) => { console.log(r); process.exit(0); })
    .catch((e) => { console.error(e); process.exit(1); });
}
