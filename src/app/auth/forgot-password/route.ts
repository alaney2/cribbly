import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'


export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const formData = await request.formData()
  const email = String(formData.get('email'))
  const supabase = createClient()

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${requestUrl.origin}/update-password`,
  })

  if (error) {
    return NextResponse.redirect(
      `${requestUrl.origin}/forgot-password?error=Could not send reset email`,
      {
        status: 301,
      }
    )
  }

  console.log(data)

  return NextResponse.redirect(
    `${requestUrl.origin}/sign-in?success=If you registered using your email and password, you will receive a password reset email shortly`,
    {
      status: 301,
    }
  )

}

