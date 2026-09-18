import type { Metadata, Viewport } from 'next';
import { Geist, Instrument_Serif } from 'next/font/google';
import Script from 'next/script';
import { siteConfig } from '@/config/site';
import { LayoutShell } from '@/components/layout/layout-shell';
import { JsonLd } from '@/components/seo/json-ld';
import { organizationSchema, websiteSchema } from '@/lib/structured-data';
import './globals.css';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  display: 'swap',
});

const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('sk-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.setAttribute('data-theme','dark');document.documentElement.classList.add('dark');}}catch(e){}if(typeof window!=='undefined'){window.addEventListener('unhandledrejection',function(e){if(e.reason&&(e.reason.name==='AbortError'||e.reason.code===20||(typeof e.reason.message==='string'&&(e.reason.message.indexOf('aborted')!==-1||e.reason.message.indexOf('The user aborted a request')!==-1)))){e.preventDefault();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}},true);}})()`;

const GTAG_SCRIPT = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-X85YECWQZL');`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: siteConfig.name,
  },
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [{ url: '/og/home.png', width: 1200, height: 630, alt: 'StudentKit — Calculate. Learn. Build.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    creator: siteConfig.social.twitter,
    images: ['/og/home.png'],
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
};

export const viewport: Viewport = {
  themeColor: '#F7F7F2',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
        {process.env.NODE_ENV === 'production' && (
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4789559777617370"
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground font-sans antialiased">
        {process.env.NODE_ENV === 'production' && (
          <>
            <Script
              src="https://www.googletagmanager.com/gtag/js?id=G-X85YECWQZL"
              strategy="afterInteractive"
            />
            <Script
              id="gtag-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{ __html: GTAG_SCRIPT }}
            />
          </>
        )}
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
