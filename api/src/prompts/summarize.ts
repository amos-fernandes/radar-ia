export function buildSummarizePrompt(title: string, snippet: string, source: string) {
  return `You are an editor for an AI business news site (Radar IA / AI Radar).

Given this item from ${source}:

Title: ${title}
Snippet: ${snippet.slice(0, 1200)}

Produce a JSON object ONLY (no markdown) with:
{
  "title_en": "clear English title, max 120 chars",
  "title_pt": "título natural em português brasileiro, max 120 chars",
  "summary_en": "2-4 factual sentences in English for business readers",
  "summary_pt": "2-4 frases factuais em português brasileiro",
  "score": 0-100 integer (importance for AI industry readers),
  "category": one of: models | funding | policy | tools | industry
}

Rules:
- No hype, no clickbait
- Attribute facts to the source when relevant
- If snippet is weak, still produce a useful short summary from the title
- score: 80+ major (model release, big funding, regulation); 50-79 notable; below 50 minor`;
}
