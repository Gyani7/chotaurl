import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'ChotaUrl - Shorten, Share, Track',
    template: '%s | ChotaUrl'
  },
  description: 'Global URL shortener with analytics, QR codes, and secure redirects.',
  openGraph: {
    title: 'ChotaUrl',
    description: 'Shorten, Share, Track, Succeed.',
    url: 'https://chotaurl.pro',
    siteName: 'ChotaUrl',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'ChotaUrl Dashboard' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@chotaurl',
    creator: '@chotaurl',
  },
  alternates: {
    canonical: 'https://chotaurl.pro',
    languages: {
      'en': 'https://chotaurl.pro',
      'hi': 'https://chotaurl.pro/hi',
      'es': 'https://chotaurl.pro/es'
    }
  }
};
