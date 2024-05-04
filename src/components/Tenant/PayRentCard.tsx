"use client"
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import useSWR from 'swr';
import { useEffect } from 'react'

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
  return combinedData;
};

export function PayRentCard() {
  const { data, error, isLoading } = useSWR('tenantProperty', fetcher);
  // useEffect(() => {
  //   console.log(data)
  // }, [data])
  return (
    <>

    </>
  )
}