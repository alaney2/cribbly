"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Strong, Text, TextLink } from "@/components/catalyst/text";
import {
	getTasks,
	getCurrentProperty,
	getNameAndEmail,
	updateCurrentProperty,
} from "@/utils/supabase/actions";
import { headers } from "next/headers";
import { NewProperty } from "@/components/Dashboard/NewProperty";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { DashboardWrapper } from "@/components/Dashboard/DashboardWrapper";

export default async function CurrentProperty() {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return;

	// const currentPropertyId = user.user_metadata.currentPropertyId;
	// if (!currentPropertyId) {
	// 	return (
	// 		<>
	// 			<NewProperty />
	// 		</>
	// 	);
	// }

	// const { data: tasks, error: tasksError } = await supabase
	// 	.from("maintenance")
	// 	.select("*")
	// 	.order("created_at", { ascending: false })
	// 	.eq("property_id", currentPropertyId);

	// if (tasksError) {
	// 	console.error("Error fetching tasks:", tasksError);
	// 	throw new Error("Error fetching tasks");
	// }

	// const { data: propertyData, error } = await supabase
	// 	.from("properties")
	// 	.select()
	// 	.eq("id", currentPropertyId);

	// if (error || propertyData.length === 0) {
	// 	return;
	// }

	// const { data: leaseData, error: leaseError } = await supabase
	// 	.from("leases")
	// 	.select("*")
	// 	.eq("property_id", currentPropertyId)
	// 	.maybeSingle();

	// // if (leaseError) throw error;

	// const { data: tenantsData, error: tenantsError } = await supabaseAdmin
	// 	.from("tenants")
	// 	.select("*")
	// 	.eq("property_id", currentPropertyId);

	// let showBankText = false;

	// const { data: existingAccounts } = await supabase
	// 	.from("plaid_accounts")
	// 	.select("account_id, use_for_payouts")
	// 	.eq("user_id", user.id);

	// if (existingAccounts && existingAccounts.length > 0) {
	// 	showBankText = !existingAccounts.some(
	// 		(account) => account.use_for_payouts === true,
	// 	);
	// }

	// const propertyAddress = `${propertyData[0]?.street_address}, ${propertyData[0]?.city} ${propertyData[0]?.state} ${propertyData[0]?.zip}`;

	return <DashboardWrapper />;
}
