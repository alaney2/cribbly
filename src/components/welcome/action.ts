"use server"
import { cookies } from 'next/headers'


export async function setFullName(formData: FormData) {
  const name = String(formData.get('name'))
  const cookieStore = cookies()
  cookieStore.set('name', name)
}
