import Link from 'next/link'

import { Button } from '@/components/Button'
import { TextField, SelectFieldNew } from '@/components/Fields'
import { Logo } from '@/components/Logo'
import { SlimLayout } from '@/components/SlimLayout'
import  CleanURL from '@/components/CleanURL';
import { type Metadata } from 'next'
import { OtpForm } from '@/components/OtpForm'

export const metadata: Metadata = {
  title: 'Get started',
}

export default function Register() {

  return (
    <SlimLayout>
      <CleanURL />
      <div className="flex">
        <Link href="/" aria-label="Home">
          <Logo className="h-10 w-auto" />
        </Link>
      </div>
      < OtpForm />
    </SlimLayout>
  )
}
