'use server'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import SettingsNavigation from '@/components/SettingsNavigation'
import { getCurrentProperty } from '@/utils/supabase/actions'

export default async function TenantSettings() {
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

  return (
    <main className="flex max-w-7xl flex-col justify-center space-y-4 sm:space-y-8">
      <SettingsNavigation
        currentPropertyId={currentPropertyId}
        propertyRent={property_rent}
        securityDeposit={sd_data}
        propertyFees={property_fees}
        key={currentPropertyId}
        initialTab="Delete"
      />
    </main>
  )
}
