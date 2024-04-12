import { getTasks } from "@/app/_lib/queries"
import { searchParamsSchema } from "@/app/_lib/validations"
import type { SearchParams } from "@/types"
import { TasksTable } from "@/app/_components/tasks-table"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import * as React from "react"
import { DateRangePicker } from '@/components/data-table/date-range-picker'


export interface IndexPageProps {
  params: { property_id: string }
  searchParams: SearchParams
}

export default function Maintenance({ params, searchParams } : IndexPageProps ) {
  const search = searchParamsSchema.parse(searchParams)

  // const tasksPromise = getTasks(search)
  const tasksPromise = getTasks(search).then((tasks) => {
    console.log('Fetched tasks:', tasks);
    return tasks;
  }).catch((error) => {
    console.error('Error fetching tasks:', error);    throw error;
  });


  return (
    <>
      <div className="p-6 md:p-8" >
        <DateRangePicker
          triggerSize="sm"
          triggerClassName="ml-auto w-56 sm:w-60"
          align="end"
        />
        <React.Suspense
          fallback={
            <DataTableSkeleton
              columnCount={5}
              searchableColumnCount={1}
              filterableColumnCount={2}
              cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
              shrinkZero
            />
          }
        >
          <TasksTable tasksPromise={tasksPromise} />
        </React.Suspense>
      </div>
    </>
  )
}