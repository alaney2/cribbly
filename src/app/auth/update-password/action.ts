"use server"
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'


export async function updatePassword(code: string, formData: FormData) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const password = String(formData.get('password'))
  
  supabase.auth.exchangeCodeForSession(code)

  const { data, error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    console.log('error', error)

    redirect('/sign-in?error=Could not update password')
  }

  console.log(data)

  redirect('/sign-in?success=Your password has been updated')
}

