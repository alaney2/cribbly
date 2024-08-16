"use client"
import {
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from '@/components/catalyst/sidebar'
import {
  Cog6ToothIcon,
  DocumentTextIcon,
  HomeIcon,
  MegaphoneIcon,
  Square2StackIcon,
  TicketIcon,
  WrenchIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/20/solid'
import { usePathname } from 'next/navigation'
import { useGetDashboardURL } from '@/utils/useGetDashboardURL'

export function AppLayoutLinks() {
  const pathname = usePathname()
  const getDashboardURL = useGetDashboardURL()

  return (
    <SidebarSection>
      <SidebarItem href={'/dashboard'} current={pathname === '/dashboard'}>
        <HomeIcon />
        <SidebarLabel>Home</SidebarLabel>
      </SidebarItem>
      <SidebarItem href={'/dashboard/tenants'} current={pathname === '/dashboard/tenants'}>
        <Square2StackIcon />
        <SidebarLabel>Tenants</SidebarLabel>
      </SidebarItem>
      <SidebarItem href={'/dashboard/maintenance'} current={pathname.startsWith('/dashboard/maintenance')}>
        <WrenchIcon />
        <SidebarLabel>Maintenance</SidebarLabel>
      </SidebarItem>
      <SidebarItem href={'/dashboard/documents'} current={pathname === '/dashboard/documents'}>
        <DocumentTextIcon />
        <SidebarLabel>Documents</SidebarLabel>
      </SidebarItem>
      <SidebarItem href={'/dashboard/settings'} current={pathname === '/dashboard/settings'}>
        <Cog6ToothIcon />
        <SidebarLabel>Settings</SidebarLabel>
      </SidebarItem>
      {/* <SidebarItem href={'/dashboard/delete-property'} current={pathname === '/dashboard/delete-property'}>
        <MegaphoneIcon />
        <SidebarLabel>Delete property</SidebarLabel>
      </SidebarItem> */}
    </SidebarSection>
  )
}