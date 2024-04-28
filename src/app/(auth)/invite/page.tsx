'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Input } from '@/components/ui/input'

export default function InvitePage() {
  const searchParams = useSearchParams()
  const propertyId = searchParams.get('propertyId')
  const token = searchParams.get('token')
  const email = searchParams.get('email')
  const name = searchParams.get('name')
  console.log(propertyId, token, email, name)

  return (
    <Suspense>
      <div className="w-full h-full flex justify-center items-center">
        Invite
</div>
    </Suspense>
  )
}