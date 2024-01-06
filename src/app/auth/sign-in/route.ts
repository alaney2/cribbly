import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const formData = await request.formData()
  const email = String(formData.get('email'))
  const password = String(formData.get('password'))
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  // console.log(data)

  if (error) {
    return NextResponse.redirect(
      `${requestUrl.origin}/sign-in?error=Could not authenticate user`,
      {
        // a 301 status is required to redirect from a POST to a GET route
        status: 301,
      }
    )
  }

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

  return NextResponse.redirect(requestUrl.origin, {
    // a 301 status is required to redirect from a POST to a GET route
    status: 301,
  })
}