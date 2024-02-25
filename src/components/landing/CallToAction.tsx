import Image from 'next/image'

// import { Button } from '@/components/default/Button'
import { Button } from '@/components/catalyst/button'
import { Container } from '@/components/default/Container'
import backgroundImage from '@/images/background-call-to-action.jpg'
import { FollowerPointerCard } from '@/components/aceternity/following-pointer'

export function CallToAction() {
  return (
    <FollowerPointerCard title="🏠 Future Property Manager">
    <section
      id="get-started-today"
      className="relative overflow-hidden bg-blue-600 py-32"
    >
      <Image
        className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
        src={backgroundImage}
        alt=""
        width={2347}
        height={1244}
        unoptimized
      />
      <Container className="relative">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            Get started today
          </h2>
          <p className="mt-4 text-lg tracking-tight text-white">
            It’s time to take control of your books. Buy our software so you can
            feel like you’re doing something productive.
          </p>
          <Button href="/get-started" color="white" className="mt-10 cursor-none">
            Get started
          </Button>
        </div>
      </Container>
    </section>
    </FollowerPointerCard>
  )
}
