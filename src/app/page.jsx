import React from 'react'
import { CallToAction } from '@/components/landing/CallToAction'
import { Faqs } from '@/components/landing/Faqs'
import { Footer } from '@/components/landing/Footer'
import { Header } from '@/components/landing/Header'
import { Hero } from '@/components/landing/Hero'
import { Pricing } from '@/components/landing/Pricing'
import { PrimaryFeatures } from '@/components/landing/PrimaryFeatures'
import { SecondaryFeatures } from '@/components/landing/SecondaryFeatures'
import { Testimonials } from '@/components/landing/Testimonials'
import { NavLink } from '@/components/default/NavLink'
import { Container } from '@/components/default/Container'
import { FollowerPointerCard } from '@/components/aceternity/following-pointer'
import { WavyBackground } from '@/components/aceternity/wavy-background'
import { BeforeAfter } from '@/components/landing/BeforeAfter'

export default function Home() {

  return (
    <>
      <Header />
      <main>
        <WavyBackground> 
          <Hero />
        </WavyBackground>
        <PrimaryFeatures />
        <BeforeAfter />
        <Testimonials />
        <FollowerPointerCard title="🏠 Future Property Manager">
          <CallToAction />
        </FollowerPointerCard>

        {/* <SecondaryFeatures /> */}
        {/* <Pricing /> */}
        <Faqs />
        <section className="relative mx-auto justify-center w-full">
          If you have any additional questions, please feel free to reach out to us at <a href="mailto:support@cribbly.io "> support@cribbly.io</a>
        </section>
      </main>
      <Footer />
    </>
  )
}
