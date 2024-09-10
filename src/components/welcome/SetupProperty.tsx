"use client";
import { RentCard } from "@/components/PropertySettings/RentCard";
import useSWR from "swr";
import { getUser, getCurrentProperty } from "@/utils/supabase/actions";

type SetupPropertyProps = {
	propertyId: string;
	buttonOnClick: () => void;
	currentProperty?: any;
	setCurrentProperty?: (property: any) => void;
};

export function SetupProperty({
	propertyId,
	buttonOnClick,
	currentProperty,
	setCurrentProperty,
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
					buttonOnClick={buttonOnClick}
					propertyFees={currentProperty?.property_fees || null}
					propertyRent={currentProperty?.property_rent || null}
					securityDeposit={currentProperty?.property_security_deposits || null}
					setCurrentProperty={setCurrentProperty}
				/>
			</div>
		</>
	);
}
