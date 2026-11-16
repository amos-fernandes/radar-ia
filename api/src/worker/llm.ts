import { config } from '../config.js';
import { buildSummarizePrompt } from '../prompts/summarize.js';

export type LlmArticle = {
  title_en: string;
  title_pt: string;
  summary_en: string;
  summary_pt: string;
  score: number;
  category: string;
};

function heuristicFallback(title: string, snippet: string): LlmArticle {
  const text = `${title}. ${snippet}`.slice(0, 400);
  return {
    title_en: title.slice(0, 120),
    title_pt: title.slice(0, 120),
    summary_en: text || title,
    summary_pt: text || title,
    score: 55,
    category: 'industry',
  };
}

export async function summarizeItem(params: {
  title: string;
  snippet: string;
  source: string;
}): Promise<LlmArticle> {
  if (!config.llm.apiKey) {
    console.warn('[llm] LLM_API_KEY missing — using heuristic fallback');
    return heuristicFallback(params.title, params.snippet);
  }

  const prompt = buildSummarizePrompt(params.title, params.snippet, params.source);

  try {
    const res = await fetch(`${config.llm.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.llm.apiKey}`,
      },
      body: JSON.stringify({
        model: config.llm.model,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: 'You output only valid JSON.' },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[llm] API error', res.status, errText.slice(0, 200));
      return heuristicFallback(params.title, params.snippet);
    }

    const data = (await res.json()) as any;
    const raw = data.choices?.[0]?.message?.content || '{}';
    const parsed = JSON.parse(raw);

    return {
      title_en: String(parsed.title_en || params.title).slice(0, 200),
      title_pt: String(parsed.title_pt || params.title).slice(0, 200),
      summary_en: String(parsed.summary_en || params.snippet).slice(0, 2000),
      summary_pt: String(parsed.summary_pt || params.snippet).slice(0, 2000),
      score: Math.min(100, Math.max(0, Number(parsed.score) || 50)),
      category: ['models', 'funding', 'policy', 'tools', 'industry'].includes(parsed.category)
        ? parsed.category
        : 'industry',
    };
  } catch (err: any) {
    console.error('[llm] failed', err.message);
    return heuristicFallback(params.title, params.snippet);
  }
}
