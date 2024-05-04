import { createClient } from '@/utils/supabase/server'
import { Account } from '@/components/Dashboard/Account'
import { redirect } from 'next/navigation'

export default async function DashboardAccount({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Account />
      {children}
    </>
  )
}