import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function CurrentProperty() {
  const supabase = createClient()
  let { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/sign-in')
  }
  return (
    <>
      <div className="p-6 md:p-8" style={{ height: 'calc(100vh - 48px)' }}>
        Hello World
      </div>
    </>
  )
}