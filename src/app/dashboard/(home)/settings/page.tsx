import { RentCard } from '@/components/PropertySettings/RentCard'
import { InviteCard } from '@/components/PropertySettings/InviteCard'
import { DeleteCard } from '@/components/PropertySettings/DeleteCard'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function CurrentPropertySettings() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/sign-in')
  let currentPropertyId = user.user_metadata.currentPropertyId

  return (
    <>
      <main className="flex flex-col w-full space-y-4 sm:space-y-8 justify-center">
        <RentCard propertyId={currentPropertyId} />
        <InviteCard propertyId={currentPropertyId} />
        <DeleteCard propertyId={currentPropertyId} />
      </main>
    </>
  )
}