import Dashboard from '@/components/Dashboard'
import { Suspense } from 'react'
import { Notification } from '@/components/Notification'

export default async function Home() {
  return (
    <>
      <Suspense>
        <Notification />
      </Suspense>
      <Dashboard />
    </>
  )
}