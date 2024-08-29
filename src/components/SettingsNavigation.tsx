'use client'
import { useState } from 'react'
import { RentCard } from '@/components/PropertySettings/RentCard'
import { InviteCard } from '@/components/PropertySettings/InviteCard'
import { DeleteCard } from '@/components/PropertySettings/DeleteCard'
import { Heading } from '@/components/catalyst/heading'
import { Divider } from '@/components/catalyst/divider'

interface SettingsNavigationProps {
  currentPropertyId: string
  propertyRent: any | null
  securityDeposit: any | null
  propertyFees: any[] | null
  key: string
}

const NavButton = ({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) => (
  <button
    className={`w-full cursor-default rounded-md px-4 py-2 text-left text-sm transition-colors ${
      active
        ? 'bg-gray-100 font-medium text-gray-900'
        : 'text-gray-600 hover:bg-gray-100'
    }`}
    onClick={onClick}
  >
    {children}
  </button>
)

export default function SettingsNavigation({
  currentPropertyId,
  propertyRent,
  securityDeposit,
  propertyFees,
}: SettingsNavigationProps) {
  const [activeTab, setActiveTab] = useState('General')

  const renderContent = () => {
    switch (activeTab) {
      case 'General':
        return (
          <RentCard
            propertyId={currentPropertyId}
            propertyRent={propertyRent}
            securityDeposit={securityDeposit}
            propertyFees={propertyFees}
          />
        )
      case 'Invite Tenants':
        return <InviteCard propertyId={currentPropertyId} />
      case 'Delete':
        return <DeleteCard propertyId={currentPropertyId} />
      default:
        return null
    }
  }

  return (
    <div className="">
      <div className="py- hidden px-4 lg:block">
        <Heading className="ml-2 text-2xl font-semibold text-gray-900">
          Property Settings
        </Heading>
        <Divider className="my-8" />
      </div>

      <div className="hidden xl:flex">
        {/* Vertical Navbar */}
        <nav className="mr-6 w-64 overflow-y-auto pb-4 pt-12">
          <div className="space-y-1 px-3">
            <NavButton
              active={activeTab === 'General'}
              onClick={() => setActiveTab('General')}
            >
              General
            </NavButton>
            <NavButton
              active={activeTab === 'Invite Tenants'}
              onClick={() => setActiveTab('Invite Tenants')}
            >
              Invite Tenants
            </NavButton>
            <NavButton
              active={activeTab === 'Delete'}
              onClick={() => setActiveTab('Delete')}
            >
              Delete
            </NavButton>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto focus:outline-none">
          <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
            {renderContent()}
          </div>
        </main>
      </div>
      <div className="block space-y-6 xl:hidden">
        <RentCard
          propertyId={currentPropertyId}
          propertyRent={propertyRent}
          securityDeposit={securityDeposit}
          propertyFees={propertyFees}
        />
        <InviteCard propertyId={currentPropertyId} />
        <DeleteCard propertyId={currentPropertyId} />
      </div>
    </div>
  )
}
