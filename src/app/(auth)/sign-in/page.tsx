import Link from 'next/link'
import { Button } from '@/components/catalyst/button'
import { TextField } from '@/components/default/Fields'
import { type Metadata } from 'next'
import logo from '@/images/logo-cropped.svg'
import Image from 'next/image'
import { Apple } from '@/components/auth/Apple'
import { GoogleSignIn } from '@/components/auth/GoogleSignIn'
import { Notification } from '@/components/Notification'
import { SlimLayout } from '@/components/default/SlimLayout'
import { signInWithOtp } from '@/app/auth/action'

export const metadata: Metadata = {
  title: 'Sign in',
}

export default function SignIn() {
  return (
    <SlimLayout>
      <Notification />
      {/* <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50"> */}
        <div className="sm:w-full sm:max-w-md">
          <Image
            className='h-7 w-auto'
            src={logo}
            alt=""
            unoptimized
            priority={false}
          />
          <h2 className="mt-12 text-lg font-semibold text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="sm:mt-4 sm:mx-auto">
          <div className="">
            <form className="space-y-6" action={signInWithOtp}>
              <div>
                <div className="mt-2">
                  <TextField
                    label=""
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder='Enter your email address...'
                    required
                  />
                </div>
              </div>

              <div>
                <Button type="submit" color="blue" className="w-full cursor-default">
                  <span>
                    Continue
                  </span>
                </Button>
              </div>
            </form>

            <div>
              <div className="relative mt-10">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                  {/* <span className="bg-gray-50 px-6 text-gray-900">Or continue with</span> */}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4">
                <GoogleSignIn />
              </div>
            </div>
          </div>
        </div>
      {/* </div> */}
    </SlimLayout>
  )
}
