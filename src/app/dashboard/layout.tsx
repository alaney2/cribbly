import Link from 'next/link';
import { MobileSidebar } from '@/components/MobileSidebar';
import { DesktopSidebar } from '@/components/DesktopSidebar'

import { MapBox } from '@/components/MapBox';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <>
      <div className='min-h-full flex flex-col bg-gray-100 overscroll-none'>
        <MobileSidebar />
        <div className="mx-auto flex w-full h-full items-start gap-x-8 pb-6 pt-4 lg:p-8 px-4 sm:px-6 lg:mt-8">
          <aside className={`lg:sticky top-16 left-4 flex-col mt-2 gap-y-5 overflow-y-auto absolute hidden lg:block`}>
            <DesktopSidebar />
          </aside>

          <main className="flex-1 bg-white h-full rounded-3xl shadow-md lg:block lg:mr-8 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </>
  )
}
