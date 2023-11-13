import Link from 'next/link'

import { Button } from '@/components/Button'
import { TextField } from '@/components/Fields'
import { Logo } from '@/components/Logo'
import { type Metadata } from 'next'
import  CleanURL from '@/components/CleanURL';
import icon from '@/images/icon.png'
import logo from '@/images/logo-cropped.svg'
import Image from 'next/image'
import { Apple } from '@/components/auth/Apple'
import { Google } from '@/components/auth/Google'

export const metadata: Metadata = {
  title: 'Sign in',
}

export default function SignIn() {
  return (
    <>
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
          <h2 className="px-6 sm:px-0 mt-8 sm:mt-10 text-xl font-semibold leading-9 tracking-tight text-gray-900">
            Welcome back
          </h2>
        </div>

        <div className="sm:mt-6 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-gray-50 px-6 py-6 sm:py-12 sm:shadow sm:rounded-lg sm:px-12">
            <form className="space-y-6" action="/auth/sign-in" method="POST">
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

              <div>
                <div className="mt-2">
                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder='••••••••'
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="invisible flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label htmlFor="remember-me" className="ml-3 block text-sm leading-6 text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm leading-6">
                  <a href="#" className="font-semibold text-blue-600 hover:text-blue-500">
                    Forgot password?
                  </a>
                </div>
              </div>

              <div>
                <Button type="submit" variant="solid" color="blue" className="w-full">
                  <span>
                    Sign in <span aria-hidden="true">&rarr;</span>
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
                  <span className="bg-gray-50 px-6 text-gray-900">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
              <Link
                href="#"
                className="flex w-full items-center justify-center gap-3 rounded-md bg-[#fff] shadow-sm px-3 py-1.5 text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fff]"
              >
                <Google />
              </Link>

                <Link
                  href="#"
                  className="flex w-full items-center justify-center gap-3 rounded-md bg-[#080808] shadow-sm px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#080808]"
                >
                  <Apple />
                </Link>
              </div>
            </div>
          </div>

          <p className="sm:mt-10 text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <a href="/get-started" className="font-semibold leading-6 text-blue-600 hover:text-blue-500">
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
