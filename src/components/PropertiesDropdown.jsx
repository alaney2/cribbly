"use client"
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@/components/catalyst/dropdown'
import {
  SidebarItem,
  SidebarLabel,
} from '@/components/catalyst/sidebar'
import {
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  PlusIcon,
} from '@heroicons/react/16/solid'
import { updateCurrentProperty } from '@/utils/supabase/actions'
import { useRouter } from "next/navigation"
import { useSWRConfig } from 'swr'

export function PropertiesDropdown({properties, currentPropertyId, streetAddress}) {
  const { mutate } = useSWRConfig()

  return (
    <Dropdown>
      <DropdownButton as={SidebarItem} className="lg:mb-2.5">
        {/* <Avatar src="/tailwind-logo.svg" /> */}
        <SidebarLabel>{streetAddress}</SidebarLabel>
        <ChevronDownIcon />
      </DropdownButton>
      
      <DropdownMenu className="min-w-80 lg:min-w-64" anchor="bottom start">
        {properties && properties.map((property, index) => (
          <DropdownItem
            key={property.id}
            // href={`/dashboard`}
            onClick={async () => {
              await updateCurrentProperty(property.id)
              mutate(['propertyRent', property.id])
              mutate(['tenants', property.id])
              mutate(`documents-${property.id}`)
            }}
          >
            {property.id === currentPropertyId && (
              <div className="bg-blue-500 h-4 w-4 rounded-full" />
            )}
            <DropdownLabel>{property.street_address}</DropdownLabel>
          </DropdownItem>
        ))}

        <DropdownDivider />
        <DropdownItem href="/dashboard/add-property">
          <PlusIcon />
          <DropdownLabel>Add property&hellip;</DropdownLabel>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}