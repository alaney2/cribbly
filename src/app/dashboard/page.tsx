import Dashboard from '@/components/Dashboard'
import { Suspense } from 'react'
import { Notification } from '@/components/Notification'
import "animate.css"

export default async function Home() {
  return (
    <>
      <Dashboard />
      {/* <Suspense>
        <Notification />
      </Suspense> */}
    </>
  )
}