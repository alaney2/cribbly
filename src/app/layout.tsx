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
import { Toaster } from "@/components/ui/sonner"
import { TailwindIndicator } from "@/components/tailwind-indicator"


export const metadata: Metadata = {
  title: {
    template: '%s - Cribbly',
    default: 'Property Management Software - Cribbly',
  },
  description:
    'Cribbly is the all-in-one property management software designed for small landlords. Its powerful platform automates rent collection, maintenance requests, and more.',
  metadataBase: new URL('https://cribbly.io'),
  openGraph: {
    title: 'Cribbly | Property Management Software for Small Landlords',
    description: 'Property management software for small landlords',
    url: 'https://cribbly.io',
    siteName: 'Cribbly',
    images: [
      {
        url: 'https://cribbly.io/images/opengraph-image.png',
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
        {children}

        <Analytics />
        <SpeedInsights />
        <Toaster position="top-center" />
        {/* <TailwindIndicator /> */}
      </body>
    </html>
  )
}
