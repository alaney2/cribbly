import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)

  const data = await request.json()
  const email = data.email

  if (email) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    })

    if (error) {
      return NextResponse.redirect(
        `${requestUrl.origin}/get-started/otp?error=Could not resend code`,
        {
          // a 301 status is required to redirect from a POST to a GET route
          status: 301,
        }
      );
    }

  }

  return NextResponse.redirect(
    `${requestUrl.origin}/get-started?error=Invalid email`,
    {
      // a 301 status is required to redirect from a POST to a GET route
      status: 301,
    }
  )
}