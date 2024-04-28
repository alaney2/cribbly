'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { SlimLayout } from '@/components/default/SlimLayout'
import logo from '@/images/icon.png'
import Link from 'next/link'
import Image from 'next/image'
import styles from '@/components/welcome/Welcome.module.css';
import { FloatingLabelInput } from '@/components/ui/floating-label-input';
import { useState } from 'react'

function Invite() {
  const searchParams = useSearchParams()
  const propertyId = searchParams.get('property')
  const token = searchParams.get('token')
  const email = searchParams.get('email')
  const name = searchParams.get('name')
  const router = useRouter()
  const [fullName, setFullName] = useState(name)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
  }

  if (!propertyId || !token || !email) {
    router.push('/')
  }

  return (
    <>
      <SlimLayout subHeading='Check your balance, set up recurring payments, and more'>
        <div className="mb-40">
          <div className="sm:w-full sm:max-w-md">
            <Link href="/" className="cursor-default">
              <Image
                className='h-16 w-auto mx-auto'
                src={logo}
                alt=""
                priority={false}
              />
            </Link>
            <h2 className="text-center my-6 text-lg font-semibold text-zinc-600 cursor-default">
              Create your account
            </h2>
          </div>
          <div className="flex flex-col gap-y-4">
            <FloatingLabelInput id="floating-demo" label="Full name"
              className={`${styles.inputCenterText}`}
              name="fullName"
              defaultValue={name!}
              onChange={handleInputChange}
            />
            <FloatingLabelInput id="floating-demo" label="Email"
              className={`${styles.inputCenterText}`}
              name="email"
              defaultValue={email!} 
              readOnly
              disabled 
            />
            <Button className="mt-2">Continue with email</Button>
          </div>
        </div>
      </SlimLayout>
    </>
  )
}

export default function InvitePage() {
  return (
    <Suspense>
      <Invite />
    </Suspense>
  )
}
