import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'


export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const formData = await request.formData()
  const email = String(formData.get('email'))
  const password = String(formData.get('password'))
  const cookieStore = cookies()
  const supabase = createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        welcome_screen: true
      }
    }
  })

  if (error) {
    return NextResponse.redirect(
      `${requestUrl.origin}/get-started?error=Could not sign up. Please check if you already have an account`,
      {
        status: 301,
      }
    )
  }

  cookieStore.set({
    name: 'email',
    value: email,
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 // 1 hour
  })

  return NextResponse.redirect(
    `${requestUrl.origin}/get-started/otp`,
    {
      status: 301,
    }
  )
}