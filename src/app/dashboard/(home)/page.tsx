"use server";
import { createClient } from "@/utils/supabase/server";
import { BentoStats } from "@/components/Dashboard/BentoStats";
import { redirect } from "next/navigation";
import { PropertyStats } from "@/components/Dashboard/PropertyStats";
import { Strong, Text, TextLink } from "@/components/catalyst/text";
import {
	getTasks,
	getCurrentProperty,
	getNameAndEmail,
} from "@/utils/supabase/actions";
import { Heading } from "@/components/catalyst/heading";
import { getVerificationInfo } from "@/utils/supabase/actions";
import { Verification } from "@/components/Dashboard/Verification";

export default async function CurrentProperty({
	params,
}: {
	params: { property_id: string };
}) {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return;

	const currentPropertyId = user.user_metadata.currentPropertyId;

	const tasks = await getTasks();

	const { data: propertyData, error } = await supabase
		.from("properties")
		.select()
		.eq("id", currentPropertyId);

	if (error || propertyData.length === 0) {
		redirect("/dashboard");
	}

	let showBankText = false;

	const { data: existingAccounts } = await supabase
		.from("plaid_accounts")
		.select("account_id, use_for_payouts")
		.eq("user_id", user.id);

	if (existingAccounts && existingAccounts.length > 0) {
		showBankText = !existingAccounts.some(
			(account) => account.use_for_payouts === true,
		);
	}

	const result = await getNameAndEmail();
	const full_name = result?.full_name;
	const email = result?.email;

	const propertyAddress = `${propertyData[0]?.street_address}, ${propertyData[0]?.city} ${propertyData[0]?.state} ${propertyData[0]?.zip}`;

	const verificationInfo = await getVerificationInfo();

	if (!verificationInfo) {
		return (
			<div className="sm:mt-16">
				<Verification full_name={full_name} email={email} />
			</div>
		);
	}

	return (
		<>
			<div className="h-full">
				{showBankText && (
					<Text className="mb-4 rounded-lg bg-red-500/25 px-4 py-1">
						To enable payouts, please link a primary bank account in your{" "}
						<TextLink href="/dashboard/account">account settings</TextLink>.
					</Text>
				)}
				<Heading className="mb-8 ml-4 text-xl font-semibold tracking-tight lg:hidden">
					{propertyAddress}
				</Heading>
				<div className="mb-4 cursor-default">
					<PropertyStats currentPropertyId={currentPropertyId} />
				</div>

				<BentoStats tasks={tasks} />
				{/* <div className="flex justify-center mt-8">
          <Button color="blue" className="">Randomize data</Button>
        </div> */}
			</div>
		</>
	);
}
