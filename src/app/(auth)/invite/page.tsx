'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

function Invite() {
  const searchParams = useSearchParams()
  const propertyId = searchParams.get('property')
  const token = searchParams.get('token')
  const email = searchParams.get('email')
  const name = searchParams.get('name')
  const router = useRouter()

  if (!propertyId || !token || !email) {
    router.push('/')
  }

  return (
    <>
      <div className="w-full h-full flex justify-center items-center">
        Invite
      </div>
    </>
  )
}

export default function InvitePage() {
  return (
    <Suspense>
      <Invite />
    </Suspense>
  )
}
