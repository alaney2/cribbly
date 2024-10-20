"use server";
import { TenantsTable } from "@/components/Tenant/TenantsTable";
import { Button } from "@/components/catalyst/button";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getTenants } from "@/utils/supabase/admin";

export default async function TenantsPage() {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) redirect("/sign-in");
	const currentPropertyId = user.user_metadata.currentPropertyId;

	if (!currentPropertyId) {
		return null;
	}

	const tenantsData = await getTenants(currentPropertyId);

	return (
		<>
			<div className="mb-8 p-6 md:p-8 lg:mb-0">
				<div className="">
					{/* @ts-ignore */}
					<TenantsTable tenantsData={tenantsData || []} />
				</div>
			</div>
		</>
	);
}
