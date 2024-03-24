import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'


export async function POST(request: Request) {
  const requestUrl = new URL(request.url)

  const data = await request.json()
  const email = data.email

  if (email) {
    const supabase = createClient()

    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    })

    if (error) {
      return NextResponse.redirect(
        `${requestUrl.origin}/get-started?error=Could not resend code`,
        {
          status: 301,
        }
      );
    }

  }

  return NextResponse.redirect(
    `${requestUrl.origin}/get-started?error=Invalid email`,
    {
      status: 301,
    }
  )
}