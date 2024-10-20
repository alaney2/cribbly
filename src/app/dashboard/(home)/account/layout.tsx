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

	return (
		<>
			<Account />
			{children}
		</>
	);
}
