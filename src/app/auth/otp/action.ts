"use server"
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'


export async function verifyOtp(formData: FormData) {
  const email = String(formData.get('email'))
  let token = '';
  for (let i = 0; i < 6; i++) {
    const otpPart = String(formData.get(`otp${i}`));
    if (otpPart !== null) {
      token += otpPart;
    }
  }

  if (token && email) {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });

    if (error) {
      throw new Error('Invalid verification code')
      return {
        message: 'Please enter a valid verification code'
      }
    }

    // Handle successful verification
    if (user) {
      if (user.user_metadata.role && user.user_metadata.role === 'tenant') {
        redirect('/tenant-dashboard')
      } else {
        const { data: show_welcome } = await supabase
          .from('users')
          .select('welcome_screen')
          .eq('id', user?.id)
          .single()

        const welcome_screen = show_welcome?.welcome_screen

        if (welcome_screen) {
          redirect('/welcome')
        }

        redirect('/dashboard')
      }
    }
  } else {
    throw new Error('Invalid verification code') 
    return {
      message: 'Invalid email or verification code'
    }
  }
}