"use server"
import { createClient } from '@/utils/supabase/server'
import { PencilSquareIcon, WrenchIcon } from '@heroicons/react/24/outline';
import { IconCurrencyDollar } from '@tabler/icons-react';
import { Button } from '@/components/catalyst/button'
import type { Metadata, ResolvingMetadata } from 'next'
import { BentoStats } from '@/components/Dashboard/BentoStats'
import { redirect } from 'next/navigation'
// import { CalendarIcon } from '@radix-ui/react-icons';
import { PropertyStats } from '@/components/Dashboard/PropertyStats'


export default async function CurrentProperty({ params } : { params: { property_id: string } }) {
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

  const propertyAddress = propertyData[0]?.street_address

  return (
    <>
      <div className="mb-8 lg:mb-0 content-container">
        <h1 className="lg:hidden text-xl font-semibold mb-8 ml-4 tracking-tight">{propertyData[0]?.street_address}, {propertyData[0]?.city} {propertyData[0]?.state} {propertyData[0]?.apt}</h1>
        <div className="mb-4 cursor-default">
          <PropertyStats currentPropertyId={currentPropertyId} />
        </div>

        <BentoStats />
        {/* <div className="flex justify-center mt-8">
          <Button color="blue" className="">Randomize data</Button>
        </div> */}
      </div>
    </>
  )
}