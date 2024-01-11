import Dashboard from '@/components/Dashboard'
import { Notification } from '@/components/Notification'

export default async function Home() {
  return (
    <>
      <Notification />
      <Dashboard />
    </>
  )
}