import * as React from "react"
import { MaintenanceTable } from "@/components/maintenance/MaintenanceTable"
import { getTasks, getCurrentProperty, getUser } from "@/utils/supabase/actions"

export default async function Maintenance() {
  const data = await getTasks()
  const currentPropertyId = await getCurrentProperty()
  const user = await getUser();
  if (!user) {
    return <></>;
  }
  const userId = user?.id;

  return (
    <>
      <MaintenanceTable tasks={data} key={currentPropertyId} userId={userId} />
    </>
  )
}
