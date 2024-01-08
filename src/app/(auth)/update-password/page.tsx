"use client"
import Link from 'next/link'

import  CleanURL from '@/components/CleanURL';
import { type Metadata } from 'next'
import logo from '@/images/logo-cropped.svg'
import Image from 'next/image'
import { TextField, SelectFieldNew } from '@/components/Fields'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/Button'
import Messages from '@/components/auth/Messages'
import { useState } from 'react'
import clsx from 'clsx'
import { UnfilledCheck, FilledCheck, OpenEye, ClosedEye } from '@/components/auth/PasswordChecks'

import { updatePassword } from '@/app/auth/update-password/action';

const checkClasses = 'flex items-center gap-1 space-x-1.5 transition duration-200 text-foreground-lighter'

export default function UpdatePassword() {
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  const updatePasswordWithCode = updatePassword.bind(null, code!)

  const [password, setPassword] = useState('')
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)

  const [isButtonEnabled, setIsButtonEnabled] = useState(false)
  const [hasUpperCase, setHasUpperCase] = useState(false)
  const [hasLowerCase, setHasLowerCase] = useState(false)
  const [hasNumber, setHasNumber] = useState(false)
  const [hasSpecialChar, setHasSpecialChar] = useState(false)
  const [hasMinLength, setHasMinLength] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    setHasUpperCase(/[A-Z]/.test(newPassword))
    setHasLowerCase(/[a-z]/.test(newPassword))
    setHasNumber(/[0-9]/.test(newPassword))
    setHasSpecialChar(/[!?<>@#$%]/.test(newPassword))
    setHasMinLength(newPassword.length >= 8)

    if (newPassword.length >= 8) {
      setIsButtonEnabled(true)
    } else {
      setIsButtonEnabled(false)
    }
  };

  return (
    <>
      {/* <CleanURL /> */}
      <div className="flex min-h-full flex-1 flex-col sm:justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 sm:bg-gray-100">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/" aria-label="Home">
            <Image
              className='mx-auto h-8 w-auto'
              src={logo}
              alt=""
            />
          </Link>
          <h2 className="px-6 sm:px-0 mt-8 sm:mt-10 text-2xl font-medium leading-9 tracking-normal text-gray-900">
            Update password
          </h2>
          <h3 className="text-gray-500 text-sm">
            Don&apos;t forget it this time
          </h3>
        </div>

        <div className="sm:mt-6 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-gray-50 px-6 py-6 sm:py-12 sm:shadow sm:rounded-lg sm:px-12">
            <form className="space-y-3" action={updatePasswordWithCode}>
              <div className="relative col-span-full">
                <TextField
                  className="col-span-full"
                  label="Password"
                  name="password"
                  type={isPasswordVisible ? "text" : "password"}
                  autoComplete="new-password"
                  id="new-password"
                  placeholder='••••••••'
                  onChange={handlePasswordChange}
                  onFocus={() => setIsPasswordFocused(true)}
                  required
                />
                <div className="absolute inset-y-0 right-0 top-8 pl-3 pr-1 flex space-x-1 items-center">
                  <button onClick={() => setIsPasswordVisible(!isPasswordVisible)} type="button" className="relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none border bg-gray-50 hover:bg-gray-100 shadow-sm text-xs px-2.5 py-1 !mr-1">
                    {isPasswordVisible ? <ClosedEye /> : <OpenEye />}
                  </button>
                </div>
              </div>
              <div className={clsx("col-span-full transition-all duration-500 ease-in-out  overflow-y-hidden text-gray-600", isPasswordFocused ? "opacity-100 max-h-[500px]" : "opacity-0 max-h-0")}>
                <div className="text-sm">
                  <div className={checkClasses}>
                    {hasUpperCase ? <FilledCheck /> : <UnfilledCheck />}
                    <p className="text-sm">Uppercase letter</p>
                  </div>
                  <div className={checkClasses}>
                    {hasLowerCase ? <FilledCheck /> : <UnfilledCheck />}
                    <p className="text-sm">Lowercase letter</p>
                  </div>
                  <div className={checkClasses}>
                    {hasNumber ? <FilledCheck /> : <UnfilledCheck />}
                    <p className="text-sm">Number</p>
                  </div>
                <div className={checkClasses}>
                  {hasSpecialChar ? <FilledCheck /> : <UnfilledCheck />}
                  <p className="text-sm">Special character (e.g. !?&lt;&gt;@#$%)</p>
                </div>
                <div className={checkClasses}>
                  {hasMinLength ? <FilledCheck /> : <UnfilledCheck />}
                  <p className="text-sm">&ge; 8 characters</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-1 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-2 text-sm text-gray-500 mb-4"></span>
                </div>
              </div>
              
              <div className="col-span-full">
                <Button 
                  variant="solid"
                  color="blue" 
                  className={clsx('w-full ease-out duration-200 outline-none transition-all', isButtonEnabled ? 'brightness-100' : 'brightness-75')} 
                  disabled={!isButtonEnabled}
                >
                  <span>
                    Set new password <span aria-hidden="true">&rarr;</span>
                  </span>
                </Button>
              </div>
              <Messages />
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
