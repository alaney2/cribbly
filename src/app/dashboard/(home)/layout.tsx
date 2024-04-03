import Link from 'next/link';
import { MobileSidebarDashboard } from '@/components/MobileSidebarDashboard';
import { DesktopSidebarDashboard } from '@/components/DesktopSidebarDashboard'
import { MapBox } from '@/components/MapBox';
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation';


export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  let { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/sign-in')
  }

  return (
    <>
      <div className='h-full flex flex-col'>
        <MobileSidebarDashboard user={user} />
        <div className="mx-auto flex w-full items-start gap-x-6 lg:gap-x-8 pt-4 px-4 sm:px-6 lg:px-10 lg:mt-8">
          <aside className={`lg:sticky top-16 left-4 flex-col overflow-y-auto absolute hidden lg:block`}>
            <DesktopSidebarDashboard />
          </aside>
          <main className="flex-1 bg-white rounded-t-3xl shadow-md lg:block lg:mr-8">
            {children}
          </main>
        </div>
      </div>
    </>
  )
}
