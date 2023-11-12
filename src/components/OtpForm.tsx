'use client'
import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import clsx from 'clsx'
import { Button } from '@/components/Button'
import Messages from '@/components/Messages'

export function OtpForm() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const inputsRef = useRef<HTMLInputElement[]>([]);
  const [cooldownTime, setCooldownTime] = useState(30);

  useEffect(() => {
    if (cooldownTime > 0) {
      const interval = setInterval(() => {
        setCooldownTime(prevTime => prevTime - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [cooldownTime]);

  const handleInput = (index: number, e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (target.value.length === 1 && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  }

  const handleBackspace = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && e.currentTarget.value.length === 0 && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 6).replace(/[^0-9]/g, '');
    if (pasteData.length === 6) {
      pasteData.split('').forEach((value, index) => {
        inputsRef.current[index].value = value;
        if (index < 5) {
          inputsRef.current[index + 1].focus();
        }
      });
    }
  }

  const formatEmail = (email: string | string[] | null) => {
    if (email) {
      const atIndex = email.indexOf('@');
      if (atIndex > 10) {
        return `${email.slice(0, 8)}**${email.slice(atIndex - 2, atIndex)}${email.slice(atIndex)}`;
      }
      return email;
    }
    return '';
  };

  const handleResendOtp = async () => {
    setCooldownTime(30);
    try {
      const response = await fetch('/auth/otp/resend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
    } catch (error) {
      console.error('Error resending OTP:', error);
    }
  };

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  return (
    <>
    <form method="POST" className="">
      <div className="text-center mb-4 text-sm text-gray-400">
        <p>We have sent a verification code to your email</p>
        <p>{formatEmail(email)}</p>
      </div>
      <Messages />
      <div className="flex flex-col">
        <input type="hidden" name="email" value={email!} />
        <div className="flex justify-center space-x-2 mt-8" onPaste={handlePaste}>
          {[...Array(6)].map((_, index) => (
            <input
              key={index}
              ref={el => {
                if (el) {
                  inputsRef.current[index] = el;
                }
              }}
              className="w-10 h-12 border-1 border-gray-300 text-center rounded-md"
              type="text"
              name={`otp${index}`}
              maxLength={1}
              onInput={(e) => handleInput(index, e)}
              onKeyDown={(e) => handleBackspace(index, e)}
              onPaste={handlePaste}
              pattern="[0-9]*"
              inputMode="numeric"
              required
            />
          ))}
        </div>
        <Button
          formAction="/auth/otp"
          type="submit"
          variant="solid"
          color="blue"
          className="w-full mt-12"
        >
          Verify Account
        </Button>
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Didn&apos;t receive code?{' '}
            <button
              className={clsx("text-blue-600 hover:text-blue-500 font-semibold", 
                              { 'text-blue-400 hover:text-blue-400 cursor-default': cooldownTime > 0 })}
              onClick={handleResendOtp}
              disabled={cooldownTime > 0}
            >
              {cooldownTime > 0 ? `Resend (${cooldownTime}s)` : 'Resend'}
            </button>
          </p>
        </div>
      </div>
    </form>
    </>
  )
}
