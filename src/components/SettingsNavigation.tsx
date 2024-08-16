"use client"
import { useState } from 'react';
import { redirect } from 'next/navigation';
import { Button } from '@/components/catalyst/Button';
import { RentCard } from '@/components/PropertySettings/RentCard'
import { InviteCard } from '@/components/PropertySettings/InviteCard'
import { DeleteCard } from '@/components/PropertySettings/DeleteCard'


interface SettingsNavigationProps {
  currentPropertyId: string;
}

const NavButton = ({ active, onClick, children }: { active: boolean, onClick: () => void, children: React.ReactNode }) => (
  <button className="w-full justify-start text-left"
    onClick={onClick}
  >
    {children}
  </button>
);

export function SettingsNavigation({ currentPropertyId }: SettingsNavigationProps) {
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
    <div className="flex">
      {/* Vertical Navbar */}
      <nav className="w-64 p-4 space-y-4">
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
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

