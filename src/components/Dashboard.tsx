import Link from 'next/link';
import { DesktopSidebar, MobileSidebar } from '@/components/Sidebars';
import Map from '@/components/Map';
import { DynamicMap } from '@/components/DynamicMap';
import { MapBox } from '@/components/MapBox';

export default function Dashboard1() {

  return (
    <>
      <div className='min-h-full flex flex-col bg-gray-100'>
        
        <MobileSidebar />
        <div className="mx-auto flex w-full h-full items-start gap-x-8 pb-6 pt-4 lg:p-8 px-4 sm:px-6 lg:mt-8">
          <aside className={`lg:sticky top-16 left-4 flex-col mt-2 gap-y-5 overflow-y-auto absolute hidden lg:block`}>
            <DesktopSidebar />
          </aside>

          <main className="flex-1 bg-white h-full rounded-3xl shadow-md lg:block lg:mr-8">
            <MapBox />
          </main>
        </div>
      </div>
    </>
  )
}
