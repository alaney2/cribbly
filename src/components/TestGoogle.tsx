"use client"
import Script from 'next/script'

export function TestGoogle() {
  return (
    <>
    <Script
    src="https://apis.google.com/js/platform.js"
    strategy="beforeInteractive" // Loads the script after the page becomes interactive
  />
    <div id="g_id_onload"
                  className='color-red-500'
                  data-client_id="409681195560-2pao2fccagair237mcrqui5qj4bsbolv.apps.googleusercontent.com"
                  data-context="signin"
                  data-ux_mode="redirect"
                  data-login_uri="https://tnykhejxqrbaefhiinac.supabase.co/auth/v1/callback"
                  data-callback="handleSignInWithGoogle"
                  data-auto_select="true"
                  data-itp_support="true">
                </div>

                <div className="g_id_signin"
                  data-type="standard"
                  data-shape="rectangular"
                  data-theme="filled_black"
                  data-text="signin_with"
                  data-size="large"
                  data-logo_alignment="left">
                </div>
                </>
  )

}
