import Link from 'next/link';
import { fetchHot, fetchLatest } from '@/lib/api';
import en from '@/messages/en.json';

export const dynamic = 'force-dynamic';

export default async function EnHome() {
  const [hot, latest] = await Promise.all([fetchHot('en'), fetchLatest('en')]);
  const wa = process.env.NEXT_PUBLIC_WA_LINK || 'https://wa.me/5562999999999?text=Hi!%20I%20want%20AI%20Radar';

  return (
    <main>
      <header>
        <div className="brand">AI <span>Radar</span></div>
        <Link className="lang-switch" href="/pt">{en.switchLang}</Link>
      </header>
      <p className="tagline">{en.tagline}</p>
      <div className="section-title">{en.hot}</div>
      {hot.length === 0 && <p className="summary">{en.empty}</p>}
      {hot.map((a) => (
        <Link key={a.id} href={`/en/a/${a.id}`} className="card" style={{ display: 'block' }}>
          <div className="meta">
            <span className="badge">#{a.rank ?? '—'}</span>
            <span>{en.score} {a.score}</span>
            <span>{a.source_name}</span>
          </div>
          <h2>{a.title}</h2>
          <p className="summary">{a.summary}</p>
        </Link>
      ))}
      <div className="section-title">{en.latest}</div>
      {latest.map((a) => (
        <Link key={a.id} href={`/en/a/${a.id}`} className="card" style={{ display: 'block' }}>
          <div className="meta">
            <span className="badge">{a.category}</span>
            <span>{en.score} {a.score}</span>
            <span>{a.source_name}</span>
          </div>
          <h2>{a.title}</h2>
          <p className="summary">{a.summary}</p>
        </Link>
      ))}
      <section className="cta">
        <h3>{en.ctaTitle}</h3>
        <p>{en.ctaBody}</p>
        <a className="btn" href={wa} target="_blank" rel="noreferrer">{en.ctaButton}</a>
      </section>
      <footer>AI Radar · summaries + link to original source · Vertical Agent / W-Dollar</footer>
    </main>
  );
}
