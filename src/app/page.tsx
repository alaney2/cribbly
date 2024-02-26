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

export default function Home() {

  return (
    <>
      <Header />
      <main>
        <WavyBackground> 
          <Hero />
        </WavyBackground>
        <PrimaryFeatures />
        <SecondaryFeatures />
        <FollowerPointerCard title="🏠 Future Property Manager">
          <CallToAction />
        </FollowerPointerCard>
        {/* <Testimonials /> */}
        {/* <Pricing /> */}
        <Faqs />
      </main>
      <Footer />
    </>
  )
}
