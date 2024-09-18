"use client";
import Link from "next/link";
import { PencilSquareIcon, WrenchIcon } from "@heroicons/react/24/outline";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import useSWR from "swr";
import { useEffect } from "react";
import { format } from "date-fns";

const CurrencyIcon = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="icon icon-tabler icon-tabler-currency-dollar"
		width="16"
		height="16"
		viewBox="0 0 24 24"
		strokeWidth="1.5"
		stroke="#9e9e9e"
		fill="none"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<title>Rent price</title>
		<path stroke="none" d="M0 0h24v24H0z" fill="none" />
		<path d="M16.7 8a3 3 0 0 0 -2.7 -2h-4a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6h-4a3 3 0 0 1 -2.7 -2" />
		<path d="M12 3v3m0 12v3" />
	</svg>
);

const TenantIcon = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="icon icon-tabler icon-tabler-users"
		width="16"
		height="16"
		viewBox="0 0 24 24"
		strokeWidth="1.5"
		stroke="#9e9e9e"
		fill="none"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<title>Current tenants</title>
		<path stroke="none" d="M0 0h24v24H0z" fill="none" />
		<path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
		<path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
		<path d="M16 3.13a4 4 0 0 1 0 7.75" />
		<path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
	</svg>
);
const HourglassIcon = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="icon icon-tabler icon-tabler-hourglass-high"
		width="16"
		height="16"
		viewBox="0 0 24 24"
		strokeWidth="1.5"
		stroke="#9e9e9e"
		fill="none"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<title>Lease period</title>
		<path stroke="none" d="M0 0h24v24H0z" fill="none" />
		<path d="M6.5 7h11" />
		<path d="M6 20v-2a6 6 0 1 1 12 0v2a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1z" />
		<path d="M6 4v2a6 6 0 1 0 12 0v-2a1 1 0 0 0 -1 -1h-10a1 1 0 0 0 -1 1z" />
	</svg>
);

const rentFetcher = async (property_id: string) => {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("property_rents")
		.select("*")
		.eq("property_id", property_id)
		.single();

	if (error) throw error;
	return data;
};

const tenantsFetcher = async (property_id: string) => {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("tenants")
		.select("*")
		.eq("property_id", property_id);
	if (error) throw error;
	return data;
};

type PropertyStatsProps = {
	currentPropertyId: string;
};

export function PropertyStats({ currentPropertyId }: PropertyStatsProps) {
	const { data, error, isLoading } = useSWR(
		currentPropertyId ? ["propertyRent", currentPropertyId] : null,
		() => (currentPropertyId ? rentFetcher(currentPropertyId) : null),
	);
	const {
		data: tenantsData,
		error: tenantsError,
		isLoading: isTenantsLoading,
	} = useSWR(currentPropertyId ? ["tenants", currentPropertyId] : null, () =>
		currentPropertyId ? tenantsFetcher(currentPropertyId) : null,
	);

	const stats = [
		{
			name: "Rent price",
			stat: data ? `$${data.rent_price}` : "-",
			icon: CurrencyIcon,
			editIcon: <PencilSquareIcon className="h-5 w-5 text-gray-500" />,
			href: "/dashboard/settings",
		},
		{
			name: "Lease period",
			icon: HourglassIcon,
			stat: data
				? `${format(data.rent_start, "M/d/yy")} - ${format(data.rent_end, "M/d/yy")}`
				: "-",
		},
		{
			name: "Current tenants",
			icon: TenantIcon,
			stat: tenantsData ? `${tenantsData.length}` : "-",
		},
		// { name: 'This month\'s rent', icon: CalendarIcon, stat: data ? `Unpaid (0/${data.months_left} months)` : 'Paid' },
	];

	return (
		<>
			<dl className="mt-2 grid grid-cols-1 gap-5 md:grid-cols-3">
				{stats.map((item) => (
					<Link
						href={item.href || "#"}
						key={item.name}
						className="group cursor-default overflow-hidden rounded-xl bg-white dark:bg-black px-4 py-5 ring-1 dark:ring-2 ring-inset ring-gray-200 dark:ring-gray-600 sm:p-6"
					>
						<div className="flex justify-between">
							<dt className="truncate text-sm font-medium text-gray-500">
								{item.name}
							</dt>
							{item.icon}
						</div>
						<dd className="mt-1 flex text-3xl font-semibold tracking-tight text-emerald-600">
							{item.stat}
							{item.editIcon && (
								<div className="ml-3 block rounded-lg p-2 opacity-20 transition-opacity duration-200 ease-in-out group-hover:opacity-100">
									{item.editIcon}
								</div>
							)}
						</dd>
					</Link>
				))}
			</dl>
		</>
	);
}
