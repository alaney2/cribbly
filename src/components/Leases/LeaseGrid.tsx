"use client";
import { useState, useEffect, type SetStateAction } from "react";
import { BentoGrid, BentoGridItem } from "@/components/aceternity/bento-grid";
import { Skeleton } from "@/components/catalyst/skeleton";
import {
	HomeIcon,
	CheckCircleIcon,
	ExclamationCircleIcon,
	ArrowLeftIcon,
	ClockIcon,
} from "@heroicons/react/24/outline";
import { createClient } from "@/utils/supabase/client";
import { Text } from "@/components/catalyst/text";
import { useCurrentProperty } from "@/contexts/CurrentPropertyContext";
import useSWR from "swr";
import { Button } from "@/components/catalyst/button";
import { Heading } from "@/components/catalyst/heading";
import { Divider } from "@/components/catalyst/divider";
import { LeaseDetails } from "@/components/Leases/LeaseDetails";
import { NewLeaseDialog } from "@/components/dialogs/NewLeaseDialog";
import { parseISO, isWithinInterval, addDays } from "date-fns";

const fetcher = async (propertyId: string) => {
	const supabase = createClient();
	const { data: leases, error: leaseError } = await supabase
		.from("leases")
		.select("*")
		.eq("property_id", propertyId)
		.order("start_date", { ascending: false });

	if (leaseError) {
		throw leaseError;
	}

	const { data: tenants, error: tenantError } = await supabase
		.from("tenants")
		.select("*")
		.eq("property_id", propertyId);

	if (tenantError) {
		throw tenantError;
	}

	const tenantCounts = tenants.reduce((acc, tenant) => {
		acc[tenant.lease_id] = (acc[tenant.lease_id] || 0) + 1;
		return acc;
	}, {});

	return leases.map((lease) => ({
		...lease,
		tenantCount: tenantCounts[lease.id] || 0,
	}));
};

const getLeaseStatus = (startDate: string, endDate: string) => {
	const now = new Date();
	const start = parseISO(startDate);
	const end = addDays(parseISO(endDate), 1);

	if (now < start) return "future";
	if (now > end) return "expired";
	return "active";
};

export function LeaseGrid() {
	const { currentPropertyId } = useCurrentProperty();
	const [selectedLease, setSelectedLease] = useState(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		setSelectedLease(null);
	}, [currentPropertyId]);

	const handleLeaseClick = (lease: SetStateAction<null>) => {
		setSelectedLease(lease);
	};

	const handleBackClick = () => {
		setSelectedLease(null);
	};

	const {
		data: leases,
		error,
		isLoading,
	} = useSWR(currentPropertyId ? ["leases", currentPropertyId] : null, () =>
		fetcher(currentPropertyId),
	);

	const formatDate = (date: Date) => {
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const isLeaseActive = (startDate: string, endDate: string) => {
		const now = new Date();
		const start = parseISO(startDate);
		const end = addDays(parseISO(endDate), 1);
		return isWithinInterval(now, { start, end });
	};

	const LeaseHeader = ({ lease }: { lease: any }) => {
		const status = getLeaseStatus(lease.start_date, lease.end_date);

		const statusConfig = {
			future: {
				bgColor: "bg-blue-500/80",
				icon: <ClockIcon className="h-4 w-4 mr-1" />,
				text: "Future",
			},
			active: {
				bgColor: "bg-green-500/80",
				icon: <CheckCircleIcon className="h-4 w-4 mr-1" />,
				text: "Active",
			},
			expired: {
				bgColor: "bg-yellow-500/80",
				icon: <ExclamationCircleIcon className="h-4 w-4 mr-1" />,
				text: "Expired",
			},
		};
		const { bgColor, icon, text } = statusConfig[status];
		return (
			<div className="flex flex-col gap-1 h-full w-full space-y-0">
				<div
					className={`${bgColor} w-24 text-white text-xs font-semibold px-2 py-1 mb-4 rounded-full flex items-center`}
				>
					{icon}
					{text}
				</div>
				<Text className={"px-1"}>Rent per month: {lease.rent_amount}</Text>
				<Text className={"px-1"}>Tenants: {lease.tenantCount}</Text>
				{lease.sd_amount > 0 && (
					<Text className={"px-1"}>
						Security Deposit: ${lease.sd_amount} ({lease.sd_status})
					</Text>
				)}
			</div>
		);
	};

	if (selectedLease) {
		return (
			<div>
				<Button
					outline
					className="mb-4"
					onClick={handleBackClick}
					// leftIcon={<ArrowLeftIcon className="h-5 w-5" />}
				>
					<>
						<ArrowLeftIcon className="h-5 w-5" />
						Back to Leases
					</>
				</Button>
				<LeaseDetails
					currentPropertyId={currentPropertyId}
					initialTab="General"
					lease={selectedLease}
					setSelectedLease={setSelectedLease}
				/>
			</div>
		);
	}

	return (
		<>
			<div className="flex justify-between items-center mb-4">
				<Heading className="text-2xl font-semibold text-gray-900">
					Leases
				</Heading>
				<Button color="blue" onClick={() => setIsDialogOpen(true)}>
					+ Create Lease
				</Button>
			</div>
			<Divider className="mb-8 mt-4" />
			<BentoGrid className="auto-rows-[14rem] md:auto-rows-[14rem] sm:grid-cols-2">
				{isLoading
					? Array.from({ length: 6 }).map((_, index) => (
							<Skeleton
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								key={index}
								className="h-[14rem] md:h-[14rem] rounded-lg"
							/>
						))
					: leases?.map((lease) => {
							return (
								<div
									key={lease.id}
									onClick={() => setSelectedLease(lease)}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											setSelectedLease(lease);
										}
									}}
									role="button"
									tabIndex={0}
									className="cursor-default h-[14rem] md:h-[14rem]"
								>
									<BentoGridItem
										key={lease.id}
										title={`${formatDate(parseISO(lease.start_date))} - ${formatDate(parseISO(lease.end_date))}`}
										// description={`Rent: $${lease.rent_amount}`}
										onClick={() => handleLeaseClick(lease)}
										icon={<HomeIcon className="h-5 w-5" />}
										header={<LeaseHeader lease={lease} />}
										className="sm:col-span-1 h-full"
									/>
								</div>
							);
						})}
			</BentoGrid>
			<NewLeaseDialog
				isOpen={isDialogOpen}
				onClose={() => setIsDialogOpen(false)}
				propertyId={currentPropertyId}
			/>
		</>
	);
}
