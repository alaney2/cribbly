import Link from 'next/link';
import { DesktopSidebar, MobileSidebar } from '@/components/Sidebars';
import Map from '@/components/Map';
import { DynamicMap } from '@/components/DynamicMap';
import { MapBox } from '@/components/MapBox';

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

            {/* <DynamicMap /> */}
            <MapBox />
            {/* <iframe width='100%' height="100%" src="https://api.mapbox.com/styles/v1/alan3y2/clq361ynz002t01ql64d81csd.html?title=false&access_token=pk.eyJ1IjoiYWxhbjN5MiIsImEiOiJjbHEzNXJ6ZDcwOWEwMmxvYnF1dzF4ZWN1In0.SOVZ1N2VP0ktHmDp8IoZXQ&zoomwheel=false#1.65/42.9/-58.8" title="Streets" ></iframe> */}
          </main>
        </div>
      </div>
    </>
  )
}
