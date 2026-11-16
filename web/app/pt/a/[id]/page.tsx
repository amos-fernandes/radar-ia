import Link from 'next/link';
import { fetchArticle } from '@/lib/api';
import pt from '@/messages/pt.json';

export const dynamic = 'force-dynamic';

export default async function PtArticle({ params }: { params: { id: string } }) {
  const a = await fetchArticle(params.id, 'pt');
  const wa = process.env.NEXT_PUBLIC_WA_LINK || 'https://wa.me/5562999999999?text=Oi!%20Quero%20o%20Radar%20IA';
  if (!a) {
    return (<main><p>Matéria não encontrada.</p><Link href="/pt">← Voltar</Link></main>);
  }
  return (
    <main>
      <header>
        <Link href="/pt" className="brand">Radar <span>IA</span></Link>
        <Link className="lang-switch" href={`/en/a/${params.id}`}>English</Link>
      </header>
      <div className="meta">
        <span className="badge">{a.category}</span>
        <span>{pt.score} {a.score}</span>
        <span>{pt.source}: {a.source_name}</span>
      </div>
      <h1 style={{ fontSize: '1.4rem', marginTop: 8 }}>{a.title}</h1>
      <p className="summary" style={{ fontSize: '1.05rem', marginTop: 16 }}>{a.summary}</p>
      <p style={{ marginTop: 20 }}>
        <a className="btn" href={a.source_url} target="_blank" rel="noreferrer">{pt.readOriginal}</a>
      </p>
      <section className="cta">
        <h3>{pt.ctaTitle}</h3>
        <p>{pt.ctaBody}</p>
        <a className="btn" href={wa} target="_blank" rel="noreferrer">{pt.ctaButton}</a>
      </section>
    </main>
  );
}
