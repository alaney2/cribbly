import { Avatar } from "@/components/catalyst/avatar";
import {
	Dropdown,
	DropdownButton,
	DropdownDivider,
	DropdownItem,
	DropdownLabel,
	DropdownMenu,
} from "@/components/catalyst/dropdown";
import {
	Navbar,
	NavbarItem,
	NavbarSection,
	NavbarSpacer,
} from "@/components/catalyst/navbar";
import {
	Sidebar,
	SidebarBody,
	SidebarFooter,
	SidebarHeader,
	SidebarHeading,
	SidebarItem,
	SidebarLabel,
	SidebarSection,
	SidebarSpacer,
} from "@/components/catalyst/sidebar";
import { SidebarLayout } from "@/components/catalyst/sidebar-layout";
import {
	ArrowRightStartOnRectangleIcon,
	ChevronDownIcon,
	ChevronUpIcon,
	Cog8ToothIcon,
	LightBulbIcon,
	PlusIcon,
	ShieldCheckIcon,
	UserIcon,
} from "@heroicons/react/16/solid";
import {
	Cog6ToothIcon,
	HomeIcon,
	InboxIcon,
	MagnifyingGlassIcon,
	QuestionMarkCircleIcon,
	SparklesIcon,
} from "@heroicons/react/20/solid";
import { AppLayoutLinks, AppLayoutTop } from "@/components/AppLayoutLinks";
import { PropertiesDropdown } from "@/components/PropertiesDropdown";
import { getInitials } from "@/utils/helpers";
import { createClient } from "@/utils/supabase/server";
import { signOut } from "@/utils/supabase/sign-out";
import { SignOutDropdown } from "@/components/SignOutDropdown";
import { CurrentPropertyProvider } from "@/contexts/CurrentPropertyContext";
import { updateCurrentProperty } from "@/utils/supabase/actions";

export async function AppLayout({
	children,
	userEmail,
	fullName,
	userId,
}: {
	children: React.ReactNode;
	userEmail?: string;
	fullName?: string;
	userId?: string;
}) {
	const supabase = createClient();

	const { data: properties, error: propertiesError } = await supabase
		.from("properties")
		.select("*, tenants(*)")
		.eq("user_id", userId);

	if (!properties) {
		await updateCurrentProperty("");
	}

	// Get current property ID from authenticated user data
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();
	const currentPropertyId = user?.user_metadata?.currentPropertyId;

	if (userError) {
		console.error("Error fetching user:", userError);
		// Handle the error appropriately
	}

	if (propertiesError) {
		console.error("Error fetching properties:", propertiesError);
		// Handle the error appropriately
	}

	return (
		<CurrentPropertyProvider initialPropertyId={currentPropertyId}>
			<SidebarLayout
				navbar={
					<Navbar>
						<NavbarSpacer />
						<NavbarSection>
							<Dropdown>
								<DropdownButton as={NavbarItem}>
									<Avatar
										initials={getInitials(fullName ?? "")}
										className="bg-blue-500 text-white"
										square
									/>
								</DropdownButton>
								<DropdownMenu className="min-w-64" anchor="bottom end">
									<DropdownItem href="/dashboard/account">
										<UserIcon />
										<DropdownLabel>Account Settings</DropdownLabel>
									</DropdownItem>
									<DropdownDivider />
									<DropdownItem href="/privacy">
										<ShieldCheckIcon />
										<DropdownLabel>Privacy policy</DropdownLabel>
									</DropdownItem>
									<DropdownItem href="/share-feedback">
										<LightBulbIcon />
										<DropdownLabel>Share feedback</DropdownLabel>
									</DropdownItem>
									<DropdownDivider />
									<SignOutDropdown />
								</DropdownMenu>
							</Dropdown>
						</NavbarSection>
					</Navbar>
				}
				sidebar={
					<Sidebar>
						<SidebarHeader>
							<PropertiesDropdown properties={properties} />
							{currentPropertyId && <AppLayoutTop />}
						</SidebarHeader>
						<SidebarBody>
							{currentPropertyId && <AppLayoutLinks />}

							<SidebarSpacer />
							<SidebarSection>
								<SidebarItem href={"mailto:support@cribbly.io"}>
									<QuestionMarkCircleIcon />
									<SidebarLabel>Support</SidebarLabel>
								</SidebarItem>
								{/* <SidebarItem href="/changelog">
                <SparklesIcon />
                <SidebarLabel>Changelog</SidebarLabel>
              </SidebarItem> */}
							</SidebarSection>
						</SidebarBody>
						<SidebarFooter className="max-lg:hidden">
							<Dropdown>
								<DropdownButton as={SidebarItem}>
									<span className="flex min-w-0 items-center gap-3">
										{/* <Avatar initials={getUserInitials(fullName)} className="size-10" square alt="" /> */}
										<span className="min-w-0">
											<span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
												{fullName}
											</span>
											<span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
												{userEmail}
											</span>
										</span>
									</span>
									<ChevronUpIcon />
								</DropdownButton>
								<DropdownMenu className="min-w-64" anchor="top start">
									<DropdownItem href="/dashboard/account">
										<UserIcon />
										<DropdownLabel>Account Settings</DropdownLabel>
									</DropdownItem>
									<DropdownDivider />
									<DropdownItem href="/privacy">
										<ShieldCheckIcon />
										<DropdownLabel>Privacy policy</DropdownLabel>
									</DropdownItem>
									{/* <DropdownItem href="/share-feedback"> */}
									<DropdownItem href="mailto:alan@cribbly.io">
										<LightBulbIcon />
										<DropdownLabel>Share feedback</DropdownLabel>
									</DropdownItem>
									<DropdownDivider />
									<SignOutDropdown />
								</DropdownMenu>
							</Dropdown>
						</SidebarFooter>
					</Sidebar>
				}
			>
				{children}
				{/* The page content */}
			</SidebarLayout>
		</CurrentPropertyProvider>
	);
}
