"use server"
import { Resend } from 'resend';
import InviteUserEmail from '@/components/PropertySettings/InviteUserEmail';
import { createClient } from '@/utils/supabase/server';
import { getUser } from '@/utils/supabase/actions';

export async function sendInviteEmail(formData: FormData) {
  const supabase = createClient()
  const user = await getUser()
  if (!user) return
  const { data: user_data } = await supabase.from('users')
    .select()
    .eq('id', user.id)
    .single()
  if (!user_data) return

  console.log('USER DATA', user_data)

  const email = String(formData.get('email'))
  const fullName = String(formData.get('fullName'));
  const propertyId = String(formData.get('propertyId'))
  const { data: property } = await supabase.from('properties')
    .select()
    .eq('id', propertyId)
    .single()
  const resend = new Resend(process.env.RESEND_API_KEY)
  const { data: id, error } = await resend.emails.send({
    from: 'Cribbly <support@cribbly.io>',
    reply_to: 'support@cribbly.io',
    to: email,
    subject: 'Property Invite - ' + property?.street_address,
    react: <InviteUserEmail 
      invitedByUsername={user_data.full_name || ''}
      invitedByEmail={user_data.email}
      username={fullName}
      teamName={property?.street_address}
      inviteLink={`https://cribbly.io/invite/${propertyId}`}
    />,
  });
  if (error) {
    console.error(error);
    throw new Error('Error sending email')
  }
}