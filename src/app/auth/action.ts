"use server"
import { createClient } from '@/utils/supabase/server'


export async function signInWithOtp(formData: FormData) {
  const supabase = createClient()

  const email = String(formData.get('email'))
  const full_name = String(formData.get('fullName'))
  const role = String(formData.get('role'))
  console.log(email, full_name, role)
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email.toLowerCase())) {
    return
  }

  const data: { full_name?: string; role?: string } = {}

  if (full_name) {
    data.full_name = String(full_name)
  }

  if (role) {
    data.role = String(role)
  }

  console.log('DATA', data)

  const { data: supabaseData, error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      data: data
    }
  })
}

