import { MaintenanceTable } from '@/components/maintenance/MaintenanceTable'

export function BentoMaintenanceTable({ tasks }: { tasks: any[] }) {
  return (
    <div className="mt-0 flow-root overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <MaintenanceTable tasks={tasks} bento={true} />
      </div>
    </div>
  )
}
