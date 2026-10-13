import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TTB LabelCheck',
  description: 'AI-assisted alcohol label verification prototype',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
