// "use server"
import { MobileSidebar } from "@/components/MobileSidebar";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";
// import { PropertyBreadcrumbs } from "@/components/Dashboard/PropertyBreadcrumbs";
import { AppLayout } from "@/components/AppLayout";
import { updateCurrentProperty } from "@/utils/supabase/actions";

type Props = {
	params: { property_id: string };
	searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(): Promise<Metadata> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return {};
	const currentPropertyId = user.user_metadata.currentPropertyId;

	const { data: propertyData, error } = await supabase
		.from("properties")
		.select()
		.eq("id", currentPropertyId);

	if (error || propertyData.length === 0) {
		if (currentPropertyId) {
			await updateCurrentProperty("");
		}
		return {
			title: "Home",
		};
	}

	return {
		title: propertyData[0]?.street_address,
	};
}

export default async function PropertyDashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return;

	const { data, error } = await supabase
		.from("users")
		.select()
		.eq("id", user.id)
		.single();

	return (
		<>
			<div className="bg-gray-50 lg:bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-white dark:lg:bg-zinc-950 h-full">
				<AppLayout
					userEmail={data?.email}
					fullName={data?.full_name ?? undefined}
					userId={user.id}
				>
					{children}
				</AppLayout>
			</div>
		</>
	);
}
