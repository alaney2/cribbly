import Link from 'next/link'

import { Button } from '@/components/catalyst/button'
import { Logo } from '@/components/Logo'
import { SlimLayout } from '@/components/default/SlimLayout'

export default function NotFound() {
  return (
    <SlimLayout heading="Page not found" subHeading=''>
      <div className="flex">
        <Link href={{pathname: '/'}} aria-label="Home" className="cursor-default">
          <Logo className="h-10 w-auto" />
        </Link>
      </div>
      <p className="mt-20 text-sm font-medium text-gray-700">404</p>
      <h1 className="mt-3 text-lg font-semibold text-gray-900">
        Page not found
      </h1>
      <p className="mt-3 text-sm text-gray-700">
        Sorry, we couldn’t find the page you’re looking for.
      </p>
      <Button href="/dashboard" className="mt-10 cursor-default hover:text-gray-200" color="blue">
        Go back home
      </Button>
    </SlimLayout>
  )
}
