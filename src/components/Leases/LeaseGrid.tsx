"use client";
import { useState, useEffect, type SetStateAction } from "react";
import { BentoGrid, BentoGridItem } from "@/components/aceternity/bento-grid";
import { Skeleton } from "@/components/catalyst/skeleton";
import {
	HomeIcon,
	CheckCircleIcon,
	ExclamationCircleIcon,
	ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { createClient } from "@/utils/supabase/client";
import { Text } from "@/components/catalyst/text";
import { useCurrentProperty } from "@/contexts/CurrentPropertyContext";
import useSWR from "swr";
import SettingsNavigation from "@/components/SettingsNavigation";
import { Button } from "@/components/catalyst/button";
import { Heading } from "@/components/catalyst/heading";
import { Divider } from "@/components/catalyst/divider";
import { LeaseDetails } from "@/components/Leases/LeaseDetails";
import { parseISO } from "date-fns";

const fetcher = async (propertyId: string) => {
	const supabase = createClient();
	const { data: leases, error: leaseError } = await supabase
		.from("leases")
		.select("*")
		.eq("property_id", propertyId);

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

export function LeaseGrid() {
	const { currentPropertyId } = useCurrentProperty();
	const [selectedLease, setSelectedLease] = useState(null);

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
		const start = new Date(startDate);
		const end = new Date(endDate);
		return now >= start && now <= end;
	};

	const LeaseHeader = ({ lease }: { lease: any }) => {
		const active = isLeaseActive(lease.start_date, lease.end_date);

		return (
			<div className="flex flex-col gap-1 h-full w-full space-y-0">
				{active ? (
					<div className="bg-green-500/80 w-20 text-white text-xs font-semibold px-2 py-1 mb-4 rounded-full flex items-center">
						<CheckCircleIcon className="h-4 w-4 mr-1" />
						Active
					</div>
				) : (
					<div className="bg-yellow-500/80 w-20 text-white text-xs font-semibold px-2 py-1 mb-4 rounded-full flex items-center">
						<ExclamationCircleIcon className="h-4 w-4 mr-1" />
						Inactive
					</div>
				)}
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
				/>
			</div>
		);
	}

	return (
		<>
			<Heading className="ml-2 text-2xl font-semibold text-gray-900">
				Leases
			</Heading>
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
									className="cursor-default"
								>
									<BentoGridItem
										key={lease.id}
										title={`${formatDate(parseISO(lease.start_date))} - ${formatDate(parseISO(lease.end_date))}`}
										// description={`Rent: $${lease.rent_amount}`}
										onClick={() => handleLeaseClick(lease)}
										icon={<HomeIcon className="h-5 w-5" />}
										header={<LeaseHeader lease={lease} />}
										className="sm:col-span-1"
									/>
								</div>
							);
						})}
			</BentoGrid>
		</>
	);
}
