const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export type ArticleCard = {
  id: string;
  title: string;
  summary: string;
  source_name: string;
  source_url: string;
  score: number;
  category: string;
  published_at: string;
  rank?: number;
  heat?: number;
};

export async function fetchHot(locale: 'pt' | 'en'): Promise<ArticleCard[]> {
  const res = await fetch(`${API}/api/articles/hot?locale=${locale}`, { next: { revalidate: 120 } });
  if (!res.ok) return [];
  const data = await res.json();
  return data.items || [];
}

export async function fetchLatest(locale: 'pt' | 'en', limit = 12): Promise<ArticleCard[]> {
  const res = await fetch(`${API}/api/articles?locale=${locale}&limit=${limit}`, { next: { revalidate: 120 } });
  if (!res.ok) return [];
  const data = await res.json();
  return data.items || [];
}

export async function fetchArticle(id: string, locale: 'pt' | 'en'): Promise<ArticleCard | null> {
  const res = await fetch(`${API}/api/articles/${id}?locale=${locale}`, { next: { revalidate: 300 } });
  if (!res.ok) return null;
  const data = await res.json();
  return data.item || null;
}
