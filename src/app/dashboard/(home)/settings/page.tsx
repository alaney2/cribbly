import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import SettingsNavigation from '@/components/SettingsNavigation'
import { getCurrentProperty } from '@/utils/supabase/actions'

export default async function CurrentPropertySettings() {
  // const supabase = createClient()
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser()
  // if (!user) redirect('/sign-in')
  // let currentPropertyId = user.user_metadata.currentPropertyId
  const supabase = createClient()
  const currentPropertyId = await getCurrentProperty()

  const { data: property_rent, error: rentError } = await supabase
    .from('property_rents')
    .select('*')
    .eq('property_id', currentPropertyId)
    .single()

  const { data: sd_data, error: sdError } = await supabase
    .from('property_security_deposits')
    .select('*')
    .eq('property_id', currentPropertyId)
    .single()

  const { data: property_fees, error: feesError } = await supabase
    .from('property_fees')
    .select('*')
    .eq('property_id', currentPropertyId)

  // let new_property_fees = []
  // let new_property_rent = {}
  // if (rentError) {
  //   console.error('Error fetching data:', rentError)
  //   // Handle error appropriately
  //   new_property_rent = {
  //     id: '',
  //     property_id: currentPropertyId,
  //     rent_price: 0,
  //   }
  // }

  // if (rentError || sdError || feesError) {
  //   console.error('Error fetching data:', rentError || sdError || feesError)
  //   // Handle error appropriately
  // }

  return (
    <>
      <main className="flex max-w-7xl flex-col justify-center space-y-4 sm:space-y-8">
        {/* <RentCard propertyId={currentPropertyId} />
        <InviteCard propertyId={currentPropertyId} />
        <DeleteCard propertyId={currentPropertyId} /> */}
        <SettingsNavigation
          currentPropertyId={currentPropertyId}
          propertyRent={property_rent}
          securityDeposit={sd_data}
          propertyFees={property_fees}
          key={currentPropertyId}
        />
      </main>
    </>
  )
}
