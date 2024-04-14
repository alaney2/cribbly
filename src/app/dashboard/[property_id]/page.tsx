"use server"
import { createClient } from '@/utils/supabase/server'
import { PencilSquareIcon, WrenchIcon } from '@heroicons/react/24/outline';
import { IconCurrencyDollar } from '@tabler/icons-react';
import { Button } from '@/components/catalyst/button'
import Link from 'next/link';
import type { Metadata, ResolvingMetadata } from 'next'
import { BentoStats } from '@/components/Dashboard/BentoStats'
import { redirect } from 'next/navigation'
// import { CalendarIcon } from '@radix-ui/react-icons';

type Props = {
  params: { property_id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const supabase = createClient()
  const { data: propertyData, error } = await supabase.from('properties')
    .select()
    .eq('id', params.property_id)

  if (error || propertyData.length === 0) redirect('/dashboard')

  return {
    title: propertyData[0]?.street_address,
  }
}

const CurrencyIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-currency-dollar" width="16" height="16" viewBox="0 0 24 24" stroke-width="1.5" stroke="#9e9e9e" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M16.7 8a3 3 0 0 0 -2.7 -2h-4a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6h-4a3 3 0 0 1 -2.7 -2" />
    <path d="M12 3v3m0 12v3" />
  </svg>
)

const CalendarIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-calendar-month" width="16" height="16" viewBox="0 0 24 24" stroke-width="1.5" stroke="#9e9e9e" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z" />
    <path d="M16 3v4" />
    <path d="M8 3v4" />
    <path d="M4 11h16" />
    <path d="M7 14h.013" />
    <path d="M10.01 14h.005" />
    <path d="M13.01 14h.005" />
    <path d="M16.015 14h.005" />
    <path d="M13.015 17h.005" />
    <path d="M7.01 17h.005" />
    <path d="M10.01 17h.005" />
  </svg>
)

const TenantIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-users" width="16" height="16" viewBox="0 0 24 24" stroke-width="1.5" stroke="#9e9e9e" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
    <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
  </svg>
)

const HourglassIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-hourglass-high" width="16" height="16" viewBox="0 0 24 24" stroke-width="1.5" stroke="#9e9e9e" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M6.5 7h11" />
    <path d="M6 20v-2a6 6 0 1 1 12 0v2a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1z" />
    <path d="M6 4v2a6 6 0 1 0 12 0v-2a1 1 0 0 0 -1 -1h-10a1 1 0 0 0 -1 1z" />
  </svg>
)

export default async function CurrentProperty({ params } : { params: { property_id: string } }) {
  const supabase = createClient()
  const { data: propertyData, error } = await supabase.from('properties')
    .select()
    .eq('id', params.property_id)

  if (error || propertyData.length === 0) redirect('/dashboard')

  const propertyAddress = propertyData[0]?.street_address

  const stats = [
    { name: 'Rent price', stat: '$3250', icon: CurrencyIcon, editIcon: <PencilSquareIcon className="h-5 w-5 text-gray-500" />, href: `/dashboard/${params.property_id}/settings` },
    { name: 'Lease expires in', icon: HourglassIcon, stat: '7 months' },
    { name: 'Current tenants', icon: TenantIcon, stat: '2' },
    { name: 'This month\'s rent', icon: CalendarIcon, stat: 'Paid' },
  ]

  return (
    <>
      <div className="mb-8 lg:mb-0">
        {/* <h1 className="text-2xl font-semibold mb-8 ml-4 tracking-tight">{propertyData[0]?.street_address}, {propertyData[0]?.city} {propertyData[0]?.state} {propertyData[0]?.apt}</h1> */}
        <div className="mb-4 cursor-default">
          <dl className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => (
              <Link href={item.href || '#'} key={item.name} className="group cursor-default overflow-hidden rounded-lg bg-white px-4 py-5 ring-inset ring-1 ring-gray-200 sm:p-6">
                <div className="flex justify-between">
                  <dt className="truncate text-sm font-medium text-gray-500">
                    {item.name}
                  </dt>
                  {item.icon}
                </div>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-emerald-600 flex">
                  {item.stat}
                  {item.editIcon && 
                    <div className="ml-3 group-hover:opacity-100 p-2 rounded-lg block opacity-20 transition-opacity duration-200 ease-in-out">
                      {item.editIcon}
                    </div>}
                </dd>
              </Link>
            ))}
          </dl>
        </div>

        <BentoStats />

        <div className="flex justify-center mt-8">
          <Button color="blue" className="">Randomize data</Button>
        </div>
      </div>
    </>
  )
}