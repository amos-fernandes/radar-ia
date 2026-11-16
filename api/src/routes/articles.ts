import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

function pickLocale(locale?: string) {
  return locale === 'en' ? 'en' : 'pt';
}

router.get('/', async (req, res) => {
  const locale = pickLocale(String(req.query.locale || 'pt'));
  const limit = Math.min(50, parseInt(String(req.query.limit || '20'), 10) || 20);
  const category = req.query.category ? String(req.query.category) : null;
  const titleCol = locale === 'en' ? 'title_en' : 'title_pt';
  const summaryCol = locale === 'en' ? 'summary_en' : 'summary_pt';

  let sql = `SELECT id, source_url, source_name, ${titleCol} as title, ${summaryCol} as summary,
                    score, category, published_at FROM articles WHERE status = 'published'`;
  const params: any[] = [];
  if (category) { params.push(category); sql += ` AND category = $${params.length}`; }
  sql += ` ORDER BY published_at DESC LIMIT $${params.length + 1}`;
  params.push(limit);

  const r = await query(sql, params);
  res.json({ locale, items: r.rows });
});

router.get('/hot', async (req, res) => {
  const locale = pickLocale(String(req.query.locale || 'pt'));
  const day = String(req.query.day || new Date().toISOString().slice(0, 10));
  const titleCol = locale === 'en' ? 'title_en' : 'title_pt';
  const summaryCol = locale === 'en' ? 'summary_en' : 'summary_pt';

  const r = await query(
    `SELECT h.rank, h.heat, a.id, a.source_url, a.source_name,
            a.${titleCol} as title, a.${summaryCol} as summary,
            a.score, a.category, a.published_at
     FROM daily_hot h JOIN articles a ON a.id = h.article_id
     WHERE h.day = $1 AND a.status = 'published' ORDER BY h.rank ASC`,
    [day]
  );
  res.json({ locale, day, items: r.rows });
});

router.get('/:id', async (req, res) => {
  const locale = pickLocale(String(req.query.locale || 'pt'));
  const titleCol = locale === 'en' ? 'title_en' : 'title_pt';
  const summaryCol = locale === 'en' ? 'summary_en' : 'summary_pt';
  const r = await query(
    `SELECT id, source_url, source_name, ${titleCol} as title, ${summaryCol} as summary,
            score, category, published_at FROM articles WHERE id = $1 AND status = 'published'`,
    [req.params.id]
  );
  if (!r.rows[0]) return res.status(404).json({ error: 'not_found' });
  res.json({ locale, item: r.rows[0] });
});

export default router;
