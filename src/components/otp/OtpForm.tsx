import clsx from 'clsx'
import { Button } from '@/components/default/Button'
import { cookies } from 'next/headers'
import { OtpResend } from '@/components/otp/OtpResend'
import { OtpInput } from '@/components/otp/OtpInput'

export function OtpForm() {
  const cookieStore = cookies()
  const email = cookieStore.get('email')?.value

  if (!email) {
    return null;
  }

  const formatEmail = (email: string | string[] | null | undefined) => {
    if (email) {
      const atIndex = email.indexOf('@');
      if (atIndex > 7) {
        return `${email.slice(0, 3)}***${email.slice(atIndex - 2, atIndex)}${email.slice(atIndex)}`;
      }
      return email;
    }
    return '';
  };

  return (
    <>
      <div className="text-center mb-4 text-sm text-gray-400">
        <p>We have sent a verification code to your email</p>
        <p>{formatEmail(email)}</p>
      </div>
      <div className="flex flex-col">
        {/* <input type="hidden" name="email" value={email} /> */}
        <OtpInput />
        <OtpResend email={email!} />
      </div>
    </>
  )
}
