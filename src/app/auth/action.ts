"use server"
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'


export async function signInWithOtp(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const email = String(formData.get('email'))

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email.toLowerCase())) {
    console.error('Invalid email format');
    return
  }

  const { data, error } = await supabase.auth.signInWithOtp({
    email: email,
  })
}

