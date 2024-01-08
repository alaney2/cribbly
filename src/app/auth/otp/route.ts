import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const formData = await request.formData()
  const cookieStore = cookies()

  const email = cookieStore.get('email')?.value

  let token = '';
  for (let i = 0; i < 6; i++) {
    const otpPart = String(formData.get(`otp${i}`));
    if (otpPart !== null) {
      token += otpPart;
    }
  }

  if (token && email) {
    const supabase = createClient(cookieStore)
    const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });

    if (error) {
      return NextResponse.redirect(
        `${requestUrl.origin}/get-started/otp?error=Invalid verification code`,
        {
          // a 301 status is required to redirect from a POST to a GET route
          status: 301,
        }
      );
    }

    // Handle the successful verification
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
      return NextResponse.redirect(
        `${requestUrl.origin}/dashboard`,
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