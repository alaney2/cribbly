'use client'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/default/Button'
import { Spinner } from '@/components/Spinner'
import { verifyOtp } from '@/app/auth/otp/action'

export function OtpInput({ email }: { email: string } ) {
  const inputsRef = useRef<HTMLInputElement[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const verifyOtpWithEmail = verifyOtp.bind(null, email)

  const checkAndSubmit = () => {
    const allFilled = inputsRef.current.every(input => input.value !== '');
    if (allFilled) {
      setIsSubmitting(true)
      document.getElementById('submitButton')?.click();
    }
  }

  const handleInput = (index: number, e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;

    if (!/^[0-9]$/.test(value)) {
      target.value = '';
      return;
    }

    if (target.value.length >= 1 && index < 5) {
      inputsRef.current[index + 1].focus();
    }
    checkAndSubmit();
  }

  const handleKeyPress = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    const currentInput = inputsRef.current[index];
    if (e.key === 'Backspace' || e.key === 'Delete') {
      if (currentInput.value.length !== 0) {
        // Clear the current input value
        currentInput.value = '';
      } else if (index > 0) {
        // Focus the previous input if the current one is already empty
        inputsRef.current[index - 1].focus();
      }
    }

    if (currentInput.value.length === 1 && /^[0-9]$/.test(e.key)) {
      currentInput.value = e.key;
    }

    if (e.key === 'ArrowRight' && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1].focus();
    }
  
    if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (pasteData.length === 6) {
      pasteData.split('').forEach((value, index) => {
        inputsRef.current[index].value = value;
        if (index < 5) {
          inputsRef.current[index + 1].focus();
        }
      });
      checkAndSubmit();
    }
  }

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  return (
    <form action={verifyOtpWithEmail} className="" autoComplete='off'>
      <div className="flex justify-center space-x-2 mt-10 mb-8" onPaste={handlePaste}>
        {[...Array(6)].map((_, index) => (
          <input
            key={index}
            ref={el => {
              if (el) {
                inputsRef.current[index] = el;
              }
            }}
            className="w-10 h-12 border-1 border-gray-300 text-center rounded-md caret-transparent focus:border-blue-300"
            type="text"
            min="0"
            name={`otp${index}`}
            maxLength={1}
            onInput={(e) => handleInput(index, e)}
            onKeyDown={(e) => handleKeyPress(index, e)}
            onPaste={handlePaste}
            autoComplete='off'
            required
          />
        ))}
      </div>
      <Button
        id="submitButton"
        type="submit"
        variant="solid"
        color={isSubmitting ? 'lightblue' : 'blue'}
        className="w-full h-10"
      >
        {isSubmitting ? <Spinner /> : 'Submit'}
      </Button>
    </form>
  )
}
