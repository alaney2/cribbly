'use client'
import { TextField, SelectFieldNew } from '@/components/Fields'
import { Button } from '@/components/Button'
import clsx from 'clsx'
import { useSearchParams } from 'next/navigation'

export function OtpForm() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  return (
    <form method="POST" className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
      <div className="col-span-full">
        {/* <TextField 
          type="hidden"
          name="email"
          label=""
        /> */}
        <input type="hidden" name="email" value={email!} />
        <TextField
          label="OTP"
          name="token"
          type="text"
          placeholder='Enter your OTP'
          required
        />
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
  )
}