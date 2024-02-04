import Link from 'next/link'

import { Button } from '@/components/default/Button'
import { TextField } from '@/components/default/Fields'
import { Logo } from '@/components/Logo'
import { type Metadata } from 'next'
import icon from '@/images/icon.png'
import logo from '@/images/logo-cropped.svg'
import Image from 'next/image'
import { Notification } from '@/components/Notification'

export const metadata: Metadata = {
  title: 'Forgot password',
}

export default function ForgotPassword() {
  return (
    <>
      <Notification />
      <div className="flex min-h-full flex-1 flex-col sm:justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 sm:bg-gray-100">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/" aria-label="Home">

            <Image
              className='h-8 mx-auto w-auto'
              src={logo}
              alt=""
              // unoptimized
              // priority={false}
            />
          </Link>
          <h2 className="px-6 sm:px-0 mt-8 sm:mt-10 text-2xl font-medium leading-9 tracking-tight text-gray-900">
            Reset your password
          </h2>
          <h3 className="px-6 sm:px-0 text-gray-500 text-sm">
            Type in your email for a password reset link
          </h3>
        </div>

        <div className="sm:mt-6 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-gray-50 px-6 py-6 sm:py-12 sm:shadow sm:rounded-lg sm:px-12">
            <form className="space-y-6" action="/auth/forgot-password" method="POST">
              <div>
                <div className="mt-2">
                  <TextField
                    label="Email address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder='you@example.com'
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-1 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center mt-6">
                  <span className="bg-white px-2 text-sm text-gray-500"></span>
                </div>
              </div>

              <div>
                <Button type="submit" variant="solid" color="blue" className="w-full">
                  <span>
                    Send reset email <span aria-hidden="true">&rarr;</span>
                  </span>
                </Button>
              </div>
            </form>

            
          </div>

          <p className="sm:mt-10 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <a href="/sign-in" className="font-semibold leading-6 text-blue-600 hover:text-blue-500">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
