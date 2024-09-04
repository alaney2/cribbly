"use client";
import { useState, useEffect } from "react";
import { RentCard } from "@/components/PropertySettings/RentCard";
import { InviteCard } from "@/components/PropertySettings/InviteCard";
import { DeleteCard } from "@/components/PropertySettings/DeleteCard";
import { Heading } from "@/components/catalyst/heading";
import { Divider } from "@/components/catalyst/divider";
import { Text, Strong } from "@/components/catalyst/text";

interface SettingsNavigationProps {
	currentPropertyId: string;
	propertyRent: any | null;
	securityDeposit: any | null;
	propertyFees: any[] | null;
	key: string;
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
		className={
			"w-full cursor-default rounded-md px-4 py-2 text-left text-sm transition-colors hover:bg-gray-100 dark:hover:bg-black"
		}
		onClick={onClick}
	>
		<Text>{active ? <Strong>{children}</Strong> : children}</Text>
	</button>
);

export default function SettingsNavigation({
	currentPropertyId,
	propertyRent,
	securityDeposit,
	propertyFees,
	initialTab,
}: SettingsNavigationProps) {
	const [activeTab, setActiveTab] = useState(initialTab || "General");

	const handleTabChange = (tab: string) => {
		setActiveTab(tab);
	};

	const renderContent = () => {
		switch (activeTab) {
			case "General":
				return (
					<RentCard
						propertyId={currentPropertyId}
						propertyRent={propertyRent}
						securityDeposit={securityDeposit}
						propertyFees={propertyFees}
					/>
				);
			case "Tenants":
				return <InviteCard propertyId={currentPropertyId} />;
			case "Delete":
				return <DeleteCard propertyId={currentPropertyId} />;
			default:
				return null;
		}
	};

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
							active={activeTab === "General"}
							onClick={() => handleTabChange("General")}
						>
							General
						</NavButton>
						<NavButton
							active={activeTab === "Tenants"}
							onClick={() => handleTabChange("Tenants")}
						>
							Invite Tenants
						</NavButton>
						<NavButton
							active={activeTab === "Delete"}
							onClick={() => handleTabChange("Delete")}
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
	);
}
