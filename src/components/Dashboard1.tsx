import Link from 'next/link';
import { DesktopSidebar, MobileSidebar } from '@/components/Sidebars';
import Map from '@/components/Map';
import { DynamicMap } from '@/components/DynamicMap';


export default function Dashboard1() {

  return (
    <>
      <div className='lg:min-h-full flex flex-col bg-gray-100'>
        <MobileSidebar />
        {/* Static sidebar for desktop */}
        <div className="mx-auto flex w-full h-full items-start gap-x-8 lg:p-8 sm:px-6 lg:mt-8">
          <aside className={`lg:sticky top-16 left-4 flex-col mt-2 gap-y-5 overflow-y-auto absolute hidden lg:block`}>
            <DesktopSidebar />
          </aside>

          <main className="flex-1 bg-white h-full rounded-3xl shadow-md hidden lg:block lg:mr-8">
            {/* Main area */}

            <DynamicMap />
          </main>
        </div>
      </div>
    </>
  )
}
