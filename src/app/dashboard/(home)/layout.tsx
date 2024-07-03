// "use server"
// import '@/styles/no-overscroll.css'
import { MobileSidebar } from '@/components/MobileSidebar';
import { DesktopSidebar } from '@/components/DesktopSidebar'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next'
import { PropertyBreadcrumbs } from '@/components/Dashboard/PropertyBreadcrumbs'
import { AppLayout } from '@/components/AppLayout'

type Props = {
  params: { property_id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/sign-in')
  let currentPropertyId = user.user_metadata.currentPropertyId

  const { data: propertyData, error } = await supabase.from('properties')
    .select()
    .eq('id', currentPropertyId)

  if (error || propertyData.length === 0) {
    console.log('why')
    console.log(error)
    console.log(propertyData)
    redirect('/dashboard')
  }

  return {
    title: propertyData[0]?.street_address,
  }
}

export default async function PropertyDashboardLayout({
  params,
  children,
}: {
  params: { property_id: string };
  searchParams: any,
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
      <div className='h-full flex flex-col'>
        <AppLayout userEmail={data?.email} fullName={data?.full_name ?? undefined} userId={user.id}>{children}
        </AppLayout>
        {/* <MobileSidebar userEmail={data?.email} fullName={data?.full_name} />
        <div className="absolute left-64 top-4 overflow-hidden hidden lg:block">
          <PropertyBreadcrumbs />
        </div>
        <div className="mx-auto flex w-full h-full items-start gap-x-6 lg:gap-x-8 py-4 lg:px-8 px-4 sm:px-6 lg:mt-8">
          <aside className={`lg:sticky top-0 left-4 flex-col overflow-y-auto absolute hidden lg:block`}>
            <DesktopSidebar fullName={data?.full_name} sidebarCollapsed={data?.is_sidebar_collapsed} />
          </aside>
          <main className="flex-1 lg:bg-white lg:rounded-3xl lg:shadow-md lg:block lg:mr-8 p-2 lg:p-8 content-container min-h-full">
            {children}
          </main>
        </div> */}
      </div>
    </>
  )
}

