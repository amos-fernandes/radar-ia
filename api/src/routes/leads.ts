import { Router } from 'express';
import { z } from 'zod';
import { query } from '../db.js';
import { config } from '../config.js';

const router = Router();

const schema = z.object({
  channel: z.enum(['whatsapp', 'email', 'form']),
  value: z.string().min(3).max(200),
  locale: z.enum(['pt', 'en']).default('pt'),
  source_page: z.string().max(300).optional(),
});

router.post('/', async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'invalid_body', details: parsed.error.flatten() });
  }
  const { channel, value, locale, source_page } = parsed.data;
  await query(
    `INSERT INTO leads (channel, value, locale, source_page) VALUES ($1,$2,$3,$4)`,
    [channel, value.trim(), locale, source_page || null]
  );
  const waLink =
    channel === 'whatsapp' || channel === 'form'
      ? `https://wa.me/${config.whatsappLeadNumber}?text=${encodeURIComponent(
          locale === 'en'
            ? 'Hi! I want the AI Radar daily summary.'
            : 'Oi! Quero receber o resumo diário do Radar IA.'
        )}`
      : null;
  res.status(201).json({ ok: true, whatsapp_url: waLink });
});

export default router;
