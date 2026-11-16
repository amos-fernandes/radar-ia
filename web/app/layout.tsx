import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Radar IA · AI Radar',
  description: 'What matters in AI — every day. PT + EN.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  );
}
