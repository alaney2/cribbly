import '@/styles/no-overscroll.css'
import { createClient } from '@/utils/supabase/server'
import { Account } from '@/components/Dashboard/Account'
import { redirect } from 'next/navigation'

export default async function DashboardAccount() {
  // const supabase = createClient()
  // const { data: { user } } = await supabase.auth.getUser()

  // if (!user) {
  //   redirect('/sign-in')
  // }

  // const { data, error } = await supabase.from('users')
  //   .select()
  //   .eq('id', user?.id)
  //   .single()

  // if (error) {
  //   redirect('/sign-in')
  // }

  // console.log('data', data)

  return (
    <>
      {/* <Account /> */}
    </>
  )
}