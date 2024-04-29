"use server"
import { createClient } from '@/utils/supabase/server';
import { generateId } from '@/lib/utils';
import { calculateRentDates } from '@/utils/helpers'

export async function insertNewTenant(formData: FormData) {
  const supabase = createClient()

  const email = String(formData.get('email'))
  const full_name = String(formData.get('fullName'))
  const role = String(formData.get('role'))
  const propertyId = String(formData.get('propertyId'))


  if (!email) throw new Error('No email found')

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.toLowerCase())) throw new Error('Invalid email')
  
  const { data, error } = await supabase.from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (error || !data) throw new Error(error.message)
  
  console.log(data)
  const { error: insertError } = await supabase.from('tenants').insert({
    user_id: data.id,
    property_id: propertyId,
  })

  if (insertError) throw new Error(insertError.message)
}

export async function deleteInvite(formData: FormData) {
  const supabase = createClient()
  const token = String(formData.get('token'))

  if (!token) throw new Error('No token found')

  const { error } = await supabase.from('property_invites')
    .delete()
    .eq('token', token)

  if (error) throw new Error(error.message)
}
