import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import { config } from './config.js';
import { healthCheck } from './db.js';
import articlesRouter from './routes/articles.js';
import leadsRouter from './routes/leads.js';
import { runIngest } from './worker/ingest.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', async (_req, res) => {
  let db = false;
  try { db = await healthCheck(); } catch { db = false; }
  res.json({
    status: 'ok',
    service: 'radar-ia-api',
    version: '0.1.0',
    db: db ? 'up' : 'down',
    llmConfigured: Boolean(config.llm.apiKey),
  });
});

app.use('/api/articles', articlesRouter);
app.use('/api/leads', leadsRouter);

app.post('/internal/ingest', async (req, res) => {
  const secret = req.headers['x-ingest-secret'];
  if (process.env.INGEST_SECRET && secret !== process.env.INGEST_SECRET) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  const result = await runIngest();
  res.json(result);
});

if (cron.validate(config.cronSchedule)) {
  cron.schedule(config.cronSchedule, () => {
    console.log('[cron] starting ingest');
    runIngest().catch((e) => console.error('[cron] ingest failed', e));
  });
  console.log(`[cron] scheduled: ${config.cronSchedule}`);
}

app.listen(config.port, () => {
  console.log(`Radar IA API v0.1.0 on :${config.port}`);
});
