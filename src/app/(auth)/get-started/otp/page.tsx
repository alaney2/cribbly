import { OtpForm } from '@/components/otp/OtpForm'
import Link from 'next/link'

import { Button } from '@/components/default/Button'
import { TextField } from '@/components/default/Fields'
import { Logo } from '@/components/Logo'
import { type Metadata } from 'next'
import { CleanURL } from '@/components/CleanURL';
import icon from '@/images/icon.png'
import logo from '@/images/logo-cropped.svg'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Verify email',
}

export default function SignIn() {
  return (
    <>
      <CleanURL />
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 sm:bg-gray-100">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/" aria-label="Home">
            <Image
              // className="absolute inset-0 h-full w-full object-cover"
              className='mx-auto h-10 sm:h-12 w-auto'
              src={logo}
              alt=""
              // unoptimized
              // priority={false}
            />
          </Link>

        </div>

        <div className="mt-8 sm:mt-16 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-gray-50 px-6 py-12 sm:shadow sm:rounded-lg sm:px-12">
            <OtpForm />
          </div>
        </div>
      </div>
    </>
  )
}

