"use client"
import clsx from 'clsx'
import { useState } from 'react'
import { OtpResend } from '@/components/auth/otp/OtpResend'
import { OtpInput } from '@/components/auth/otp/OtpInput'
import 'animate.css'

interface OtpFormProps {
  email: string;
  backToSignIn?: () => void;
}

export function OtpForm( { email, backToSignIn }: OtpFormProps ) {
  const [fadeOut, setFadeOut] = useState(false);

  const handleButtonSubmit = () => {
    setFadeOut(true)
    setTimeout(() => {
      backToSignIn && backToSignIn();
    }, 400);
  }

  return (
    <div className={clsx('animate__animated animate__fastest', fadeOut ? `animate__fadeOut` : 'animate__fadeIn animate__fastest')}>
      <div className="text-center mb-4 text-md text-gray-500 fond-medium tracking-tight">
        <p>We&apos;ve sent a verification code to your email</p>
        <p>{email}</p>
      </div>
      <div className="flex flex-col">
        <OtpInput email={email} />
        <OtpResend email={email} />
        {backToSignIn && <button onClick={handleButtonSubmit} className="mt-16 text-sm tracking-tight font-medium text-center leading-6 text-gray-400 active:text-gray-500 cursor-default">
          Back to sign-in
        </button>}
      </div>
    </div>
  )
}
