import { MaintenanceTable } from "@/components/maintenance/MaintenanceTable";
import { createClient } from "@/utils/supabase/client";

export function BentoMaintenanceTable() {
	return (
		<div className="mt-0 flow-root overflow-hidden">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<MaintenanceTable bento={true} />
			</div>
		</div>
	);
}
