'use client'
import { useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { SlimLayout } from '@/components/default/SlimLayout'
import logo from '@/images/icon.png'
import Link from 'next/link'
import Image from 'next/image'
import styles from '@/styles/InputCenter.module.css';
import { FloatingLabelInput } from '@/components/ui/floating-label-input';
import { useState, useEffect, Suspense } from 'react'
import { signInWithOtp } from '@/app/auth/action'
import { OtpForm } from '@/components/auth/otp/OtpForm'
import clsx from 'clsx'
import { insertNewTenant, deleteInvite } from '@/utils/supabase/tenant/actions'
import { toast } from 'sonner';

function Invite() {
  const searchParams = useSearchParams()
  const propertyId = searchParams.get('property')
  const token = searchParams.get('token')
  const email = searchParams.get('email')
  const name = searchParams.get('name')
  const address = searchParams.get('address')
  const router = useRouter()
  if (!propertyId || !token || !email || !address) router.push('/')
  const [fullName, setFullName] = useState(name)
  const [currentStep, setCurrentStep] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
  }

  const handleButtonSubmit = () => {
    setTimeout(() => {
      setCurrentStep(1);
    }, 400)
  }
  

  const renderStepContent = (stepIndex: number) => {
    switch(stepIndex) {
      case 0:
        return (
          <>
            <div className="sm:w-full sm:max-w-md">
              {/* <Link href="/" className="cursor-default"> */}
                <Image
                  className='h-16 w-auto mx-auto'
                  src={logo}
                  alt=""
                  priority={false}
                />
              {/* </Link> */}
              <h2 className="text-center my-6 text-lg font-semibold text-zinc-600 cursor-default">
                {address}
              </h2>
            </div>
            <form 
              action={async (formData) => {
                try {
                  // await deleteInvite(formData)
                  await signInWithOtp(formData)
                  // await insertNewTenant(formData)
                } catch (error) {

                }
              }}
            >
              <div className="flex flex-col gap-y-4">
                <FloatingLabelInput id="floating-demo" label="Full name"
                  className={`${styles.inputCenterText}`}
                  name="fullName"
                  value={fullName!}
                  onChange={handleInputChange}
                />
                <FloatingLabelInput id="floating-demo" label="Email"
                  className={`${styles.inputCenterText}`}
                  name="email"
                  defaultValue={email!} 
                  readOnly
                />
                <input className="hidden" name="role" value="tenant" readOnly />
                <input className="hidden" name="token" value={token!} readOnly />
                <input className="hidden" name="propertyId" value={propertyId!} readOnly />
                <Button className="mt-2" onClick={handleButtonSubmit}>Continue with email</Button>
              </div>
            </form>
          </>
        )
      case 1:
        return (
          <OtpForm email={email!} />
        )
      default:
        return null;
    }
  }


  return (
    <>
      <SlimLayout subHeading='Check your balance, set up recurring payments, and more'>
        <div className="mb-40">
          {renderStepContent(currentStep)}
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
