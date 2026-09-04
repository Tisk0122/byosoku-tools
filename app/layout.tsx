import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: '秒速ツール｜面倒なことを、1秒で。',
    template: '%s | 秒速ツール',
  },
  description: '登録不要・完全無料。毎日のちょっとした困りごとをすぐに解決する便利ツール集。',
  generator: '秒速ツール',
  applicationName: '秒速ツール',
  authors: [{ name: '秒速ツール' }],
  keywords: [
    '秒速ツール',
    '無料ツール',
    '文字数カウント',
    '割引計算',
    '年齢計算',
    '消費税計算',
    'JSON整形',
    'ルーレット',
    'オンラインツール',
  ],
  creator: '秒速ツール',
  publisher: '秒速ツール',
  formatDetection: { telephone: false },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: '秒速ツール',
    locale: 'ja_JP',
    url: siteUrl,
    title: '秒速ツール｜面倒なことを、1秒で。',
    description: '登録不要・完全無料。毎日のちょっとした困りごとをすぐに解決する便利ツール集。',
    images: [
      {
        url: '/ogp.png',
        width: 1200,
        height: 630,
        alt: '秒速ツール',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '秒速ツール｜面倒なことを、1秒で。',
    description: '登録不要・完全無料。毎日のちょっとした困りごとをすぐに解決する便利ツール集。',
    images: ['/ogp.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180' },
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
    shortcut: ['/favicon.ico'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className="bg-background">
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'WebSite',
                  '@id': `${siteUrl}/#website`,
                  url: siteUrl,
                  name: '秒速ツール',
                  description:
                    '登録不要・完全無料。毎日のちょっとした困りごとをすぐに解決する便利ツール集。',
                  inLanguage: 'ja-JP',
                },
                {
                  '@type': 'WebApplication',
                  '@id': `${siteUrl}/#webapp`,
                  url: siteUrl,
                  name: '秒速ツール',
                  description:
                    '登録不要・完全無料。毎日のちょっとした困りごとをすぐに解決する便利ツール集。',
                  applicationCategory: 'UtilityApplication',
                  operatingSystem: 'Any',
                  inLanguage: 'ja-JP',
                  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
                },
              ],
            }),
          }}
        />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
