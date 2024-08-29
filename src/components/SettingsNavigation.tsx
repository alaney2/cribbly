"use client"
import { useState } from 'react';
import { RentCard } from '@/components/PropertySettings/RentCard'
import { InviteCard } from '@/components/PropertySettings/InviteCard'
import { DeleteCard } from '@/components/PropertySettings/DeleteCard'
import { Heading } from '@/components/catalyst/heading'
import { Divider } from '@/components/catalyst/divider'

interface SettingsNavigationProps {
  currentPropertyId: string;
  propertyRent: any[];
  securityDeposit: any[];
  propertyFees: any[];
}

const NavButton = ({ active, onClick, children }: { active: boolean, onClick: () => void, children: React.ReactNode }) => (
  <button
    className={`w-full text-left py-2 px-4 text-sm rounded-md transition-colors cursor-default ${
      active
        ? 'bg-gray-100 text-gray-900 font-medium'
        : 'text-gray-600 hover:bg-gray-100'
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);

export default function SettingsNavigation({ currentPropertyId, propertyRent, securityDeposit, propertyFees }: SettingsNavigationProps) {
  const [activeTab, setActiveTab] = useState('General');

  const renderContent = () => {
    switch (activeTab) {
      case 'General':
        return <RentCard propertyId={currentPropertyId} />;
      case 'Invite Tenants':
        return <InviteCard propertyId={currentPropertyId} />;
      case 'Delete':
        return <DeleteCard propertyId={currentPropertyId} />;
      default:
        return null;
    }
  };

  return (
    <div className="">
      <div className="px-4 py- hidden lg:block">
        <Heading className="text-2xl font-semibold text-gray-900 ml-2">Property Settings</Heading>
        <Divider className="my-8" />
      </div>

      <div className="hidden xl:flex">
        {/* Vertical Navbar */}
        <nav className="w-64 pt-12 pb-4 overflow-y-auto mr-6">
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
          <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {renderContent()}
          </div>
        </main>
      </div>
      <div className="block xl:hidden space-y-6">
        <RentCard propertyId={currentPropertyId} />
        <InviteCard propertyId={currentPropertyId} />
        <DeleteCard propertyId={currentPropertyId} />
      </div>
    </div>
  );
}