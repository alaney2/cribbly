"use server"
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'


export async function verifyOtp(email: string, prevState: any, formData: FormData) {
  const cookieStore = cookies()

  let token = '';
  for (let i = 0; i < 6; i++) {
    const otpPart = String(formData.get(`otp${i}`));
    if (otpPart !== null) {
      token += otpPart;
    }
  }

  if (token && email) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });

    if (error) {
      // redirect('/get-started/otp?error=Invalid verification code')
      return {
        message: 'Please enter a valid verification code'
      }
    }

    // Handle successful verification
    if (data) {
      const user = {
        id: data?.user?.id,
        email: data?.user?.email,
      }

      cookieStore.set({
        name: 'currentUser',
        value: JSON.stringify(user),
        path: '/',
        httpOnly: true,
        secure: true,
      })

      cookieStore.delete('email');
      
      if (!data?.user?.user_metadata?.welcome_screen || data?.user?.user_metadata?.welcome_screen === true) {
        redirect('/welcome')
      }

      redirect('/dashboard')
    }
  }
  return {
    message: 'Invalid email or verification code'
  }
}