"use client";
import { useState, useCallback, useMemo } from "react";
import { RentCard } from "@/components/PropertySettings/RentCard";
import { InviteCard } from "@/components/PropertySettings/InviteCard";
import { DeleteCard } from "@/components/PropertySettings/DeleteCard";
import { Heading } from "@/components/catalyst/heading";
import { Divider } from "@/components/catalyst/divider";
import { Text, Strong } from "@/components/catalyst/text";
import { useRouter } from "next/navigation";
import { mutate } from "swr";

interface SettingsNavigationProps {
	currentPropertyId: string;
	lease: any | null;
	key: string;
	initialTab?: string;
	plaidAccounts: any[] | null;
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
		className={`w-full cursor-default rounded-md px-4 py-2 text-left text-sm transition-colors ${active ? "bg-gray-100 dark:bg-black" : ""}`}
	>
		<Text>{active ? <Strong>{children}</Strong> : children}</Text>
	</button>
);

export default function SettingsNavigation({
	currentPropertyId,
	lease,
	initialTab,
	plaidAccounts,
}: SettingsNavigationProps) {
	const [activeTab, setActiveTab] = useState(initialTab || "General");

	const handleTabChange = (tab: string) => {
		mutate("lease");
		setActiveTab(tab);
	};

	const tabs = useMemo(
		() => [
			{ name: "General", component: RentCard },
			{ name: "Tenants", component: InviteCard },
			{ name: "Delete", component: DeleteCard },
		],
		[],
	);

	const memoizedInviteCard = useMemo(
		() => <InviteCard propertyId={currentPropertyId} />,
		[currentPropertyId],
	);

	const memoizedDeleteCard = useMemo(
		() => <DeleteCard propertyId={currentPropertyId} />,
		[currentPropertyId],
	);

	const renderContent = () => {
		switch (activeTab) {
			case "General":
				return (
					<RentCard
						propertyId={currentPropertyId}
						lease={lease}
						// propertyRent={propertyRent}
						// securityDeposit={securityDeposit}
						// propertyFees={propertyFees}
						buttonOnClick={() => handleTabChange("Tenants")}
						plaidAccounts={plaidAccounts}
					/>
				);
			case "Tenants":
				return memoizedInviteCard;
			case "Delete":
				return memoizedDeleteCard;
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
				<RentCard
					propertyId={currentPropertyId}
					lease={lease}
					plaidAccounts={plaidAccounts}
				/>
				<InviteCard propertyId={currentPropertyId} />
				<DeleteCard propertyId={currentPropertyId} />
			</div>
		</div>
	);
}
