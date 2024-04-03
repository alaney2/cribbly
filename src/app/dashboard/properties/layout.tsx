import Link from 'next/link';
import { MobileSidebar } from '@/components/MobileSidebar';
import { DesktopSidebar } from '@/components/DesktopSidebar'
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
      <div className='h-full overflow-hidden flex flex-col bg-gray-100 overscroll-none lg:overscroll-auto'>
        <MobileSidebar user={user} />
        <div className="mx-auto flex w-full h-full items-start gap-x-6 lg:gap-x-8 pt-4 lg:px-10 px-4 sm:px-6 lg:mt-8">
          <aside className={`lg:sticky top-0 left-4 flex-col overflow-y-auto absolute hidden lg:block`}>
            <DesktopSidebar />
          </aside>
          <main className="flex-1 bg-white h-full rounded-t-3xl shadow-md lg:block lg:mr-8 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </>
  )
}
