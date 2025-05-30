// "use client";
// import { ChevronDown, Slash } from "lucide-react";

// import {
// 	Breadcrumb,
// 	BreadcrumbItem,
// 	BreadcrumbLink,
// 	BreadcrumbList,
// 	BreadcrumbPage,
// 	BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import {
// 	DropdownMenu,
// 	DropdownMenuContent,
// 	DropdownMenuItem,
// 	DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import * as React from "react";
// import { Check, ChevronsUpDown } from "lucide-react";

// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import {
// 	Command,
// 	CommandEmpty,
// 	CommandGroup,
// 	CommandInput,
// 	CommandItem,
// 	CommandList,
// } from "@/components/ui/command";
// import {
// 	Popover,
// 	PopoverContent,
// 	PopoverTrigger,
// } from "@/components/ui/popover";

// import { usePathname } from "next/navigation";
// import { createClient } from "@/utils/supabase/client";
// import useSWR from "swr";
// import { toast } from "sonner";
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";

// const fetcher = async () => {
// 	const supabase = createClient();
// 	const {
// 		data: { user },
// 	} = await supabase.auth.getUser();
// 	if (!user) {
// 		return;
// 	}
// 	const { data, error } = await supabase
// 		.from("properties")
// 		.select("*")
// 		.eq("user_id", user?.id)
// 		.order("street_address", { ascending: true });
// 	if (error) {
// 		throw error;
// 	}
// 	return data;
// };

// export function PropertyBreadcrumbs() {
// 	const pathname = usePathname();
// 	const segments = pathname.split("/").filter((segment) => segment !== "");
// 	const { data: properties, error, isLoading } = useSWR("properties", fetcher);
// 	const property = Array.isArray(properties)
// 		? properties.find((property) => property.id === segments[1])
// 		: undefined;
// 	const otherProperties = Array.isArray(properties)
// 		? properties.filter((property) => property.id !== segments[1])
// 		: undefined;
// 	const [open, setOpen] = React.useState(false);
// 	const [value, setValue] = React.useState("");

// 	return (
// 		<Breadcrumb>
// 			<BreadcrumbList>
// 				{segments.map((segment, index) => (
// 					<div key={index} className="flex items-center">
// 						{index !== 0 && (
// 							<BreadcrumbSeparator className="mx-2">
// 								<Slash />
// 							</BreadcrumbSeparator>
// 						)}
// 						{index !== 1 ? (
// 							<BreadcrumbItem className="tracking-tight font-lexend text-sm select-none">
// 								<BreadcrumbLink
// 									href={`/${segments.slice(0, index + 1).join("/")}`}
// 								>
// 									{segment === "dashboard"
// 										? "Properties"
// 										: segment.charAt(0).toUpperCase() + segment.slice(1)}
// 								</BreadcrumbLink>
// 							</BreadcrumbItem>
// 						) : (
// 							<BreadcrumbItem className="tracking-tight font-lexend text-sm select-none">
// 								{isLoading || otherProperties === (undefined || null) ? (
// 									<Skeleton height={18} width={80} />
// 								) : (
// 									<>
// 										<BreadcrumbLink
// 											href={`/${segments.slice(0, index + 1).join("/")}`}
// 										>
// 											{property?.street_address}
// 											{property?.apt ? ` ${property?.apt}` : ""}
// 										</BreadcrumbLink>
// 										<Popover open={open} onOpenChange={setOpen}>
// 											<PopoverTrigger asChild className="">
// 												<ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-100" />
// 											</PopoverTrigger>
// 											<PopoverContent className="w-64 p-0">
// 												<Command className="bg-white ">
// 													<CommandInput
// 														placeholder="Search properties..."
// 														className="tracking-tight font-lexend text-sm"
// 													/>
// 													<CommandEmpty>No property found</CommandEmpty>
// 													<CommandGroup>
// 														<CommandList>
// 															{otherProperties?.map((property) => (
// 																<BreadcrumbLink
// 																	key={property.id}
// 																	href={`/dashboard/${property.id}`}
// 																>
// 																	<CommandItem
// 																		key={property.id}
// 																		value={`${property.street_address} ${property.city} ${property.state} ${property.apt} ${property.zip}`}
// 																		onSelect={(currentValue) => {
// 																			setValue(
// 																				currentValue === value
// 																					? ""
// 																					: currentValue,
// 																			);
// 																			setOpen(false);
// 																		}}
// 																		className="tracking-tight font-lexend text-sm text-gray-400 hover:text-gray-400 active:text-gray-400 focus:text-gray-400"
// 																	>
// 																		{property.street_address}
// 																	</CommandItem>
// 																</BreadcrumbLink>
// 															))}
// 														</CommandList>
// 													</CommandGroup>
// 												</Command>
// 											</PopoverContent>
// 										</Popover>
// 									</>
// 								)}
// 							</BreadcrumbItem>
// 						)}
// 					</div>
// 				))}
// 			</BreadcrumbList>
// 		</Breadcrumb>
// 	);
// }
