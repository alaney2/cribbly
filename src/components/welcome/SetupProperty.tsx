"use client";
import { RentCard } from "@/components/PropertySettings/RentCard";
import useSWR from "swr";
import { getUser, getCurrentProperty } from "@/utils/supabase/actions";
import { Button } from "@/components/catalyst/button";

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
	console.log("currentProperty", currentProperty.property_rent);
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
					plaidAccounts={[]}
				/>
				<Button
					color="blue"
					onClick={buttonOnClick}
					disabled={
						!currentProperty &&
						!currentProperty.property_rent.rent_amount &&
						!currentProperty.property_rent.rent_start &&
						!currentProperty.property_rent.rent_end
					}
					className="mt-4 sm:mt-4 w-48"
				>
					Continue
				</Button>
			</div>
		</>
	);
}
