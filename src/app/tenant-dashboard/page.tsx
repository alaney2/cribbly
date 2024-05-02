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

  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('email', user && user.email ? user.email : '');
  if (error || (data && data.length === 0)) return

  const { data: property, error: propertyError } = await supabase
    .from('properties')
    .select('*')
    .eq('id', data[0].property_id);

  if (error) {
    throw error;
  }
  return property;
};

export default function TenantDashboardPage() {
  const { data, error, isLoading } = useSWR('tenantProperty', fetcher);
  useEffect(() => {
    console.log(data)
  }, [data])
  return (
    <div>
      
    </div>
  )
}