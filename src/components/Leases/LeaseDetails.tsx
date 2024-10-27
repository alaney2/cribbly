"use client";
import { useState, useMemo } from "react";
import { RentCard } from "@/components/PropertySettings/RentCard";
import { InviteCard } from "@/components/PropertySettings/InviteCard";
import { DeleteLeaseCard } from "@/components/PropertySettings/DeleteLeaseCard";
import { Heading } from "@/components/catalyst/heading";
import { Divider } from "@/components/catalyst/divider";
import { Text, Strong } from "@/components/catalyst/text";
import { useCurrentProperty } from "@/contexts/CurrentPropertyContext";

interface LeaseDetailsProps {
	currentPropertyId?: string;
	initialTab?: string;
	lease: any;
	setSelectedLease: (lease: any) => void;
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

export function LeaseDetails({
	initialTab,
	lease,
	setSelectedLease,
}: LeaseDetailsProps) {
	console.log("LeaseDetailsProps", lease);
	const { currentPropertyId } = useCurrentProperty();
	const [activeTab, setActiveTab] = useState(initialTab || "General");
	const handleTabChange = (tab: string) => {
		setActiveTab(tab);
	};

	const canDeleteLease = useMemo(() => {
		const currentDate = new Date();
		const leaseStartDate = new Date(lease.start_date);
		return lease.tenantCount === 0 || currentDate < leaseStartDate;
	}, [lease]);

	const tabs = useMemo(
		() => [
			{ name: "General", component: RentCard },
			{ name: "Tenants", component: InviteCard },
			...(canDeleteLease
				? [{ name: "Delete", component: DeleteLeaseCard }]
				: []),
		],
		[canDeleteLease],
	);

	const renderContent = () => {
		switch (activeTab) {
			case "General":
				return (
					<RentCard
						propertyId={currentPropertyId}
						buttonOnClick={() => handleTabChange("Tenants")}
						lease={lease}
					/>
				);
			case "Tenants":
				return <InviteCard lease={lease} propertyId={currentPropertyId} />;
			case "Delete":
				return canDeleteLease ? (
					<DeleteLeaseCard lease={lease} setSelectedLease={setSelectedLease} />
				) : null;
			default:
				return null;
		}
	};

	return (
		<div className="">
			{/* <div className="hidden lg:block"> */}
			{/* <Heading className="ml-2 text-2xl font-semibold text-gray-900">
					Lease Settings
				</Heading> */}
			<Divider className="mb-8 mt-4" />
			{/* </div> */}

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
				<RentCard propertyId={currentPropertyId} />
				<InviteCard lease={lease} propertyId={currentPropertyId} />
				{canDeleteLease && (
					<DeleteLeaseCard lease={lease} setSelectedLease={setSelectedLease} />
				)}
			</div>
		</div>
	);
}
