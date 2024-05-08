"use client"
import useSWR from 'swr';
import { useSearchParams } from 'next/navigation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/catalyst/table'
import { createClient } from '@/utils/supabase/client';
import { useEffect } from 'react'


const tenantsFetcher = async (property_id: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('tenants')
    .select(`
      id,
      email,
      users ( full_name )
    `)
    .eq('property_id', property_id);
  // console.log('error', error)
  if (error) throw error;
  // console.log(data)
  return data
}

export function TenantsTable({ propertyId }: { propertyId: string }) {
  const { data: tenantsData, error: tenantsError, isLoading: isTenantsLoading } = useSWR(['tenants', propertyId], ([_, property_id]) => tenantsFetcher(property_id))

  useEffect(() => {
    console.log(tenantsData)
  }, [tenantsData])
  return (
    <>
      <Table bleed className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]">
        <TableHead>
          <TableRow>
            <TableHeader>Name</TableHeader>
            <TableHeader>Email</TableHeader>
            {/* <TableHeader>Role</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Access</TableHeader> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {tenantsData && tenantsData.length > 0 && tenantsData?.map((tenant) => (
            <TableRow key={tenant.id}>
              <TableCell className="font-medium">{'Temp'}</TableCell>
              <TableCell>{tenant.email}</TableCell>
              {/* {/* <TableCell>{tenant.role}</TableCell> */}
              <TableCell>{'Action'}</TableCell>
              {/* <TableCell className="text-zinc-500">{tenant.access}</TableCell> */}
            </TableRow>
          ))}
          {tenantsData && tenantsData.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center ">No tenants found, invite them on the Settings page</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  )
}