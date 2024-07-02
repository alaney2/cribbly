"use client"
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from '@/components/catalyst/sidebar'
import {
  Cog6ToothIcon,
  HomeIcon,
  InboxIcon,
  MagnifyingGlassIcon,
  MegaphoneIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  Square2StackIcon,
  TicketIcon,
} from '@heroicons/react/20/solid'
import { usePathname } from 'next/navigation'
import { useGetDashboardURL } from '@/utils/useGetDashboardURL'

export function AppLayoutLinks() {
  const pathname = usePathname()
  const getDashboardURL = useGetDashboardURL()

  return (
    <SidebarSection>
      <SidebarItem href={getDashboardURL()} current={pathname === getDashboardURL()}>
        <HomeIcon />
        <SidebarLabel>Home</SidebarLabel>
      </SidebarItem>
      <SidebarItem href={getDashboardURL('tenants')} current={pathname === getDashboardURL('tenants')}>
        <Square2StackIcon />
        <SidebarLabel>Tenants</SidebarLabel>
      </SidebarItem>
      <SidebarItem href={getDashboardURL('maintenance')} current={pathname === getDashboardURL('maintenance')}>
        <TicketIcon />
        <SidebarLabel>Maintenance</SidebarLabel>
      </SidebarItem>
      <SidebarItem href={getDashboardURL('documents')} current={pathname === getDashboardURL('documents')}>
        <Cog6ToothIcon />
        <SidebarLabel>Documents</SidebarLabel>
      </SidebarItem>
      <SidebarItem href={getDashboardURL('settings')} current={pathname === getDashboardURL('settings')}>
        <MegaphoneIcon />
        <SidebarLabel>Settings</SidebarLabel>
      </SidebarItem>
      <SidebarItem href={getDashboardURL('delete-property')} current={pathname === getDashboardURL('delete-property')}>
        <MegaphoneIcon />
        <SidebarLabel>Delete property</SidebarLabel>
      </SidebarItem>
    </SidebarSection>
  )
}