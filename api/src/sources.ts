export type FeedSource = { name: string; url: string; categoryHint?: string };

export const FEEDS: FeedSource[] = [
  { name: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/', categoryHint: 'industry' },
  { name: 'The Verge AI', url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', categoryHint: 'industry' },
  { name: 'OpenAI Blog', url: 'https://openai.com/blog/rss.xml', categoryHint: 'models' },
  { name: 'Google AI Blog', url: 'https://blog.google/technology/ai/rss/', categoryHint: 'models' },
  { name: 'Hugging Face Blog', url: 'https://huggingface.co/blog/feed.xml', categoryHint: 'tools' },
];
