'use client'
import { TextField, SelectFieldNew } from '@/components/default/Fields'
import { Button } from '@/components/default/Button'
import { useState } from 'react'
import clsx from 'clsx'
import { UnfilledCheck, FilledCheck, OpenEye, ClosedEye } from '@/components/auth/PasswordChecks'

const checkClasses = 'flex items-center gap-1 space-x-1.5 transition duration-200 text-foreground-lighter'

export function UpdatePasswordForm() {
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
    <form method="POST" className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
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
      {/* <SelectFieldNew
        className="col-span-full"
        label="How did you hear about us?"
        name="referral_source"
        optional={true}
        options={["Select option", "Word of mouth", 'Google Ads', 'Facebook Ads']}
      /> */}
      <div className={clsx("col-span-full transition-all duration-500 ease-in-out overflow-y-hidden text-gray-600", isPasswordFocused ? "opacity-100 max-h-[500px]" : "opacity-0 max-h-0")}>
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
      <div className="col-span-full">
        <Button formAction="/auth/update-password" type="submit" variant="solid" color="blue" 
          className={clsx('w-full ease-out duration-200 outline-none transition-all', isButtonEnabled ? 'brightness-100' : 'brightness-75')} 
          disabled={!isButtonEnabled}
        >
          <span>
            Sign up <span aria-hidden="true">&rarr;</span>
          </span>
        </Button>
      </div>
    </form>
)}