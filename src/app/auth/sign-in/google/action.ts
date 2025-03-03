"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getURL } from "@/utils/helpers";

export async function signInGoogle() {
  const supabase = createClient();
  const redirectURL = getURL("/auth/callback");
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectURL,
      queryParams: {
        // access_type: 'offline',
        prompt: "consent",
      },
    },
  });

  if (data?.url) {
    redirect(data.url);
  } else {
    console.error("Authentication failed or no data received", error);
  }
}
