"use server"
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
// import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'

export async function signInGoogle() {
  const cookieStore = cookies()
  // const supabase = createClient(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  // )
  const supabase = createClient(cookieStore)
  supabase.auth.signInWithOAuth({
    provider: 'google',
  })
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (data && data.url) {
    redirect(data.url);
  } else {
    console.error("Authentication failed or no data received", error);
  }
}