"use client";
import { useState, useCallback, useMemo } from "react";
import { RentCard } from "@/components/PropertySettings/RentCard";
import { InviteCard } from "@/components/PropertySettings/InviteCard";
import { DeleteCard } from "@/components/PropertySettings/DeleteCard";
import { Heading } from "@/components/catalyst/heading";
import { Divider } from "@/components/catalyst/divider";
import { Text, Strong } from "@/components/catalyst/text";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import { createClient } from "@/utils/supabase/client";
import { useCurrentProperty } from "@/contexts/CurrentPropertyContext";
import { BankCard } from "@/components/PropertySettings/BankCard";

interface SettingsNavigationProps {
  initialTab?: string;
}

const NavButton = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full cursor-default rounded-md px-4 py-2 text-left text-sm transition-colors duration-50 ${active ? "bg-gray-100 dark:bg-black" : ""}`}
  >
    <Text>{active ? <Strong>{children}</Strong> : children}</Text>
  </button>
);

export default function SettingsNavigation({
  initialTab,
}: SettingsNavigationProps) {
  const router = useRouter();
  const { currentPropertyId } = useCurrentProperty();
  if (!currentPropertyId) {
    return null;
  }
  const [activeTab, setActiveTab] = useState(initialTab || "Bank");

  const handleTabChange = (tab: string) => {
    mutate("lease");
    setActiveTab(tab);
    if (tab === "Payments") {
      router.push("/dashboard/settings/payments");
    }
  };

  const tabs = useMemo(
    () => [
      { name: "Bank", component: BankCard },
      { name: "Payments", component: null },
      { name: "Delete", component: DeleteCard },
    ],
    []
  );

  const renderContent = () => {
    switch (activeTab) {
      case "Bank":
        return <BankCard />;
      case "Delete":
        return <DeleteCard propertyId={currentPropertyId} />;
      default:
        return null;
    }
  };

  return (
    <div className="">
      <div className="hidden lg:block">
        <Heading className="ml-2 text-2xl font-semibold text-gray-900">
          Property Settings
        </Heading>
        <Divider className="mb-8 mt-4" />
      </div>

      <div className="hidden xl:flex max-w-5xl mx-auto">
        {/* Vertical Navbar */}
        <nav className="ml-4 w-64 overflow-y-auto pb-4 pt-12">
          <div className="space-y-1 px-3">
            {tabs.map((tab) => (
              <NavButton
                key={tab.name}
                active={activeTab === tab.name}
                onClick={() => handleTabChange(tab.name)}
              >
                {tab.name}
              </NavButton>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto focus:outline-none">
          <div className="mx-auto px-4 py-6 sm:px-6 lg:px-8">
            {renderContent()}
          </div>
        </main>
      </div>
      <div className="block space-y-6 xl:hidden max-w-xl mx-auto">
        <BankCard />
        <DeleteCard propertyId={currentPropertyId} />
      </div>
    </div>
  );
}
