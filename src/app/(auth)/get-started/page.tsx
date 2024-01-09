"use client"
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import  CleanURL from '@/components/CleanURL';
import { type Metadata } from 'next'
import { SignUpForm } from '@/components/auth/SignUpForm'
import logo from '@/images/logo-cropped.svg'
import icon from '@/images/icon.png'
import Image from 'next/image'
import { Apple } from '@/components/auth/Apple'
import { Google } from '@/components/auth/Google'
import { signInGoogle } from '@/app/auth/sign-in/google/action'

// export const metadata: Metadata = {
//   title: 'Get started',
// }

export default function SignIn() {
  return (
    <>
      <CleanURL />
      <div className="flex min-h-full flex-1 flex-col sm:justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 sm:bg-gray-100">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* <Link href="/" aria-label="Home">
            <Image
              className='mx-auto h-8 w-auto'
              src={logo}
              alt=""
            />
          </Link> */}
          <h2 className="px-6 sm:px-0 mt-8 sm:mt-10 text-2xl font-medium leading-9 tracking-normal text-gray-900">
            Get started
          </h2>
          <h3 className="text-gray-500 text-sm">
            Create a new account
          </h3>
        </div>

        <div className="sm:mt-6 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-gray-50 px-6 py-6 sm:py-12 sm:shadow sm:rounded-lg sm:px-12">
            <SignUpForm />
            <div>
              <div className="relative mt-10">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                  <span className="bg-gray-50 px-6 text-gray-900">Or sign up with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4">
                <button
                  type='button'
                  onClick={async () => {
                    await signInGoogle()
                  }}
                  className="flex w-full items-center justify-center gap-3 rounded-md bg-white shadow-sm px-3 py-1.5 text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white hover:bg-gray-100 active:text-slate-900 active:bg-gray-200"
                >
                  <Google />
                </button>
                {/* <Link
                  href="#"
                  className="flex w-full items-center justify-center gap-3 rounded-md bg-[#080808] shadow-sm px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#080808]"
                >
                  <Apple />
                </Link> */}
              </div>
            </div>
          </div>

          <p className="sm:mt-10 text-center text-sm text-gray-500">
            Already registered?{' '}
            <a href="/sign-in" className="font-semibold leading-6 text-blue-600 hover:text-blue-500">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
