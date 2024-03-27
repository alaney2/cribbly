import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardAccount() {
  const supabase = createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in')
  }

  return (
    <>
      <div className="p-6 md:p-8" style={{ height: 'calc(100vh - 48px)' }}>
        Account details
        {user.email}
      </div>
    </>
  )
}