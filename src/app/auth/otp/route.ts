import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const formData = await request.formData()
  const email = String(formData.get('email'))
  const token = String(formData.get('token'))

  console.log('email', email)
  console.log('token', token)

  if (token && email) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Verify the OTP token
    const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });

    if (error) {
      // Handle the error, e.g., display an error message or log it
      // You can also redirect the user to an error page if needed
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=Could not authenticate user`,
        {
          // a 301 status is required to redirect from a POST to a GET route
          status: 301,
        }
      );
    }

    // Handle the successful verification
    // For example, you might want to log the user in or redirect to a success page
    // This depends on your application's flow
    return NextResponse.redirect(
      requestUrl.origin,
      {
        // a 301 status is required to redirect from a POST to a GET route
        status: 301,
      }
    );
  }

  return NextResponse.redirect(
    `${requestUrl.origin}/get-started/otp?error=Invalid code`,
    {
      // a 301 status is required to redirect from a POST to a GET route
      status: 301,
    }
  )
}