// import { getTasks } from "@/app/_lib/queries"
import { searchParamsSchema } from "@/app/_lib/validations"
import type { SearchParams } from "@/types"
import { TasksTable } from "@/app/_components/tasks-table"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import * as React from "react"
import { DateRangePicker } from '@/components/data-table/date-range-picker'
import { TasksTableProvider } from "@/app/_components/tasks-table-provider"
import { MaintenanceTable } from "@/components/maintenance/MaintenanceTable"
import { getTasks } from "@/utils/supabase/actions"

export interface IndexPageProps {
  params: { property_id: string }
  searchParams: SearchParams
}

export default async function Maintenance({ params, searchParams } : IndexPageProps ) {
  const data = await getTasks()
  return (
    <>
      <MaintenanceTable tasks={data} />
    </>
  )
}