import { Inter, Lexend, Poppins } from 'next/font/google'
import clsx from 'clsx'
import { Analytics } from '@vercel/analytics/react';
// import '@/styles/mapbox-gl.css';
import '@/styles/geoencoder.css';
import '@/styles/tailwind.css'
import '@/styles/globals.css'
import { type Metadata } from 'next'
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from 'next/script';
import { PropsWithChildren, Suspense } from 'react';
import { Toaster } from "react-hot-toast";
import Head from 'next/head';

export const metadata: Metadata = {
  title: {
    template: '%s | Cribbly',
    default: 'Property Management Software for Small Landlords | Cribbly',
  },
  description:
    'Cribbly is the all-in-one property management software designed for small landlords. Its powerful platform automates rent collection, maintenance requests, and more.',
  metadataBase: new URL('https://www.cribbly.io'),
  openGraph: {
    title: 'Cribbly',
    description: 'Property management software for small landlords',
    url: 'https://cribbly.io',
    siteName: 'Cribbly',
    images: [
      {
        url: '/src/images/logo.svg'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
})

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
})

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html
      lang="en"
      className={clsx(
        'h-full scroll-smooth bg-gray-50',
        inter.variable,
        lexend.variable,
      )}
    >
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* <meta property="twitter:image" content="../images/icon.png"></meta>
      <meta property="twitter:card" content="../images/icon.png"></meta>
      <meta property="twitter:title" content="Property Management Software for Small Landlords | Cribbly"></meta>
      <meta property="twitter:description" content="Cribbly is the all-in-one property management software designed for small landlords. Its powerful platform automates rent collection, maintenance requests, and more."></meta>
      <meta property="og:image" content="../images/icon.png"></meta>
      <meta property="og:title" content="Property Management Software for Small Landlords | Cribbly"></meta>
      <meta property="og:description" content="Cribbly is the all-in-one property management software designed for small landlords. Its powerful platform automates rent collection, maintenance requests, and more." />
      <meta property="og:url" content="https://cribbly.io"></meta> */}

      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-MTXEMYC4EM"
      />
      <Script id="gtag">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag() {
            dataLayer.push(arguments);
          }
          gtag('js', new Date());
          gtag('config', 'G-MTXEMYC4EM');
        `}
      </Script>

      <body className="h-full bg-gray-50 subpixel-antialiased">
        <Toaster position="top-center" />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>

    </html>
  )
}
