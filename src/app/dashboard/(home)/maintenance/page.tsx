import type { SearchParams } from "@/types"
import * as React from "react"
import { MaintenanceTable } from "@/components/maintenance/MaintenanceTable"
import { getTasks } from "@/utils/supabase/actions"


export default async function Maintenance() {
  const data = await getTasks()
  return (
    <>
      <MaintenanceTable tasks={data} />
    </>
  )
}
