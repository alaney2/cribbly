const maintenances = [
  { name: 'Paint wall', description: 'Lorem ipsum dolor sit amet consectetur adipisicing adipisicing adipisicing adipisicing.', date: '7/31/2002', cost: 100 },
  { name: 'Lorem', description: 'Lorem ipsum dolor', date: '07/31/2002', cost: 100 },
  { name: 'Ipsum', description: 'Lorem ipsum dolor', date: '7/30/2002', cost: 100 },
  { name: 'Fix table', description: 'Lorem ipsum dolor', date: '06/31/2003', cost: 100 },
  { name: 'Swimming pool', description: 'Lorem ipsum dolor', date: '7/31/2004', cost: 100 },
  { name: 'Laundry', description: 'Lorem ipsum dolor', date: '7/28/2003', cost: 100 },
  { name: 'Dryer', description: 'Lorem ipsum dolor', date: '08/01/2003', cost: 100 },
]

const sortedMaintenances = maintenances.sort((a, b) => {
  const dateA = new Date(a.date).getTime();
  const dateB = new Date(b.date).getTime();
  return dateB - dateA;
});

const recentMaintenances = sortedMaintenances.slice(0, 3);

export function MaintenanceTable() {
  
  return (
    <div>
      <div className="mt-0 flow-root overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <table className="w-full text-left">
            <thead className="bg-white">
              <tr>
                <th scope="col" className="relative isolate py-3.5 pr-3 text-left text-sm font-semibold text-gray-900">
                  Task
                  <div className="absolute inset-y-0 right-full -z-10 w-screen border-b border-b-gray-200" />
                  <div className="absolute inset-y-0 left-0 -z-10 w-screen border-b border-b-gray-200" />
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                >
                  Details
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Cost
                </th>
              </tr>
            </thead>
            <tbody>
              {recentMaintenances.map((maintenance) => (
                <tr key={maintenance.name}>
                  <td className="relative py-4 pr-3 text-sm font-medium text-gray-900">
                    {maintenance.name}
                    <div className="absolute bottom-0 right-full h-px w-screen bg-gray-100" />
                    <div className="absolute bottom-0 left-0 h-px w-screen bg-gray-100" />
                  </td>
                  <td className="hidden max-w-xs px-3 py-4 text-sm text-gray-500 sm:table-cell truncate text-ellipsis overflow-hidden whitespace-nowrap">{maintenance.description}</td>
                  <td className="hidden px-3 py-4 text-sm text-gray-500 md:table-cell">{maintenance.date}</td>
                  <td className="px-3 py-4 text-sm text-gray-500">{maintenance.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
