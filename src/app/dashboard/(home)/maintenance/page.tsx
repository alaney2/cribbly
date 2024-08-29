import * as React from "react"
import { MaintenanceTable } from "@/components/maintenance/MaintenanceTable"
import { getTasks, getCurrentProperty } from "@/utils/supabase/actions"

export default async function Maintenance() {
  const data = await getTasks()
  const currentPropertyId = await getCurrentProperty()

  return (
    <>
      <MaintenanceTable tasks={data} key={currentPropertyId} />
    </>
  )
}
