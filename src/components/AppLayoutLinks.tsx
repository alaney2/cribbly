"use client";
import {
	SidebarItem,
	SidebarLabel,
	SidebarSection,
} from "@/components/catalyst/sidebar";
import {
	Cog6ToothIcon,
	DocumentTextIcon,
	HomeIcon,
	MegaphoneIcon,
	Square2StackIcon,
	TicketIcon,
	WrenchIcon,
	WrenchScrewdriverIcon,
	InboxIcon,
} from "@heroicons/react/20/solid";
import { usePathname } from "next/navigation";

export function AppLayoutTop() {
	const pathname = usePathname();
	return (
		<SidebarSection className="">
			<SidebarItem
				href="/dashboard/leases"
				current={pathname === "/dashboard/leases"}
			>
				<InboxIcon />
				<SidebarLabel>Leases</SidebarLabel>
			</SidebarItem>
		</SidebarSection>
	);
}

export function AppLayoutLinks() {
	const pathname = usePathname();

	return (
		<SidebarSection>
			<SidebarItem href={"/dashboard"} current={pathname === "/dashboard"}>
				<HomeIcon />
				<SidebarLabel>Home</SidebarLabel>
			</SidebarItem>
			<SidebarItem
				href={"/dashboard/tenants"}
				current={pathname === "/dashboard/tenants"}
			>
				<Square2StackIcon />
				<SidebarLabel>Tenants</SidebarLabel>
			</SidebarItem>
			<SidebarItem
				href={"/dashboard/maintenance"}
				current={pathname.startsWith("/dashboard/maintenance")}
			>
				<WrenchIcon />
				<SidebarLabel>Maintenance</SidebarLabel>
			</SidebarItem>
			<SidebarItem
				href={"/dashboard/documents"}
				current={pathname === "/dashboard/documents"}
			>
				<DocumentTextIcon />
				<SidebarLabel>Documents</SidebarLabel>
			</SidebarItem>
			{/* <SidebarItem
				href={"/dashboard/leases"}
				current={pathname === "/dashboard/leases"}
			>
				<TicketIcon />
				<SidebarLabel>Leases</SidebarLabel>
			</SidebarItem> */}
			<SidebarItem
				href={"/dashboard/settings"}
				current={pathname === "/dashboard/settings"}
			>
				<Cog6ToothIcon />
				<SidebarLabel>Settings</SidebarLabel>
			</SidebarItem>
			{/* <SidebarItem href={'/dashboard/delete-property'} current={pathname === '/dashboard/delete-property'}>
        <MegaphoneIcon />
        <SidebarLabel>Delete property</SidebarLabel>
      </SidebarItem> */}
		</SidebarSection>
	);
}
