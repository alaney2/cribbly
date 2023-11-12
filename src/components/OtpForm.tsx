'use client'
import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import clsx from 'clsx'
import { Button } from '@/components/Button'

export function OtpForm() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const inputsRef = useRef([]);

  const handleInput = (index, e) => {
    if (e.target.value.length === 1 && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  }

  const handleBackspace = (index, e) => {
    if (e.key === 'Backspace' && e.target.value.length === 0 && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  }

  const handlePaste = (e) => {
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

  useEffect(() => {
    inputsRef.current[0].focus();
  }, []);

  return (
    <>
    <form method="POST" className="">
      <div className="flex flex-col space-y-4">
        <input type="hidden" name="email" value={email!} />
        <div className="flex justify-center space-x-2" onPaste={handlePaste}>
          {[...Array(6)].map((_, index) => (
            <input
              key={index}
              ref={el => inputsRef.current[index] = el}
              className="w-10 h-12 border-1 border-gray-300 text-center rounded-md"
              type="text"
              name={`otp${index}`}
              maxLength="1"
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
          className="w-full"
        >
          Verify OTP
        </Button>
      </div>
    </form>
    </>
  )
}
