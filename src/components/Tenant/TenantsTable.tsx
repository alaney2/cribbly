'use client'
import useSWR from 'swr'
import { useSearchParams } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/catalyst/table'
import { createClient } from '@/utils/supabase/client'
import { useEffect } from 'react'
import { format } from 'date-fns'
import Link from 'next/link'
import { Text, TextLink } from '@/components/catalyst/text'

interface Tenant {
  id: string;
  property_id: string;
  user_id: string;
  users: {
    full_name: string;
    email: string;
    created_at: Date;
  };
}

export function TenantsTable({ tenantsData }: { tenantsData: Tenant[] }) {
  return (
    <>
      <Table
        bleed
        className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]"
      >
        <TableHead>
          <TableRow>
            <TableHeader>Name</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Date joined</TableHeader>
            {/* <TableHeader></TableHeader> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {tenantsData &&
            tenantsData.length > 0 &&
            tenantsData?.map((tenant) => (
              <TableRow key={tenant.id}>
                {/* @ts-ignore: the column does exist */}
                <TableCell className="">
                  {tenant.users?.full_name}
                </TableCell>
                <TableCell>{tenant.users.email}</TableCell>
                <TableCell>{format(tenant.users.created_at, 'MM/dd/yyyy')}</TableCell>

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
              <TableCell colSpan={3} className="text-center">
                No tenants found, invite them{' '}
                <TextLink href="/dashboard/settings/tenants">here</TextLink>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  )
}
