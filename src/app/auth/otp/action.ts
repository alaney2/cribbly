"use server"
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'


export async function verifyOtp(email: string, prevState: any, formData: FormData) {

  let token = '';
  for (let i = 0; i < 6; i++) {
    const otpPart = String(formData.get(`otp${i}`));
    if (otpPart !== null) {
      token += otpPart;
    }
  }

  if (token && email) {
    const supabase = createClient()
    const { data: {user}, error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });

    if (error) {
      return {
        message: 'Please enter a valid verification code'
      }
    }

    // Handle successful verification
    if (user) {
      const show_welcome = await supabase
        .from('users')
        .select('welcome_screen')
        .eq('id', user?.id)
        .single()

      if (show_welcome) {
        redirect('/welcome')
      }

      redirect('/dashboard')
    }
  }
  return {
    message: 'Invalid email or verification code'
  }
}