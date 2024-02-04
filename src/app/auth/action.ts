"use server"
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'


export async function signInWithOtp(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const email = String(formData.get('email'))
  const { data, error } = await supabase.auth.signInWithOtp({
    email: email,
  })
  console.log(data, error)
  // redirect('/sign-in?success=Your password has been updated')
}

