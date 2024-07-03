import { TenantsTable } from "@/components/Tenant/TenantsTable"
import { BentoStats } from '@/components/Dashboard/BentoStats'
import { PropertyStats } from '@/components/Dashboard/PropertyStats'
import { Button } from '@/components/catalyst/button'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function TenantsPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/sign-in')
  let currentPropertyId = user.user_metadata.currentPropertyId
  
  const { data: propertyData, error } = await supabase.from('properties')
    .select()
    .eq('id', currentPropertyId)

  if (error || propertyData.length === 0) {
    redirect('/dashboard')
  }

  return (
    <>
      <div className="p-6 md:p-8 mb-8 lg:mb-0">
        <div className=''>
          <TenantsTable propertyId={currentPropertyId}/>
        </div>
      </div>
    </>
  )
}