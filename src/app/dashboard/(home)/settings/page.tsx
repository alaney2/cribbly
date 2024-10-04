import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SettingsNavigation from "@/components/SettingsNavigation";
import { getCurrentProperty, getUser } from "@/utils/supabase/actions";

export default async function SettingsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// const supabase = createClient();
	const currentPropertyId = await getCurrentProperty();

	if (!currentPropertyId) {
		return;
	}

	// const { data: lease, error: leaseError } = await supabase
	// 	.from("leases")
	// 	.select("*")
	// 	.eq("property_id", currentPropertyId)
	// 	.single();

	// const user = await getUser();
	// if (!user) return;

	// const { data: plaidAccounts, error: plaidAccountsError } = await supabase
	// 	.from("plaid_accounts")
	// 	.select()
	// 	.eq("user_id", user.id)
	// 	.order("use_for_payouts", { ascending: false });

	return (
		<>
			<main className="flex flex-col justify-center space-y-4 sm:space-y-8 w-full mx-auto">
				<SettingsNavigation
					currentPropertyId={currentPropertyId}
					// userId={user.id}
					// lease={lease}
					// key={currentPropertyId}
					// plaidAccounts={plaidAccounts ?? []}
				/>
			</main>
			{children}
		</>
	);
}
