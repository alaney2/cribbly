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
      className="flex w-full items-center justify-center gap-3 rounded-md bg-white shadow-sm px-3 py-1.5 text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white hover:bg-gray-100 active:text-slate-900 active:bg-gray-200"
    >
      <Google />
    </button>
  )
}