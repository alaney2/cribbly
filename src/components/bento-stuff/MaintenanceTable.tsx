"use client"
import { createClient } from '@/utils/supabase/client'
import useSWR from 'swr';
import { toast } from 'sonner'
import { useParams } from 'next/navigation'


const fetcher = async (property_id: string) => {
  const supabase = createClient();
  let { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return
  }
  const { data, error } = await supabase
    .from('shadcn_tasks')
    .select('*')
    .eq('user_id', user!.id)
    .eq('property_id', property_id)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) throw error;
  return data;
};

export function MaintenanceTable() {
  const params = useParams<{ property_id: string }>()

  const { data: tasks, error, isLoading } = useSWR(['tasks', params.property_id], ([_, property_id]) =>
    fetcher(property_id)
  );
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  return (
    <div>
      <div className="mt-0 flow-root overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <table className="w-full text-left" suppressHydrationWarning>
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
            {isLoading && (
                <tr>
                  <td colSpan={4}>
                    <div className="animate-pulse">
                      <div className="h-8 bg-gray-200 rounded w-full my-4"></div>
                      <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded w-full"></div>
                    </div>
                  </td>
                </tr>
              )
            }
            {tasks && tasks.map((task) => (
                <tr key={task.code}>
                  <td className="relative py-4 pr-3 text-sm font-medium text-gray-900">
                    {task.title}
                    <div className="absolute bottom-0 right-full h-px w-screen bg-gray-100" />
                    <div className="absolute bottom-0 left-0 h-px w-screen bg-gray-100" />
                  </td>
                  <td className="hidden max-w-xs px-3 py-4 text-sm text-gray-500 sm:table-cell truncate text-ellipsis overflow-hidden whitespace-nowrap">{task.description}</td>
                  <td className="hidden px-3 py-4 text-sm text-gray-500 md:table-cell">{formatDate(String(task.created_at))}</td>
                  <td className="px-3 py-4 text-sm text-gray-500">{task.cost}</td>
                </tr>
              ))
            }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
