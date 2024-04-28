'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'


export default function InvitePage() {
  const searchParams = useSearchParams()
  const propertyId = searchParams.get('propertyId')
  const token = searchParams.get('token')
  const email = searchParams.get('email')
  const name = searchParams.get('name')
  console.log(propertyId, token, email, name)
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <div>Invite</div>
      </Suspense>
    </>
  )
}