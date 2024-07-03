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
      <div className="justify-around flex" >
        <main className="flex-auto lg:px-4 lg:py-4 w-full space-y-4 sm:space-y-8 flex justify-center">
          <div className="grid xl:grid-cols-2 gap-8">
            <div className="">
              <RentCard propertyId={currentPropertyId} />
            </div>
            <div className="space-y-4">
              <InviteCard propertyId={currentPropertyId} />
              <DeleteCard propertyId={currentPropertyId} />
            </div>
          </div>
        </main>
      </div>
    </>
  )
}