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

  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.startsWith('/favicon.ico') || pathname.startsWith('/auth')) {
    return NextResponse.next();
  }
  
  let userAuthenticated = false;

  if (cookies().has('currentUser')) {
    userAuthenticated = true;
  }

  const pathsWithoutAuth = ['/sign-in', '/get-started', '/forgot-password', 'update-password'];

  // Redirect to login if not authenticated
  if (!userAuthenticated && !pathsWithoutAuth.some(path => url.pathname.startsWith(path))) {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  if (!userAuthenticated && !cookies().has(process.env.NEXT_PUBLIC_SUPABASE_STRING + '-auth-token-code-verifier') && url.pathname.startsWith('/update-password')) {
    url.pathname = '/forgot-password';
    return NextResponse.redirect(url);
  }

  const unavailableRoutes = ['/sign-in', '/get-started', '/forgot-password', 'update-password'];

  // Can't sign in or sign up if already logged in
  if (userAuthenticated && unavailableRoutes.some(path => url.pathname.startsWith(path))) {
      url.pathname = '/dashboard';
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