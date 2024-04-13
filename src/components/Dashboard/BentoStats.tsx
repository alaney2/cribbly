"use client"
import { deleteProperty } from '@/utils/supabase/actions'
import { BentoGrid, BentoGridItem } from "@/components/aceternity/bento-grid";
import {
  IconFileBroken,
  IconWavesElectricity,
  IconTableColumn,
  IconPigMoney,
} from "@tabler/icons-react";
import { PencilSquareIcon, WrenchIcon } from '@heroicons/react/24/outline';
import { IncomeGraph } from '@/components/bento-stuff/IncomeGraph'
import { UtilityPie } from '@/components/bento-stuff/UtilityPie'
import { MaintenanceTable } from '@/components/bento-stuff/MaintenanceTable'
import { BarGraph } from '@/components/bento-stuff/BarGraph'
import { Button } from '@/components/catalyst/button'
import { usePathname, useRouter } from 'next/navigation'


export function BentoStats() {
  const pathname = usePathname()

  const stats = [
    { name: 'Rent price', stat: '$3250', icon: <PencilSquareIcon className="h-5 w-5 text-gray-500" />, href: `${pathname}/settings` },
    { name: 'Lease expires in', stat: '7 months' },
    { name: 'Current tenants', stat: '2' },
    { name: 'This month\'s rent', stat: 'Paid' },
  ]

  const Skeleton = () => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl dark:bg-dot-white/[0.2] bg-dot-black/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]  border border-transparent dark:border-white/[0.2] bg-neutral-100 dark:bg-black"></div>
  );

  const items = [
    {
      title: "Total income",
      description:
        "Rent - (maintenance + utility costs)",
      header: <IncomeGraph />,
      className: "md:col-span-2",
      icon: <IconPigMoney className="h-4 w-4 text-blue-500" />,
      edit: false,
    },
    {
      title: "Net income",
      description:
        "+/- per month",
      header: <BarGraph />,
      className: "md:col-span-1",
      icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
      edit: false,
    },
    {
      title: "Utility costs",
      description: "(e.g., water, electricity, gas)",
      header: <UtilityPie />,
      className: "md:col-span-1",
      icon: <IconWavesElectricity className="h-4 w-4 text-blue-500" />,
      edit: true,
    },
    {
      title: "Maintenance Costs",
      description: "Most recent maintenance costs",
      header: <MaintenanceTable />,
      className: "md:col-span-2",
      icon: <WrenchIcon className="h-4 w-4 text-blue-500" />,
      edit: true,
      href: `${pathname}/maintenance`,
    },
  ];

  return (
    <>
      <BentoGrid className="w-full mx-auto auto-rows-[20rem] xl:auto-rows-[30vh]">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            header={item.header}
            className={item.className}
            icon={item.icon}
            edit={item.edit}
            href={item.href}
          />
        ))}
      </BentoGrid>
    </>
  )
}