import { TenantsTable } from '@/components/Tenant/TenantsTable'
import { Button } from '@/components/catalyst/button'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function TenantsPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/sign-in')
  const currentPropertyId = user.user_metadata.currentPropertyId

  const { data: propertyData, error } = await supabase
    .from('properties')
    .select()
    .eq('id', currentPropertyId)

  if (error || propertyData.length === 0) {
    redirect('/dashboard')
  }

  const { data: tenantsData, error: tenantsError } = await supabase
    .from('tenants')
    .select(
      `
      id,
      property_id,
      user_id,
      users (
        email,
        full_name,
        created_at
      )
    `,
    )
    .eq('property_id', currentPropertyId)
  

  if (tenantsError) {
    console.error('Error fetching tenants:', tenantsError)
    // Handle error as needed
  }

  return (
    <>
      <div className="mb-8 p-6 md:p-8 lg:mb-0">
        <div className="">
          <TenantsTable tenantsData={tenantsData || []} />
        </div>
      </div>
    </>
  )
}
