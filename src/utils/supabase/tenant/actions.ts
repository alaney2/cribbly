"use server"
import { createClient } from '@/utils/supabase/server';
import { generateId } from '@/lib/utils';
import { calculateRentDates } from '@/utils/helpers'
import { createClient as createAdminClient } from '@supabase/supabase-js';
import type { Database, Tables, TablesInsert } from '@/types_db';
import { getUser } from '@/utils/supabase/actions';

export async function insertNewTenant(formData: FormData) {
  const supabaseAdmin = createAdminClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );
  //const supabase = createClient()

  const email = String(formData.get('email'))
  const full_name = String(formData.get('fullName'))
  const role = String(formData.get('role'))
  const propertyId = String(formData.get('propertyId'))
  if (!propertyId) return

  if (!email) throw new Error('No email found')

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.toLowerCase())) throw new Error('Invalid email')
  
  // const { data, error } = await supabaseAdmin.from('users')
  //   .select('*')
  //   .eq('email', email)
  //   .single()
  // const user = await getUser()
  // console.log("USERSEURSEURUUSER************************************", user)
  // if (!user) throw new Error('User not found')
  // if (error || !data) throw new Error(error?.message || 'User not found')
  
  // console.log(data)
  const { error: insertError } = await supabaseAdmin.from('tenants').upsert({
    email: email.toLowerCase(),
    property_id: propertyId,
  }, {
    onConflict: 'email, property_id',
  })

  if (insertError) {
    console.error(insertError)
    throw new Error(insertError.message)
  }
}

export async function deleteInvite(formData: FormData) {
  const supabaseAdmin = createAdminClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );
  // const supabase = createClient()
  const token = String(formData.get('token'))
  if (!token) return

  const { data } = await supabaseAdmin.from('property_invites')
    .select('*')
    .eq('token', token)
  
  if (!data || data.length < 1) throw new Error('Invite not found')  

  const { error } = await supabaseAdmin.from('property_invites')
    .delete()
    .eq('token', token)

  if (error) {
    console.error(error)
    throw new Error(error.message)
  } 
}
