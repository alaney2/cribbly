'use client'
import { useSearchParams } from 'next/navigation'


export default function InvitePage() {
  const searchParams = useSearchParams()
  const propertyId = searchParams.get('propertyId')
  const token = searchParams.get('token')
  const email = searchParams.get('email')
  const name = searchParams.get('name')
  console.log(propertyId, token, email, name)
  return (
    <>
      <div>Invite</div>
    </>
  )
}