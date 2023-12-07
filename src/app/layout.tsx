import { Inter, Lexend, Poppins } from 'next/font/google'
import clsx from 'clsx'
import { Analytics } from '@vercel/analytics/react';

import '@/styles/tailwind.css'
import 'node_modules/leaflet-geosearch/dist/geosearch.css';
import { type Metadata } from 'next'


export const metadata: Metadata = {
  title: {
    template: '%s | Cribbly',
    default: 'Cribbly - Simplifying Airbnb and Property Management',
  },
  description:
    'Most bookkeeping software is accurate, but hard to use. We make the opposite trade-off, and hope you don’t get audited.',
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
    </html>
  )
}
