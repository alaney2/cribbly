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
import { MaintenanceTable } from '@/components/Tenant/MaintenanceTable'
import { BarGraph } from '@/components/bento-stuff/BarGraph'
import { Button } from '@/components/catalyst/button'
import { usePathname, useRouter } from 'next/navigation'
import { PayRentCard } from '@/components/Tenant/PayRentCard'

export function TenantBento() {
  const pathname = usePathname()

  const Skeleton = () => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl dark:bg-dot-white/[0.2] bg-dot-black/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]  border border-transparent dark:border-white/[0.2] bg-neutral-100 dark:bg-black"></div>
  );

  const items = [
    {
      title: "Balance due",
      description:
        "Rent - (maintenance + utility costs)",
      header: <PayRentCard />,
      className: "md:col-span-1",
      icon: <IconPigMoney className="h-4 w-4 text-blue-500" />,
      edit: false,
    },
    {
      title: "Net income",
      description:
        "+/- per month",
      header: <Skeleton />,
      className: "md:col-span-2",
      icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
      edit: false,
    },
    {
      title: "Utility costs",
      description: "(e.g., water, electricity, gas)",
      header: <Skeleton />,
      className: "md:col-span-2",
      icon: <IconWavesElectricity className="h-4 w-4 text-blue-500" />,
      edit: true,
    },
    {
      title: "Maintenance requests",
      description: "Most recent maintenance requests",
      header: <MaintenanceTable />,
      className: "md:col-span-1",
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