'use client'
import { useState, useEffect, useRef } from 'react'
import clsx from 'clsx'

export function OtpResend({ email }: { email: string }) {
  const [cooldownTime, setCooldownTime] = useState(60);

  useEffect(() => {
    if (cooldownTime > 0) {
      const interval = setInterval(() => {
        setCooldownTime(prevTime => prevTime - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [cooldownTime]);

  const handleResendOtp = async () => {
    setCooldownTime(30);
    try {
      const response = await fetch('/auth/otp/resend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })
      if (response.ok) {
        setCooldownTime(30);
      } else {
        throw new Error('Failed to resend OTP');
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
    }
  };

  return (
    <div className="text-center mt-6 text-sm text-gray-500">
      <p>Didn&apos;t receive code?{' '}
        <button
          className={clsx("font-semibold cursor-default",
                          cooldownTime > 0 ? 'text-blue-400 hover:text-blue-400 cursor-default' : 'text-blue-600 hover:text-blue-500' )}
          onClick={handleResendOtp}
          disabled={cooldownTime > 0}
        >
          {cooldownTime > 0 ? `Resend (${cooldownTime}s)` : 'Resend'}
        </button>
      </p>
    </div>
  )
}