"use server"
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function signInGoogle() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  // supabase.auth.signInWithOAuth({
  //   provider: 'google',
  // })

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  console.log(data)
  console.log(error)
  console.log('clicked')
}