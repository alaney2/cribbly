import { Account } from "@/components/Dashboard/Account";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardAccount({
	children,
}: {
	children: React.ReactNode;
}) {
	const supabase = createClient();
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();
	if (!user || error) {
		return <></>;
	}

	const { data: userTableUser } = await supabase
		.from("users")
		.select("*")
		.eq("id", user.id)
		.single();
	const fullName = userTableUser.full_name;
	const email = userTableUser.email;

	// const { data: plaidAccounts, error: plaidAccountsError } = await supabase
	// 	.from("plaid_accounts")
	// 	.select()
	// 	.eq("user_id", user.id)
	// 	.order("use_for_payouts", { ascending: false });

	return (
		<>
			<Account
				fullName={fullName}
				email={email}
				// plaidAccounts={plaidAccounts || []}
			/>
			{children}
		</>
	);
}
