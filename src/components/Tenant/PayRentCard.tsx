"use client"
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import useSWR from 'swr';
import { useEffect } from 'react'
import { RentCard } from '@/components/PropertySettings/RentCard';
import { Button } from '@/components/ui/button'

const fetcher = async () => {
  const supabase = createClient();
  let { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    toast.error("User not found")
    return
  }

  const { data: combinedData, error: combinedError } = await supabase
  .from('tenants')
  .select('*, properties(*)')
  .eq('email', user && user.email ? user.email : '')
  .single();

  if (combinedError) {
    throw combinedError;
  }

  const { data: rentData, error: rentError } = await supabase
    .from('property_rents')
    .select('*')
    .eq('property_id', combinedData.property_id)
    
  return rentData;
};

export function PayRentCard() {
  const { data, error, isLoading } = useSWR('tenantProperty', fetcher);
  // useEffect(() => {
  //   console.log(data)
  // }, [data])
  return (
    <>
      <div className="text-center flex items-center justify-center flex-col h-full">
        <h1 className="text-5xl font-semibold mb-6">
          ${data && data[0]?.rent_price ? data[0].rent_price : 0}
        </h1>
        <Button>Make a payment</Button>
      </div>
    </>
  )
}