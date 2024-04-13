"use server"
import { deleteProperty } from '@/utils/supabase/actions'
import { BentoGrid, BentoGridItem } from "@/components/aceternity/bento-grid";
import { createClient } from '@/utils/supabase/server'
import { PencilSquareIcon, WrenchIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/catalyst/button'
import Link from 'next/link';
import type { Metadata, ResolvingMetadata } from 'next'
import { BentoStats } from '@/components/Dashboard/BentoStats'
import { redirect } from 'next/navigation'

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

export default async function CurrentProperty({ params } : { params: { property_id: string } }) {
  const supabase = createClient()
  const { data: propertyData, error } = await supabase.from('properties')
    .select()
    .eq('id', params.property_id)

  if (error || propertyData.length === 0) redirect('/dashboard')

  const propertyAddress = propertyData[0]?.street_address

  const stats = [
    { name: 'Rent price', stat: '$3250', icon: <PencilSquareIcon className="h-5 w-5 text-gray-500" />, href: `/dashboard/${params.property_id}/settings` },
    { name: 'Lease expires in', stat: '7 months' },
    { name: 'Current tenants', stat: '2' },
    { name: 'This month\'s rent', stat: 'Paid' },
  ]

  const Skeleton = () => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl dark:bg-dot-white/[0.2] bg-dot-black/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]  border border-transparent dark:border-white/[0.2] bg-neutral-100 dark:bg-black"></div>
  );


  return (
    <>
      <div className="mb-8 lg:mb-0">
        <h1 className="text-2xl font-semibold mb-8 ml-4 tracking-tight">{propertyData[0]?.street_address}, {propertyData[0]?.city} {propertyData[0]?.state} {propertyData[0]?.apt}</h1>
        
        <div className="mb-4 cursor-default">
          <dl className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => (
              <Link href={item.href || '#'} key={item.name} className="group cursor-default overflow-hidden rounded-lg bg-white px-4 py-5 ring-inset ring-1 ring-gray-200 sm:p-6">
                <dt className="truncate text-sm font-medium text-gray-500">
                  {item.name}
                </dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-emerald-600 flex">
                  {item.stat}
                  {item.icon && 
                    <div className="ml-3 group-hover:opacity-100 p-2 rounded-lg block opacity-20 transition-opacity duration-200 ease-in-out">
                      {item.icon}
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