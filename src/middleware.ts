import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers'

export async function middleware(request: NextRequest) {

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )


  const url = request.nextUrl.clone();

  if (url.searchParams.has('code')) {
    const code = url.searchParams.get('code');
    await supabase.auth.exchangeCodeForSession(code!);
    supabase.auth.onAuthStateChange((event, session) => {
      // console.log(session)
      
      if (session && session.provider_token) {
        console.log("COOKIEEEEEEEEE")
        request.cookies.set({
          name: 'oauth_provider_token',
          value: JSON.stringify(session.provider_token),
        })
        // window.localStorage.setItem('oauth_provider_token', session.provider_token)
      }
    
      if (session && session.provider_refresh_token && session.access_token) {
        // window.localStorage.setItem('oauth_provider_refresh_token', session.provider_refresh_token)
        const access_token = session.access_token;
        const refresh_token = session.provider_refresh_token;
        console.log('access_token', access_token)
        console.log('refresh_token', refresh_token)
        supabase.auth.setSession({
          access_token,
          refresh_token
        })
      }
    
      if (event === 'SIGNED_OUT') {
        window.localStorage.removeItem('oauth_provider_token')
        window.localStorage.removeItem('oauth_provider_refresh_token')
      }
    })
    url.searchParams.delete('code');
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.startsWith('/favicon.ico') || pathname.startsWith('/auth')) {
    return NextResponse.next();
  }
  
  let userAuthenticated = false;

  if (cookies().has('currentUser')) {
    userAuthenticated = true;
    const unavailableRoutes = ['/sign-in', '/get-started', '/forgot-password', '/update-password'];
    // Can't sign in or sign up if already logged in
    if (unavailableRoutes.some(path => url.pathname.startsWith(path))) {
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
    } else {
        return NextResponse.next();
    }
  }

  const pathsWithoutAuth = ['/sign-in', '/get-started', '/forgot-password', '/update-password', '/privacy'];

  // Redirect to login if not authenticated
  if (!userAuthenticated && url.pathname !== '/' && !pathsWithoutAuth.some(path => url.pathname.startsWith(path))) {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  if (!userAuthenticated && !cookies().has(process.env.NEXT_PUBLIC_SUPABASE_STRING + '-auth-token-code-verifier') && url.pathname.startsWith('/update-password')) {
    url.pathname = '/forgot-password';
    return NextResponse.redirect(url);
  }

  if (!cookies().has('email') && url.pathname === '/get-started/otp') {
    url.pathname = '/get-started';
    return NextResponse.redirect(url);
  }

  // await supabase.auth.getSession()

  // return response
  return NextResponse.next();
}