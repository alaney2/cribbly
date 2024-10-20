"use server";
import SettingsNavigation from "@/components/SettingsNavigation";
import { getCurrentProperty, getPlaidAccounts } from "@/utils/supabase/actions";

export default async function TenantSettings() {
	// const currentPropertyId = await getCurrentProperty();

	return (
		<main className="flex max-w-7xl flex-col justify-center space-y-4 sm:space-y-8">
			<SettingsNavigation initialTab="General" />
		</main>
	);
}
