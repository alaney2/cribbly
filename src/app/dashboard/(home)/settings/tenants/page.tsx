"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SettingsNavigation from "@/components/SettingsNavigation";
import { getCurrentProperty, getPlaidAccounts } from "@/utils/supabase/actions";

export default async function TenantSettings() {
	// const supabase = createClient();
	// const currentPropertyId = await getCurrentProperty();

	// const { data: lease, error: leaseError } = await supabase
	// 	.from("leases")
	// 	.select("*")
	// 	.eq("property_id", currentPropertyId)
	// 	.single();

	// const plaidAccounts = await getPlaidAccounts();

	return (
		<main className="flex max-w-7xl flex-col justify-center space-y-4 sm:space-y-8">
			<SettingsNavigation
				// key={currentPropertyId}
				initialTab="Tenants"
			/>
		</main>
	);
}
