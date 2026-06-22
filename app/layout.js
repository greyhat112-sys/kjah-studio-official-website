import { Space_Grotesk, Space_Mono } from 'next/font/google';
import Cursor from '@/components/ui/Cursor';
import DotGrid from '@/components/ui/DotGrid';
import Grain from '@/components/ui/Grain';
import { BookingProvider } from '@/contexts/BookingContext';
import BookingModal from '@/components/BookingModal/BookingModal';
import { GoogleAnalytics } from '@next/third-parties/google';
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
  metadataBase: new URL('https://kjahstudio.com'),
  title: {
    default: 'KJAH Studio — Websites, Funnels & Automation',
    template: '%s | KJAH Studio',
  },
  description:
    'KJAH Studio builds premium websites, sales funnels, and automation systems for coaches, e-commerce brands, and service businesses. Attract more leads, convert more clients, and grow online — without the tech headache.',
  keywords: [
    'website design agency',
    'sales funnel builder',
    'marketing automation agency',
    'custom website design',
    'sales funnel design',
    'HighLevel agency',
    'ClickFunnels expert',
    'email automation',
    'CRM setup',
    'digital marketing agency',
    'KJAH Studio',
    'funnel specialist',
    'automation expert',
    'web design agency',
  ],
  authors: [{ name: 'KJAH Studio', url: 'https://kjahstudio.com' }],
  creator: 'KJAH Studio',
  publisher: 'KJAH Studio',
  alternates: { canonical: 'https://kjahstudio.com' },
  verification: { google: 'd4xdHeK7TQ7HLs8G_AkWR3Vth7q5VqvByzf9941SnlY' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://kjahstudio.com',
    siteName: 'KJAH Studio',
    title: 'KJAH Studio — Websites, Funnels & Automation',
    description:
      'Premium websites, sales funnels, and automation systems. We build digital engines that attract leads, convert clients, and grow your business.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'KJAH Studio — Smart Websites, Funnels & Automation' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KJAH Studio — Websites, Funnels & Automation',
    description: 'Premium websites, sales funnels, and automation systems that grow your business.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
  applicationName: 'KJAH Studio',
  appleWebApp: {
    capable: true,
    title: 'KJAH Studio',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${spaceMono.variable}`}>
      <head>
        <meta name="color-scheme" content="dark" />
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="none" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Doto:ROND,wght@0,700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="preload"
          href="/assets/brand/gradient-orb.png"
          as="image"
          fetchPriority="high"
        />
      </head>
      <body>
        <BookingProvider>
          <DotGrid />
          <Cursor />
          <BookingModal />
          <main id="main-content" className="page-content">
            {children}
          </main>
          <Grain />
        </BookingProvider>
        <GoogleAnalytics gaId="G-K134HQF9CV" />
      </body>
    </html>
  );
}
