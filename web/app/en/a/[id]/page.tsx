import Link from 'next/link';
import { fetchArticle } from '@/lib/api';
import en from '@/messages/en.json';

export const dynamic = 'force-dynamic';

export default async function EnArticle({ params }: { params: { id: string } }) {
  const a = await fetchArticle(params.id, 'en');
  const wa = process.env.NEXT_PUBLIC_WA_LINK || 'https://wa.me/5562999999999?text=Hi!%20I%20want%20AI%20Radar';
  if (!a) {
    return (<main><p>Article not found.</p><Link href="/en">← Back</Link></main>);
  }
  return (
    <main>
      <header>
        <Link href="/en" className="brand">AI <span>Radar</span></Link>
        <Link className="lang-switch" href={`/pt/a/${params.id}`}>Português</Link>
      </header>
      <div className="meta">
        <span className="badge">{a.category}</span>
        <span>{en.score} {a.score}</span>
        <span>{en.source}: {a.source_name}</span>
      </div>
      <h1 style={{ fontSize: '1.4rem', marginTop: 8 }}>{a.title}</h1>
      <p className="summary" style={{ fontSize: '1.05rem', marginTop: 16 }}>{a.summary}</p>
      <p style={{ marginTop: 20 }}>
        <a className="btn" href={a.source_url} target="_blank" rel="noreferrer">{en.readOriginal}</a>
      </p>
      <section className="cta">
        <h3>{en.ctaTitle}</h3>
        <p>{en.ctaBody}</p>
        <a className="btn" href={wa} target="_blank" rel="noreferrer">{en.ctaButton}</a>
      </section>
    </main>
  );
}
