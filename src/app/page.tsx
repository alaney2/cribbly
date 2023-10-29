import { CallToAction } from '@/components/CallToAction'
import { Faqs } from '@/components/Faqs'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Pricing } from '@/components/Pricing'
import { PrimaryFeatures } from '@/components/PrimaryFeatures'
import { SecondaryFeatures } from '@/components/SecondaryFeatures'
import { Testimonials } from '@/components/Testimonials'
import { NavLink } from '@/components/NavLink'

import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { Dashboard } from '@/components/Dashboard'
import Dashboard1 from '@/components/Dashboard1'

const Logout = () => (
  <form action="/auth/logout" method="post">
    <button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
    <NavLink href="/login">Sign out</NavLink>
      {/* Sign Out */}
    </button>
  </form>
)

export default async function Home() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user ? (<Dashboard1 />) : (
    <>
      <Header />
      <main>
        <Hero />
        <PrimaryFeatures />
        <SecondaryFeatures />
        <CallToAction />
        <Testimonials />
        <Pricing />
        <Faqs />
      </main>
      <Footer />
    </>
  )
}
