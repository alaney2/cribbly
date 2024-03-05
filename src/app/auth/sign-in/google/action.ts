"use server"
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'


export async function signInGoogle() {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `/privacy`,
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
