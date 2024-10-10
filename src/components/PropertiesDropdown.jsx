"use client";
import {
	Dropdown,
	DropdownButton,
	DropdownDivider,
	DropdownItem,
	DropdownLabel,
	DropdownMenu,
} from "@/components/catalyst/dropdown";
import { SidebarItem, SidebarLabel } from "@/components/catalyst/sidebar";
import {
	ArrowRightStartOnRectangleIcon,
	ChevronDownIcon,
	PlusIcon,
} from "@heroicons/react/16/solid";
import { updateCurrentProperty } from "@/utils/supabase/actions";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import { useContext } from "react";
import { SidebarContext } from "@/components/catalyst/sidebar-layout";
import { useCurrentProperty } from "@/contexts/CurrentPropertyContext";

export function PropertiesDropdown({
	properties,
	// currentPropertyId,
	// streetAddress,
}) {
	const { mutate } = useSWRConfig();
	const { closeSidebar } = useContext(SidebarContext);
	const router = useRouter();
	const { currentPropertyId, setCurrentPropertyId } = useCurrentProperty();
	const currentProperty = properties?.find(
		(property) => property.id === currentPropertyId,
	);

	if (!properties || !currentProperty) {
		setCurrentPropertyId("");
	}

	return (
		<Dropdown>
			<DropdownButton as={SidebarItem} className="lg:mb-2.5">
				{/* <Avatar src="/tailwind-logo.svg" /> */}
				<SidebarLabel>{currentProperty?.street_address}</SidebarLabel>
				<ChevronDownIcon />
			</DropdownButton>

			<DropdownMenu className="w-80 lg:w-64" anchor="bottom start">
				{properties?.map((property, index) => (
					<DropdownItem
						key={property.id}
						onClick={async () => {
							closeSidebar();
							setCurrentPropertyId(property.id);

							updateCurrentProperty(property.id).then(() => {});
						}}
					>
						{property.id === currentPropertyId && (
							<div className="bg-blue-500 h-4 w-4 mr-3 rounded-full" />
						)}
						<DropdownLabel className="truncate">
							{property.street_address}
						</DropdownLabel>
					</DropdownItem>
				))}
				{properties && properties.length > 0 && <DropdownDivider />}
				<DropdownItem
					href="/dashboard/add-property"
					// className="w-full min-w-80 lg:min-w-64"
					onClick={() => closeSidebar()}
				>
					<PlusIcon />
					<DropdownLabel>Add property&hellip;</DropdownLabel>
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	);
}
