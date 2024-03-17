import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()

  const { supabase, response } = createClient(request)
  let { data: {user}, error } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  const availableRoutes = ['/privacy', '/terms']
  if (availableRoutes.some((path) => url.pathname.startsWith(path))) {
    return NextResponse.next()
  }

  if (user) {
    const show_welcome = await supabase
      .from('users')
      .select('welcome_screen')
      .eq('id', user?.id)
      .single()

    const welcome_screen = show_welcome?.data?.welcome_screen

    console.log('show_welcome', welcome_screen)

    if (pathname !== '/welcome' && welcome_screen) {
      return NextResponse.redirect(new URL('/welcome', request.url))
    }

    const unavailableRoutes = ['/sign-in', '/get-started']
    // Can't sign in or sign up if already logged in
    if (
      pathname === '/' ||
      unavailableRoutes.some((path) => url.pathname.startsWith(path))
    ) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } else {
      return NextResponse.next()
    }
  } else {
    const pathsWithoutAuth = ['/sign-in', '/get-started', '/privacy', '/terms']
    // Redirect to login if not authenticated
    if (
      pathname !== '/' &&
      !pathsWithoutAuth.some((path) => pathname.startsWith(path))
    ) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  return response
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - /auth (auth routes)
     * - /api (api routes)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    {
      source: '/((?!_next/static|_next/image|auth|api|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    }
  ],
}
