'use client'
import { useEffect, useRef } from 'react'
import { Button } from '@/components/Button'

export function OtpInput() {
  const inputsRef = useRef<HTMLInputElement[]>([])
  const tokenFieldRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const otp = inputsRef.current.map(input => input.value).join('');
    if (tokenFieldRef.current) {
      tokenFieldRef.current.value = otp;
      // Submit your form here or trigger any further action required
    }
  }

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

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  return (
    <form method="POST" className="">
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
      {/* <input type="hidden" ref={tokenFieldRef} name="token" /> */}
      <Button
        formAction="/auth/otp"
        type="submit"
        variant="solid"
        color="blue"
        className="w-full mt-12"
      >
        Verify Account
      </Button>
    </form>
  )
}
