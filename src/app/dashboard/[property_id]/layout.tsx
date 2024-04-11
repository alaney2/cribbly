"use server"
import { MobileSidebar } from '@/components/MobileSidebar';
import { DesktopSidebar } from '@/components/DesktopSidebar'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next'


type Props = {
  params: { property_id: string }
  searchParams: { [key: string]: string | string[] | undefined }
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
        <MobileSidebar user={data} />
        <div className="mx-auto flex w-full h-full items-start gap-x-6 lg:gap-x-8 py-4 lg:px-8 px-4 sm:px-6 lg:mt-8">
          <aside className={`lg:sticky top-0 left-4 flex-col overflow-y-auto absolute hidden lg:block`}>
            <DesktopSidebar user={data} />
          </aside>
          <main className="flex-1 bg-white rounded-3xl shadow-md lg:block lg:mr-8 p-6 md:p-8 overflow-auto content-container">
            {children}
          </main>
        </div>
      </div>
    </>
  )
}

