import { HomeIcon } from "@heroicons/react/24/outline";
import { LeaseGrid } from "@/components/Leases/LeaseGrid";
import { headers } from "next/headers";
import { TellerConnect } from "@/components/teller/connect";

export default async function LeasesPage() {
	return (
		<main className="">
			<LeaseGrid />
			{/* <TellerConnect /> */}
		</main>
	);
}
