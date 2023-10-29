'use client'

import { useSearchParams } from 'next/navigation'
import { XCircleIcon } from '@heroicons/react/20/solid'

export default function Messages() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const message = searchParams.get('message')
  return (error || message) &&(
    <div className="flex-col">
      <div className="bg-red-50 rounded-xl p-3 text-center">
        <div className="flex">
          <div className="flex-shrink-0">
            <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>

          <div className="ml-3 md:justify-between text-sm">
            {error && (
              <p className="text-red-800 bg-foreground/10 text-foreground text-center">
                {error}
              </p>
            )}
            {message && (
              <p className="text-red-800 bg-foreground/10 text-foreground text-center">
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}