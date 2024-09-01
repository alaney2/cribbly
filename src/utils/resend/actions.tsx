'use server'
import { Resend } from 'resend'
import InviteUserEmail from '@/components/PropertySettings/InviteUserEmail'
import { createClient } from '@/utils/supabase/server'
import { getUser } from '@/utils/supabase/actions'
import { generateId } from '@/lib/utils'
import { unstable_noStore as noStore } from 'next/cache'

export async function sendInviteEmail(formData: FormData) {
  noStore()
  const supabase = createClient()
  const user = await getUser()
  if (!user) {
    throw new Error('User not found')
  }

  const { data: user_data } = await supabase
    .from('users')
    .select()
    .eq('id', user.id)
    .single()
  if (!user_data) {
    throw new Error('User not found')
  }

  const email = String(formData.get('email'))
  const fullName = String(formData.get('fullName'))
  const propertyId = String(formData.get('propertyId'))
  if (!propertyId) throw new Error('Property not found')
  const { data: property } = await supabase
    .from('properties')
    .select()
    .eq('id', propertyId)
    .single()
  if (!property) {
    throw new Error('Property not found')
  }

  const token = generateId({ length: 12 })

  const resend = new Resend(process.env.RESEND_API_KEY)
  const { data: id, error } = await resend.emails.send({
    from: 'Cribbly.io <support@cribbly.io>',
    reply_to: 'support@cribbly.io',
    to: email,
    subject:
      property?.street_address +
      (property?.apt ? ` ${property.apt}` : '') +
      ' Invitation',
    react: (
      <InviteUserEmail
        invitedByUsername={user_data.full_name || ''}
        invitedByEmail={user_data.email}
        username={fullName}
        teamName={
          property?.street_address + (property?.apt ? ` ${property.apt}` : '')
        }
        // inviteLink={`https://resident.cribbly.io/invite?property=${propertyId}&token=${token}&email=${email}&name=${fullName}&address=${property.street_address} ${property.apt}`}
        inviteLink={`http://localhost:3001/invite?property=${propertyId}&token=${token}&email=${email}&name=${fullName}&address=${property.street_address} ${property.apt}`}
      />
    ),
  })

  if (error) {
    console.error(error)
    throw new Error('Error sending email')
  }

  const { error: tokenError } = await supabase.from('property_invites').upsert({
    token,
    full_name: fullName,
    email,
    property_id: propertyId,
  })

  if (tokenError) {
    throw new Error('Error creating invite')
  }
}
