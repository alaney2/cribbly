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

  // supabase.auth.signInWithOAuth({
  //   provider: 'google',
  // })
  
  // supabase.auth.onAuthStateChange((event, session) => {
  //   console.log(session)
  //   if (session && session.provider_token) {
  //     window.localStorage.setItem('oauth_provider_token', session.provider_token)
  //   }
  
  //   if (session && session.provider_refresh_token) {
  //     window.localStorage.setItem('oauth_provider_refresh_token', session.provider_refresh_token)
  //   }
  
  //   if (event === 'SIGNED_OUT') {
  //     window.localStorage.removeItem('oauth_provider_token')
  //     window.localStorage.removeItem('oauth_provider_refresh_token')
  //   }
  // })

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: '/dashboard',
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  console.log(data)

  if (data && data.url) {
    redirect(data.url);
  } else {
    console.error("Authentication failed or no data received", error);
  }
}
