"use client";
import { RentCard } from "@/components/PropertySettings/RentCard";
import useSWR from "swr";
import { getUser, getCurrentProperty } from "@/utils/supabase/actions";

type SetupPropertyProps = {
	propertyId: string;
	setPropertyId: (propertyId: string) => void;
	buttonOnClick: () => void;
	currentProperty: any;
};

export function SetupProperty({
	propertyId,
	setPropertyId,
	buttonOnClick,
	currentProperty,
}: SetupPropertyProps) {
	return (
		<>
			<div
				className={
					"relative flex h-full flex-col items-center justify-center gap-y-4 px-2 pt-8 sm:pt-4"
				}
			>
				<RentCard
					propertyId={propertyId}
					setPropertyId={setPropertyId}
					buttonOnClick={buttonOnClick}
					propertyFees={currentProperty?.property_fees || null}
					propertyRent={currentProperty?.property_rent || null}
					securityDeposit={currentProperty?.property_security_deposits || null}
					currentProperty={currentProperty}
				/>
			</div>
		</>
	);
}
