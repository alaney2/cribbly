"use client"
import { deleteProperty } from '@/utils/supabase/actions'
import { BentoGrid, BentoGridItem } from "@/components/aceternity/bento-grid";
import {
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
  IconPigMoney,
} from "@tabler/icons-react";
import { IncomeGraph } from '@/components/bento-stuff/IncomeGraph'
import { UtilityPie } from '@/components/bento-stuff/UtilityPie'
import { MaintenanceTable } from '@/components/bento-stuff/MaintenanceTable'
import { BarGraph } from '@/components/bento-stuff/BarGraph'
import { Button } from '@/components/catalyst/button'

export default function CurrentProperty({ params } : { params: { property_id: string } }) {
  const stats = [
    { name: 'Rent price', stat: '$3250' },
    { name: 'Lease expires in', stat: '7 months' },
    { name: 'Current tenants', stat: '2' },
    { name: 'This month\'s rent', stat: 'Paid' },
  ]

  const Skeleton = () => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl   dark:bg-dot-white/[0.2] bg-dot-black/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]  border border-transparent dark:border-white/[0.2] bg-neutral-100 dark:bg-black"></div>
  );

  const items = [
    {
      title: "Total income",
      description:
        "Rent - (maintenance + utility costs)",
      header: <IncomeGraph />,
      className: "md:col-span-2",
      icon: <IconPigMoney className="h-4 w-4 text-blue-500" />
    },
    {
      title: "Net income",
      description:
        "+/- per month",
      header: <BarGraph />,
      className: "md:col-span-1",
      icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Utility costs",
      description: "(e.g., water, electricity, gas)",
      header: <UtilityPie />,
      className: "md:col-span-1",
      icon: <IconClipboardCopy className="h-4 w-4 text-blue-500" />,
    },
    {
      title: "Maintenance Costs",
      description: "Most recent maintenance costs",
      header: <MaintenanceTable />,
      className: "md:col-span-2",
      icon: <IconFileBroken className="h-4 w-4 text-blue-500" />,
    },
  ];

  return (
    <>
      <div className="mb-4">
        <dl className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <div key={item.name} className="overflow-hidden rounded-lg bg-white px-4 py-5 ring-inset ring-1 ring-gray-200 sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-emerald-600">{item.stat}</dd>
            </div>
          ))}
        </dl>
      </div>

      <BentoGrid className="w-full mx-auto auto-rows-[20rem] xl:auto-rows-[22rem]">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            header={item.header}
            className={item.className}
            icon={item.icon}
          />
        ))}
      </BentoGrid>
      <div className="flex justify-center mt-8">
        <Button color="blue" className="">Randomize data</Button>
      </div>
    </>
  )
}