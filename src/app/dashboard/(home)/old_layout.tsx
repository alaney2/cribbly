import Link from "next/link";
import { MobileSidebarDashboard } from "@/components/MobileSidebarDashboard";
import { DesktopSidebarDashboard } from "@/components/DesktopSidebarDashboard";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { HomeBreadcrumbs } from "@/components/Dashboard/HomeBreadcrumbs";

export const metadata: Metadata = {
	title: "Dashboard",
};

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const supabase = createClient();
	let {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		redirect("/sign-in");
	}

	return (
		<>
			<div className="h-full flex flex-col">
				<MobileSidebarDashboard userEmail={user.email} />
				{/* <div className="absolute left-64 top-4">
          <HomeBreadcrumbs />
        </div> */}
				<div className="mx-auto flex w-full items-start gap-x-6 lg:gap-x-8 py-4 px-4 sm:px-6 lg:px-8 lg:mt-8">
					<aside
						className={`lg:sticky top-16 left-4 flex-col overflow-y-auto absolute hidden lg:block`}
					>
						<DesktopSidebarDashboard />
					</aside>
					<main className="flex-1 lg:bg-white lg:rounded-3xl lg:shadow-md lg:block lg:mr-8 mb-8 lg:mb-0 content-container">
						{children}
					</main>
				</div>
			</div>
		</>
	);
}
