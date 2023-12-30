import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers'

export async function middleware(request: NextRequest) {
  // let response = NextResponse.next({
  //   request: {
  //     headers: request.headers,
  //   },
  // })

  // const supabase = createServerClient(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  //   {
  //     cookies: {
  //       get(name: string) {
  //         return request.cookies.get(name)?.value
  //       },
  //       set(name: string, value: string, options: CookieOptions) {
  //         request.cookies.set({
  //           name,
  //           value,
  //           ...options,
  //         })
  //         response = NextResponse.next({
  //           request: {
  //             headers: request.headers,
  //           },
  //         })
  //         response.cookies.set({
  //           name,
  //           value,
  //           ...options,
  //         })
  //       },
  //       remove(name: string, options: CookieOptions) {
  //         request.cookies.set({
  //           name,
  //           value: '',
  //           ...options,
  //         })
  //         response = NextResponse.next({
  //           request: {
  //             headers: request.headers,
  //           },
  //         })
  //         response.cookies.set({
  //           name,
  //           value: '',
  //           ...options,
  //         })
  //       },
  //     },
  //   }
  // )

  // await supabase.auth.getSession()

  // return response

  const url = request.nextUrl.clone();
  let userAuthenticated = false;

  // Check if the user is already authenticated via cookie
  // const cookieToken = request.cookies.get('currentUser');

  if (cookies().has('currentUser')) {
    // Additional logic to validate the cookie can be added here
    userAuthenticated = true;
  } else {
    // Use Supabase getUser as a fallback
    const supabase = createClient(cookies()); // Ensure this is compatible with middleware
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      userAuthenticated = true;

      // Set a cookie with user info (simplified for this example)
      // Note: Be careful with the cookie's content and security settings
      // const cookie = `currentUser=${JSON.stringify(user)}; Path=/; HttpOnly; Secure`;
      // cookies().set('currentUser', cookie, { path: '/' });
      // request.cookies.set('currentUser', cookie, { path: '/' });
    }
  }

  // Redirect to login if not authenticated
  if (!userAuthenticated && url.pathname !== '/login') {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}