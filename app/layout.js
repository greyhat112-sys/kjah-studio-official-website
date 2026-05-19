import { Space_Grotesk, Space_Mono } from 'next/font/google';
import Cursor from '@/components/ui/Cursor';
import DotGrid from '@/components/ui/DotGrid';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
});

export const metadata = {
  title: 'KJAH Studio — Websites, Funnels & Automation',
  description:
    'KJAH Studio builds smart websites, funnels, and automation systems to attract more leads, work smarter, and grow online — without the tech headache.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${spaceMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Doto:ROND,wght@0,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <DotGrid />
        <Cursor />
        <div className="page-content">
          {children}
        </div>
      </body>
    </html>
  );
}
