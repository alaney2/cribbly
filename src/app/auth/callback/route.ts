import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';

export async function GET(request: NextRequest) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the `@supabase/ssr` package. It exchanges an auth code for the user's session.
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/'

  if (code) {
    const supabase = createClient();

    const { data: { session, user }, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!user || error) {
      return NextResponse.redirect(
        `${requestUrl.origin}/sign-in`,
        {
          status: 301,
        }
      );
    }

    await supabase.from('users').upsert([
      {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata.full_name,
        role: 'landlord',
      }
    ]);

    return NextResponse.redirect(`${requestUrl.origin}${next}`)
  }

  return NextResponse.redirect(
    `${requestUrl.origin}`,
    {
      status: 301,
    }
  );
}
