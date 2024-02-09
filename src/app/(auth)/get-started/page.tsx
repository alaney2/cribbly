"use client"
import { useState, useEffect, useRef, Suspense } from 'react'
import { Button } from '@/components/catalyst/button'
import { TextField } from '@/components/default/Fields'
import logo from '@/images/icon.png'
import Image from 'next/image'
import { GoogleSignIn } from '@/components/auth/GoogleSignIn'
import { Notification } from '@/components/Notification'
import { SlimLayout } from '@/components/default/SlimLayout'
import styles from '@/components/welcome/Welcome.module.css';
import { signInWithOtp } from '@/app/auth/action'
import { OtpForm } from '@/components/otp/OtpForm'
import 'animate.css'
import clsx from 'clsx'

const formClasses = `
    block text-sm w-full h-10 mb-4 appearance-none bg-gray-50 rounded-md 
    border-0.5 border-gray-200 bg-white px-3 py-1.5 text-gray-900 
    placeholder-gray-400 focus:border-blue-500 focus:outline-none 
    focus:ring-blue-500 sm:text-sm ring-1 focus:ring-0.5 ring-inset ring-gray-300 
    text-center animate__animated animate__fadeIn animate__fast
    transition-colors duration-300 box-border	`;

export default function GetStarted() {
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [buttonType, setButtonType] = useState<'submit' | 'button' | 'reset'>('button');
  const [fadeOut, setFadeOut] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState('');
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFadeOut(false);
    if (showEmailInput && emailInputRef && emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, [showEmailInput]);

  const backToSignIn = () => {
    setShowEmailInput(false);
    setFadeOut(false);
    setButtonType('button');
    setEmail('');
    setCurrentStep(0);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }

  const handleButtonClick = () => {
    setShowEmailInput(true)
    setTimeout(() => {
      setButtonType('submit')
    }, 0)
  }

  const handleButtonSubmit = () => {
    setFadeOut(true)
    setTimeout(() => {
      setCurrentStep(1);
    }, 400)
  }

  const renderStepContent = (stepIndex: number) => {
    switch(stepIndex) {
      case 0:
        return (
          <div className={clsx('animate__animated touch-none', fadeOut ? `animate__fadeOut animate__fastest` : 'animate__fadeIn animate__fastest')}>
            <div className="sm:w-full sm:max-w-md">
              <Image
                className='h-16 w-auto mx-auto'
                src={logo}
                alt=""
                priority={false}
              />
              <h2 className="text-center my-6 text-lg font-semibold text-zinc-600">
                Create your Cribbly account
              </h2>
            </div>

            <div className="sm:mx-auto">              
              <div className="mt-6 grid grid-cols-1 gap-4">
                <GoogleSignIn />
              </div>

              <div className="relative my-4 mx-4">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                </div>
              </div>
              <form className="" action={signInWithOtp}>
                {showEmailInput && (
                  <input
                    ref={emailInputRef}
                    type="email"
                    name="email"
                    id="email"
                    className={`${formClasses} ${styles.inputCenterText}`}
                    placeholder="Email"
                    onChange={handleInputChange}
                    required={true}
                    autoComplete='off'
                  />
                )}
                <Button type={buttonType} color="light" className="w-full h-10 text-zinc-600 cursor-default"
                  onClick={buttonType === 'button' ? handleButtonClick : handleButtonSubmit}
                >
                  <span className="text-sm leading-6 font-semibold">
                    Continue with Email
                  </span>
                </Button>
              </form>
            </div>
          </div>
        )
      case 1:
        return (
          <OtpForm email={email} backToSignIn={backToSignIn} />
        )
      default:
        return null;
    }
  }

  return (
    <SlimLayout>
      <Suspense>
        <Notification />
      </Suspense>
      {renderStepContent(currentStep)}
    </SlimLayout>
  )
}
