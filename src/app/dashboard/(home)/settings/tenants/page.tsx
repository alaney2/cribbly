"use server";
import SettingsNavigation from "@/components/SettingsNavigation";

export default async function TenantSettings() {
	return (
		<main className="flex max-w-7xl flex-col justify-center space-y-4 sm:space-y-8">
			<SettingsNavigation initialTab="Tenants" />
		</main>
	);
}
