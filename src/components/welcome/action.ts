"use server"
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function setFullName(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const name = String(formData.get('name'))

  cookieStore.set('name', name)
}