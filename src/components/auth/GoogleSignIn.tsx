"use client"
import { signInGoogle } from '@/app/auth/sign-in/google/action'
import { Google } from '@/components/auth/Google'

export function GoogleSignIn() {
  return (
    <button
      type='button'
      onClick={async () => {
        await signInGoogle()
      }}
      className="flex w-full h-10 items-center justify-center gap-3 rounded-md bg-blue-600 shadow-sm px-3 py-1.5 text-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white hover:bg-blue-700 cursor-default"
    >
      <Google />
    </button>
  )
}