import { RentCard } from '@/components/PropertySettings/RentCard'
import { InviteCard } from '@/components/PropertySettings/InviteCard'
import { DeleteCard } from '@/components/PropertySettings/DeleteCard'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/catalyst/button'
import { SettingsNavigation } from '@/components/SettingsNavigation'
import { getCurrentProperty } from '@/utils/supabase/actions'

export default async function CurrentPropertySettings() {
  // const supabase = createClient()
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser()
  // if (!user) redirect('/sign-in')
  // let currentPropertyId = user.user_metadata.currentPropertyId
  const currentPropertyId = await getCurrentProperty()

  return (
    <>
      <main className="flex flex-col max-w-7xl space-y-4 sm:space-y-8 justify-center">
        {/* <RentCard propertyId={currentPropertyId} />
        <InviteCard propertyId={currentPropertyId} />
        <DeleteCard propertyId={currentPropertyId} /> */}
        <SettingsNavigation currentPropertyId={currentPropertyId} />
      </main>
    </>
  )
}
