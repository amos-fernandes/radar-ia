import Link from 'next/link';
import { fetchHot, fetchLatest } from '@/lib/api';
import pt from '@/messages/pt.json';

export const dynamic = 'force-dynamic';

export default async function PtHome() {
  const [hot, latest] = await Promise.all([fetchHot('pt'), fetchLatest('pt')]);
  const wa = process.env.NEXT_PUBLIC_WA_LINK || 'https://wa.me/5562999999999?text=Oi!%20Quero%20o%20Radar%20IA';

  return (
    <main>
      <header>
        <div className="brand">Radar <span>IA</span></div>
        <Link className="lang-switch" href="/en">{pt.switchLang}</Link>
      </header>
      <p className="tagline">{pt.tagline}</p>
      <div className="section-title">{pt.hot}</div>
      {hot.length === 0 && <p className="summary">{pt.empty}</p>}
      {hot.map((a) => (
        <Link key={a.id} href={`/pt/a/${a.id}`} className="card" style={{ display: 'block' }}>
          <div className="meta">
            <span className="badge">#{a.rank ?? '—'}</span>
            <span>{pt.score} {a.score}</span>
            <span>{a.source_name}</span>
          </div>
          <h2>{a.title}</h2>
          <p className="summary">{a.summary}</p>
        </Link>
      ))}
      <div className="section-title">{pt.latest}</div>
      {latest.map((a) => (
        <Link key={a.id} href={`/pt/a/${a.id}`} className="card" style={{ display: 'block' }}>
          <div className="meta">
            <span className="badge">{a.category}</span>
            <span>{pt.score} {a.score}</span>
            <span>{a.source_name}</span>
          </div>
          <h2>{a.title}</h2>
          <p className="summary">{a.summary}</p>
        </Link>
      ))}
      <section className="cta">
        <h3>{pt.ctaTitle}</h3>
        <p>{pt.ctaBody}</p>
        <a className="btn" href={wa} target="_blank" rel="noreferrer">{pt.ctaButton}</a>
      </section>
      <footer>Radar IA · resumos + link para a fonte original · Vertical Agent / W-Dollar</footer>
    </main>
  );
}
