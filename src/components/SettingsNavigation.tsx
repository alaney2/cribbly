"use client";
import { useState, useCallback, useMemo } from "react";
import { RentCard } from "@/components/PropertySettings/RentCard";
import { InviteCard } from "@/components/PropertySettings/InviteCard";
import { DeleteCard } from "@/components/PropertySettings/DeleteCard";
import { Heading } from "@/components/catalyst/heading";
import { Divider } from "@/components/catalyst/divider";
import { Text, Strong } from "@/components/catalyst/text";
import { useRouter } from "next/navigation";
interface SettingsNavigationProps {
	currentPropertyId: string;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	propertyRent: any | null;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	securityDeposit: any | null;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
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
		className={`w-full cursor-default rounded-md px-4 py-2 text-left text-sm transition-colors ${active ? "bg-gray-100" : "dark:bg-black"}`}
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
	const router = useRouter();
	router.prefetch("/dashboard/settings/tenants");
	router.prefetch("/dashboard/settings/delete");
	router.prefetch("/dashboard/settings/general");

	const handleTabChange = useCallback(
		(tab: string) => {
			router.replace(`/dashboard/settings/${tab.toLowerCase()}`);
			setActiveTab(tab);
		},
		[router],
	);

	const tabs = useMemo(
		() => [
			{ name: "General", component: RentCard },
			{ name: "Tenants", component: InviteCard },
			{ name: "Delete", component: DeleteCard },
		],
		[],
	);

	const memoizedRentCard = useMemo(
		() => (
			<RentCard
				propertyId={currentPropertyId}
				propertyRent={propertyRent}
				securityDeposit={securityDeposit}
				propertyFees={propertyFees}
				buttonOnClick={() => handleTabChange("Tenants")}
			/>
		),
		[
			currentPropertyId,
			propertyRent,
			securityDeposit,
			propertyFees,
			handleTabChange,
		],
	);

	const memoizedInviteCard = useMemo(
		() => <InviteCard propertyId={currentPropertyId} />,
		[currentPropertyId],
	);

	const memoizedDeleteCard = useMemo(
		() => <DeleteCard propertyId={currentPropertyId} />,
		[currentPropertyId],
	);

	const renderContent = useCallback(() => {
		switch (activeTab) {
			case "General":
				return memoizedRentCard;
			case "Tenants":
				return memoizedInviteCard;
			case "Delete":
				return memoizedDeleteCard;
			default:
				return null;
		}
	}, [activeTab, memoizedRentCard, memoizedInviteCard, memoizedDeleteCard]);

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
