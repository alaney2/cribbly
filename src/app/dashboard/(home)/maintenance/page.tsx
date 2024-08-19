import { getTasks } from "@/app/_lib/queries"
import { searchParamsSchema } from "@/app/_lib/validations"
import type { SearchParams } from "@/types"
import { TasksTable } from "@/app/_components/tasks-table"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import * as React from "react"
import { DateRangePicker } from '@/components/data-table/date-range-picker'
import { TasksTableProvider } from "@/app/_components/tasks-table-provider"
import { MaintenanceTable } from "@/components/maintenance/MaintenanceTable"

export interface IndexPageProps {
  params: { property_id: string }
  searchParams: SearchParams
}

export default function Maintenance({ params, searchParams } : IndexPageProps ) {
  const search = searchParamsSchema.parse(searchParams)
  const tasksPromise = getTasks(search, params.property_id);

  return (
    <>
      <div className="" >
        <MaintenanceTable />
      </div>
    </>
  )
}