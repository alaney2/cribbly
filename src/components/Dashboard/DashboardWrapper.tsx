"use client";
import { CurrentPropertyProvider } from "@/contexts/CurrentPropertyContext";
import { Heading, Subheading } from "@/components/catalyst/heading";
import { BentoStats } from "@/components/Dashboard/BentoStats";
import { PropertyStats } from "@/components/Dashboard/PropertyStats";

export function DashboardWrapper() {
	return (
		<div className="h-full">
			{/* {showBankText && (
					<Text className="mb-4 rounded-lg bg-red-500/25 px-4 py-1">
						To enable payouts, please link a primary bank account in your{" "}
						<TextLink href="/dashboard/account">account settings</TextLink>.
					</Text>
				)} */}
			{/* <Heading className="mb-8 ml-4 text-xl font-semibold tracking-tight lg:hidden">
				{propertyAddress}
			</Heading> */}
			<div className="mb-4 cursor-default">
				<PropertyStats />
			</div>

			<BentoStats />
			{/* <div className="flex justify-center mt-8">
          <Button color="blue" className="">Randomize data</Button>
        </div> */}
		</div>
	);
}
