import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      return NextResponse.redirect(
        `/dashboard/settings/payments?error=${encodeURIComponent(error)}`
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        "/dashboard/settings/payments?error=Missing required parameters"
      );
    }

    // Exchange the authorization code for an access token
    const tokenResponse = await fetch(
      "https://api.venmo.com/v1/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.NEXT_PUBLIC_VENMO_CLIENT_ID,
          client_secret: process.env.VENMO_CLIENT_SECRET,
          code,
          redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/venmo/callback`,
        }),
      }
    );

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      return NextResponse.redirect(
        `/dashboard/settings/payments?error=${encodeURIComponent(error)}`
      );
    }

    const data = await tokenResponse.json();

    // Store the access token and user info in your database
    const supabase = createClient();
    const { error: dbError } = await supabase
      .from("venmo_accounts")
      .upsert({
        user_id: data.user.id,
        access_token: data.access_token,
        username: data.user.username,
        display_name: data.user.display_name,
        email: data.user.email,
        phone: data.user.phone,
      })
      .select()
      .single();

    if (dbError) {
      return NextResponse.redirect(
        `/dashboard/settings/payments?error=${encodeURIComponent(dbError.message)}`
      );
    }

    // Redirect back to the settings page with success message
    return NextResponse.redirect(
      "/dashboard/settings/payments?success=Successfully connected Venmo account"
    );
  } catch (error) {
    console.error("Venmo callback error:", error);
    return NextResponse.redirect(
      `/dashboard/settings/payments?error=${encodeURIComponent(
        "An unexpected error occurred"
      )}`
    );
  }
}
