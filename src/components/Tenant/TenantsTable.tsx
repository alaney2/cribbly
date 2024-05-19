"use client"
import useSWR from 'swr';
import { useSearchParams } from 'next/navigation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/catalyst/table'
import { createClient } from '@/utils/supabase/client';
import { useEffect } from 'react'
import { format } from 'date-fns'

const tenantsFetcher = async (property_id: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('tenants')
    .select(`
      id,
      email,
      created_at,
      users:email ( full_name )
    `)
    .eq('property_id', property_id);
  if (error) throw error;
  return data
}

export function TenantsTable({ propertyId }: { propertyId: string }) {
  const { data: tenantsData, error: tenantsError, isLoading: isTenantsLoading } = useSWR(['tenants', propertyId], ([_, property_id]) => tenantsFetcher(property_id))

  // useEffect(() => {
  //   console.log(tenantsData)
  // }, [tenantsData])
  return (
    <>
      <Table bleed className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]">
        <TableHead>
          <TableRow>
            <TableHeader>Name</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Date joined</TableHeader>
            {/* <TableHeader></TableHeader> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {tenantsData && tenantsData.length > 0 && tenantsData?.map((tenant) => (
            <TableRow key={tenant.id}>
              {/* @ts-ignore: the column does exist */}
              <TableCell className="font-medium">{tenant.users?.full_name}</TableCell>
              <TableCell>{tenant.email}</TableCell>
              <TableCell>{format(tenant.created_at, "MM/dd/yyyy")}</TableCell>

              {/* <TableCell className="text-red-600/80 hover:text-red-600">
                <button className="cursor-default" onClick={async () => {
                  
                }}>
                  Delete
                </button>
              </TableCell> */}
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