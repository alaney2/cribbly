'use client'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/Button'

export function OtpInput() {
  const inputsRef = useRef<HTMLInputElement[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)


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
    if (e.key === 'Backspace') {
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
    <form method="POST" className="" autoComplete='off'>
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
            name={`otp${index}`}
            maxLength={1}
            onInput={(e) => handleInput(index, e)}
            onKeyDown={(e) => handleKeyPress(index, e)}
            onPaste={handlePaste}
            pattern="[0-9]*"
            inputMode="numeric"
            autoComplete='off'
            required
          />
        ))}
      </div>
      <Button
        id="submitButton"
        formAction="/auth/otp"
        type="submit"
        variant="solid"
        color={isSubmitting ? 'lightblue' : 'blue'}
        className="w-full mt-6 h-10"
      >
        {isSubmitting ? <Spinner /> : 'Submit'}
      </Button>
    </form>
  )
}

function Spinner() {
  return (
    <svg className='animate-spin' fill="#fff" width="20px" height="20px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M2.39,8.13a5.47,5.47,0,0,1,.18-1.39l.16-.66L1.42,5.74l-.17.66a7,7,0,0,0,.08,3.73l.19.65,1.3-.39-.19-.65A5.46,5.46,0,0,1,2.39,8.13Zm2.18,4.39L4,12.12l-.83,1.07.55.42a6.76,6.76,0,0,0,3.48,1.32l.67.07L8,13.64l-.67-.06A5.56,5.56,0,0,1,4.57,12.52ZM14.4,5.37A7.05,7.05,0,0,0,5.16,1.63h0A6.92,6.92,0,0,0,2.77,3.28L4,4.48A5.32,5.32,0,1,1,10,13l.68,1.6A7.06,7.06,0,0,0,14.4,5.37Z"></path> </g> </g></svg>
  )
}
