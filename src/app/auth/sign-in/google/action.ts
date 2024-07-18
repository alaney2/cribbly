"use server"
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getURL } from '@/utils/helpers';


export async function signInGoogle() {
  const supabase = createClient()
  const redirectURL = getURL('/auth/callback');
  // const newUrl = redirectURL + '?provider=google&next=/dashboard'
  // console.log(redirectURL)
  // redirect(newUrl)
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google', 
    options: {
      redirectTo: "https://www.cribbly.io/auth/callback",
      queryParams: {
        // access_type: 'offline',
        // prompt: 'consent',
      },
    },
  })

  if (data && data.url) {
    redirect(data.url);
  } else {
    console.error("Authentication failed or no data received", error);
  }
}
