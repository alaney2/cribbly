"use server"
import { createClient } from '@/utils/supabase/server'
import { DocumentsClient } from './DocumentsClient'
import { redirect } from 'next/navigation'

export default async function Documents() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/sign-in')
  let currentPropertyId = user.user_metadata.currentPropertyId

  return (
    <>
      <DocumentsClient propertyId={currentPropertyId} />
    </>
  )
}
