import '@/styles/no-overscroll.css'
import { MobileTenantSidebar } from '@/components/MobileTenantSidebar';
import { DesktopTenantSidebar } from '@/components/DesktopTenantSidebar'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation';
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Tenant Dashboard',
}

export default async function TenantDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient()
  let { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/sign-in')

  let { data } = await supabase.from('users').select()
    .eq('id', user.id)
    .single()

  return (
    <>
      <div className='h-full w-screen flex flex-col'>
        <MobileTenantSidebar userEmail={data?.email} fullName={data?.full_name} />
        <div className="mx-auto flex w-full h-full items-start gap-x-6 lg:gap-x-8 py-4 lg:px-8 px-4 sm:px-6 lg:mt-8">
          <aside className={`lg:sticky top-0 left-4 flex-col overflow-y-auto absolute hidden lg:block`}>
            <DesktopTenantSidebar fullName={data?.full_name} sidebarCollapsed={data?.is_sidebar_collapsed} />
          </aside>
          <main className="flex-1 lg:bg-white lg:rounded-3xl lg:shadow-md lg:block lg:mr-8 p-2 lg:p-8 overflow-auto content-container">
            {children}
          </main>
        </div>
      </div>
    </>
  )
}

