'use client'

import { useSearchParams } from 'next/navigation'
import { XCircleIcon, CheckCircleIcon } from '@heroicons/react/20/solid'

export default function Messages() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const message = searchParams.get('message')

  return (
    <>
      {error && (
        <div className="flex-col col-span-full">
          <div className="bg-red-50 rounded-xl p-3 text-center">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3 md:justify-between text-sm">
                <p className="text-red-800 bg-foreground/10 text-foreground text-center">
                  {error}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {message && (
        <div className="flex-col col-span-full">
          <div className="bg-green-50 rounded-xl p-3 text-center mt-2">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
              </div>
              <div className="ml-3 md:justify-between text-sm">
                <p className="text-green-800 bg-foreground/10 text-foreground text-center">
                  {message}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}