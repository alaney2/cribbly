import Link from 'next/link';
import { DesktopSidebar, MobileSidebar } from '@/components/Sidebars';
import { MapBox } from '@/components/MapBox';
import { PropertiesGrid } from '@/components/PropertiesGrid';

export default function Dashboard() {

  return (
    <>
      {/* <MapBox /> */}
      <PropertiesGrid />
    </>
  )
}
