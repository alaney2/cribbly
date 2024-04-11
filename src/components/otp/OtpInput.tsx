'use client'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/default/Button'
import { Spinner } from '@/components/Spinner'
import { verifyOtp } from '@/app/auth/otp/action'
import { Input } from '@/components/ui/input'
// @ts-expect-error
import { useFormState } from 'react-dom'

export function OtpInput({ email }: { email: string } ) {
  const inputsRef = useRef<HTMLInputElement[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const verifyOtpWithEmail = verifyOtp.bind(null, email)
  const [state, formAction] = useFormState(verifyOtpWithEmail, { message: '' })

  useEffect(() => {
    setIsSubmitting(false);
  }, [state]);

  const checkAndSubmit = () => {
    if (state?.message !== '') {
      return;
    }
    const allFilled = inputsRef.current.every(input => input.value !== '');
    if (allFilled) {
      document.getElementById('submitButton')?.click();
      setIsSubmitting(true)
    }
  }

  const handleKeyPress = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    const currentInput = inputsRef.current[index];
    if (e.key === '-' || e.key === '+') {
      e.preventDefault();
      return;
    }
    
    if (e.key === 'Backspace' || e.key === 'Delete') {
      if (currentInput.value.length !== 0) {
        currentInput.value = '';
      } else if (index > 0) {
        inputsRef.current[index - 1].value = '';
        inputsRef.current[index - 1].focus();
      }
    }

    if (/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      currentInput.value = e.key;
      if (index < 5) {
        inputsRef.current[index + 1].focus();

      }
    }

    if (e.key === 'ArrowRight' && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1].focus();
    }
  
    if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1].focus();
    }

    checkAndSubmit();
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
    <>
    <form action={formAction} className="" autoComplete='off'>
      <div className="flex justify-center space-x-2 mt-10 mb-4" onPaste={handlePaste}>
        {[...Array(6)].map((_, index) => (
          <Input
            key={index}
            ref={el => {
              if (el) {
                inputsRef.current[index] = el;
              }
            }}
            className="w-10 h-12 ring-1 ring-inset ring-gray-100 focus:ring-blue-300 text-center text-lg rounded-md caret-transparent"
            type="number"
            pattern="[0-9]*"
            inputMode='numeric'
            min="0"
            max="9"
            name={`otp${index}`}
            maxLength={1}
            onKeyDown={(e) => handleKeyPress(index, e)}
            onPaste={handlePaste}
            autoComplete='off'
            required
          />
        ))}
      </div>
      {state?.message && <p className="text-red-500 text-xs text-center">{state.message}</p>}
      <Button
        id="submitButton"
        type="submit"
        variant="solid"
        color={isSubmitting ? 'lightblue' : 'blue'}
        className="w-full h-10 mt-2"
        onClick={() => {
          if (inputsRef.current.every(input => input.value !== '')) {
            setIsSubmitting(true)
          }
        }}
      >
        {isSubmitting ? <Spinner /> : 'Submit'}
      </Button>
    </form>
    </>
  )
}
