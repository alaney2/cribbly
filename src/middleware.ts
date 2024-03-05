import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { updateSession, createClient } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {

  const { supabase, response } = createClient(request);
  const { data, error } = await supabase.auth.getUser()

  const url = request.nextUrl.clone();
  const { pathname } = request.nextUrl;

  const deprecatedPaths = ['/forgot-password', '/update-password', '/get-started/otp']
  if (deprecatedPaths.some(path => pathname.startsWith(path))) {
    url.pathname = '/get-started';
    return NextResponse.redirect(url)
  }
  
  // Google sign in?
  if (pathname === '/' && url.searchParams.has('code')) {
    const code = url.searchParams.get('code');
    const { data } = await supabase.auth.exchangeCodeForSession(code!);

    if (!data?.user?.user_metadata?.welcome_screen || data?.user?.user_metadata?.welcome_screen === true) {
      url.pathname = '/welcome'
    } else {
      url.pathname = '/dashboard'
    }
    url.searchParams.delete('code');
    const response = NextResponse.redirect(url);
    const user = {
      id: data?.user?.id,
      email: data?.user?.email,
    }
    response.cookies.set('currentUser', JSON.stringify(user))
    response.cookies.set(process.env.NEXT_PUBLIC_SUPABASE_STRING + 'auth-token', JSON.stringify(data))
    return response
  }
  
  if (data.user) {
    const availableRoutes = ['/privacy', '/terms'];

    if (pathname !== '/welcome' && (!data?.user?.user_metadata?.welcome_screen || data?.user?.user_metadata?.welcome_screen === true) && !availableRoutes.some(path => url.pathname.startsWith(path))) {
      url.pathname = '/welcome';
      return NextResponse.redirect(url);
    }

    const unavailableRoutes = ['/sign-in', '/get-started'];
    // Can't sign in or sign up if already logged in
    if (pathname === '/' || unavailableRoutes.some(path => url.pathname.startsWith(path))) {
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
    } else {
        return NextResponse.next();
    }
  } else {
    const pathsWithoutAuth = ['/sign-in', '/get-started', '/privacy', '/terms'];
    // Redirect to login if not authenticated
    if (pathname !== '/' && !pathsWithoutAuth.some(path => pathname.startsWith(path))) {
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
};
