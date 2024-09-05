"use client";
import { RentCard } from "@/components/PropertySettings/RentCard";

type SetupPropertyProps = {
	propertyId: string;
	setPropertyId: (propertyId: string) => void;
	buttonOnClick: () => void;
};

export function SetupProperty({
	propertyId,
	setPropertyId,
	buttonOnClick,
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
					propertyFees={null}
					propertyRent={null}
					securityDeposit={null}
				/>
			</div>
		</>
	);
}
