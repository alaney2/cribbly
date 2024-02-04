import clsx from 'clsx'
import { useState } from 'react'
import { Button } from '@/components/default/Button'
import { OtpResend } from '@/components/otp/OtpResend'
import { OtpInput } from '@/components/otp/OtpInput'
import 'animate.css'

interface OtpFormProps {
  email: string;
  backToSignIn: () => void;
}

export function OtpForm( { email, backToSignIn }: OtpFormProps ) {
  const [fadeOut, setFadeOut] = useState(false);

  const handleButtonSubmit = () => {
    setFadeOut(true)
    setTimeout(() => {
      backToSignIn();
    }, 400);
  }

  return (
    <div className={clsx('animate__animated animate__fastest', fadeOut ? `animate__fadeOut` : 'animate__fadeIn animate__fastest')}>
      <div className="text-center mb-4 text-sm text-gray-400">
        <p>We&apos;ve sent a verification code to your email</p>
        <p>{email}</p>
      </div>
      <div className="flex flex-col">
        <OtpInput email={email} />
        <OtpResend email={email} />
        <button onClick={handleButtonSubmit} className="mt-16 text-sm tracking-tight font-medium text-center leading-6 text-blue-500 active:text-gray-500 cursor-default">
          Back to sign-in
        </button>
      </div>
    </div>
  )
}
