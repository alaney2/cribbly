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

  const email = String(formData.get('email'))
  const full_name = String(formData.get('fullName'))
  const role = String(formData.get('role'))
  const propertyId = String(formData.get('propertyId'))
  if (!propertyId) return

  if (!email) throw new Error('No email found')

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.toLowerCase())) throw new Error('Invalid email')
  
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

  const { data, error: inviteError } = await supabaseAdmin.from('property_invites')
    .select('*')
    .eq('token', token)
  
  if (inviteError || !data || data.length < 1) throw new Error('Invite not found')  

  const { error } = await supabaseAdmin.from('property_invites')
    .delete()
    .eq('token', token)

  if (error) {
    console.error(error)
    throw new Error(error.message)
  } 
}

export async function submitPayment(formData: FormData) {
  const supabaseAdmin = createAdminClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );
  const supabase = createClient()
  const user = await getUser()
  if (!user) return
  const propertyId = String(formData.get('propertyId'))
  const rentAmount = Number(formData.get('rentAmount'))
  // const { data: tenantData, error: tenantError } = await supabase.from('tenants')
  //   .select('*')
  //   .eq('email', user.email)
  //   .eq('property_id', propertyId)
  //   .single()
}