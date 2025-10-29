import type { Metadata, Viewport } from 'next'
import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import { SolanaProvider } from "../components/solana-provider";
import { CookbookProvider } from "../components/solana-cookbook-provider-simple";
import { CleanProvider } from "../components/providers/CleanProvider";

export const metadata: Metadata = {
  title: 'Oráculo - Prediction Markets on Solana',
  description: 'Mercados de predicción descentralizados en Solana. Predice el futuro y gana recompensas.',
  keywords: ['prediction markets', 'solana', 'blockchain', 'defi', 'predicciones'],
  authors: [{ name: 'Oráculo Team' }],
  creator: 'Oráculo',
  publisher: 'Oráculo',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://oraculo.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Oráculo - Prediction Markets on Solana',
    description: 'Mercados de predicción descentralizados en Solana',
    url: 'https://oraculo.app',
    siteName: 'Oráculo',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Oráculo - Prediction Markets on Solana',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oráculo - Prediction Markets on Solana',
    description: 'Mercados de predicción descentralizados en Solana',
    images: ['/og-image.png'],
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
  manifest: '/manifest.json',
  icons: {
    icon: '/icon-192x192.png',
    shortcut: '/icon-192x192.png',
    apple: '/icon-192x192.png',
  },
  appleWebApp: {
    title: 'Oráculo',
    statusBarStyle: 'default',
    capable: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#8B5CF6',
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body className="h-full neural-mesh-bg">
        <CleanProvider>
          <SolanaProvider>
            <CookbookProvider>
              {children}
            </CookbookProvider>
          </SolanaProvider>
        </CleanProvider>
      </body>
    </html>
  );
}