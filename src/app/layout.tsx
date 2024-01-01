import { Inter, Lexend, Poppins } from 'next/font/google'
import clsx from 'clsx'
import { Analytics } from '@vercel/analytics/react';

// import 'node_modules/leaflet-geosearch/dist/geosearch.css';
import '@/styles/geoencoder.css';
import '@/styles/mapbox-gl.css';
// import 'https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css';
// import 'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v5.0.0/mapbox-gl-geocoder.css';
import '@/styles/tailwind.css'
import '@/styles/globals.css'
import { type Metadata } from 'next'
import { SpeedInsights } from "@vercel/speed-insights/next"


export const metadata: Metadata = {
  title: {
    template: '%s | Cribbly',
    default: 'Cribbly | Property Management Made Easy',
  },
  description:
    'Most property management software is advanced, but hard to use. We make the opposite trade-off, and hope you don’t want advanced features.',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={clsx(
        'h-full scroll-smooth bg-white antialiased',
        inter.variable,
        lexend.variable,
      )}
    >
      <body className="flex h-full flex-col">{children}</body>
      <Analytics />
      <SpeedInsights />
    </html>
  )
}
