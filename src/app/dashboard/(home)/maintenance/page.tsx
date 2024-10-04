"use server";
import { MaintenanceTable } from "@/components/maintenance/MaintenanceTable";
import {
	getTasks,
	getCurrentProperty,
	getUser,
} from "@/utils/supabase/actions";
import { redirect } from "next/navigation";

export default async function Maintenance() {
	// const data = await getTasks();
	// const currentPropertyId = await getCurrentProperty();
	// if (!currentPropertyId) {
	// 	redirect("/dashboard");
	// }
	const user = await getUser();
	if (!user) {
		return <></>;
	}
	const userId = user?.id;

	return (
		<>
			<MaintenanceTable userId={userId} />
		</>
	);
}
