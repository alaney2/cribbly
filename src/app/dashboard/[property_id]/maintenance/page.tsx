import { getTasks } from "@/app/_lib/queries"
import { searchParamsSchema } from "@/app/_lib/validations"
import type { SearchParams } from "@/types"
import { TasksTable } from "@/app/_components/tasks-table"

// const maintenances = [
//   { name: 'Paint wall', description: 'Lorem ipsum dolor sit amet consectetur adipisicing adipisicing adipisicing adipisicing.', date: '7/31/2002', cost: 100 },
//   { name: 'Lorem', description: 'Lorem ipsum dolor', date: '07/31/2002', cost: 100 },
//   { name: 'Ipsum', description: 'Lorem ipsum dolor', date: '7/30/2002', cost: 100 },
//   { name: 'Fix table', description: 'Lorem ipsum dolor', date: '06/31/2003', cost: 100 },
//   { name: 'Swimming pool', description: 'Lorem ipsum dolor', date: '7/31/2004', cost: 100 },
//   { name: 'Laundry', description: 'Lorem ipsum dolor', date: '7/28/2003', cost: 100 },
//   { name: 'Dryer', description: 'Lorem ipsum dolor', date: '08/01/2003', cost: 100 },
// ]

// const sortedMaintenances = maintenances.sort((a, b) => {
//   const dateA = new Date(a.date).getTime();
//   const dateB = new Date(b.date).getTime();
//   return dateB - dateA;
// });

export interface IndexPageProps {
  params: { property_id: string }
  searchParams: SearchParams
}

export default function Maintenance({ params, searchParams } : IndexPageProps ) {
  const search = searchParamsSchema.parse(searchParams)

  const tasksPromise = getTasks(search)

  return (
    <>
      <div className="p-6 md:p-8" >
        <TasksTable tasksPromise={tasksPromise} />
      </div>
    </>
  )
}