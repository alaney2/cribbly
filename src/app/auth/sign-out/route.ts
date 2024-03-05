"use server"
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'


export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const cookieStore = cookies()
  const supabase = createClient()

  const { error } = await supabase.auth.signOut()
  if (error) {
    console.log(error);
    return NextResponse.redirect(
      `${requestUrl.origin}/dashboard?error=Could not sign out`,
      {
        // a 301 status is required to redirect from a POST to a GET route
        status: 301,
      }
    )
  }

  if (cookieStore.has('currentUser')) {
    cookieStore.delete('currentUser')
  }

  return NextResponse.redirect(`${requestUrl.origin}/login`, {
    // a 301 status is required to redirect from a POST to a GET route
    status: 301,
  })
}