import "@/styles/globals.css";
import { Inter, Lexend, Poppins } from "next/font/google";
import localFont from "next/font/local";
import clsx from "clsx";
import { Analytics } from "@vercel/analytics/react";
import "@/styles/tailwind.css";
import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import type { PropsWithChildren } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TailwindIndicator } from "@/components/tailwind-indicator";

export const metadata: Metadata = {
  title: {
    template: "%s - Cribbly 🏡",
    default:
      "Cribbly 🏡 - Property Management Software for Independent Landlords",
  },
  description:
    "Cribbly is the all-in-one property management software designed for independent landlords. Its powerful platform automates rent collection, maintenance requests, and more.",
  metadataBase: new URL("https://cribbly.io"),
  openGraph: {
    title:
      "Cribbly 🏡 - Property Management Software for Independent Landlords",
    description: "Property management software for independent landlords",
    url: "https://cribbly.io",
    siteName: "Cribbly",
    images: [
      {
        url: "https://cribbly.io/images/opengraph-image.png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const lexend = Lexend({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lexend",
});

const openRunde = localFont({
  src: [
    {
      path: "../../public/fonts/open-runde/OpenRunde-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/open-runde/OpenRunde-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/open-runde/OpenRunde-Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/open-runde/OpenRunde-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-open-runde",
});

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html
      lang="en"
      className={clsx(
        "h-full antialiased bg-gray-50 lg:bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-white dark:lg:bg-zinc-950",
        inter.variable,
        lexend.variable,
        openRunde.variable
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
      <body className="h-full antialiased">
        {children}

        <Analytics />
        <SpeedInsights />
        <Toaster position="top-center" />
        <TailwindIndicator />
      </body>
    </html>
  );
}
