import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'


export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  // const formData = await request.formData()
  // const new_password = String(formData.get('password'))
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const json = await request.json()
  const code = json.code
  const password = json.password
  
  supabase.auth.exchangeCodeForSession(code)

  const { data, error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    console.log('error', error)
    return NextResponse.redirect(
      `${requestUrl.origin}/update-password?error=Could not update password`,
      {
        status: 301,
      }
    )
  }

  console.log(data)

  return NextResponse.redirect(
    `${requestUrl.origin}`,
    {
      status: 301,
    }
  )

}

