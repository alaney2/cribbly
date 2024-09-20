"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Field, Label } from "@/components/catalyst/fieldset";
import {
	Dropdown,
	DropdownButton,
	DropdownDivider,
	DropdownItem,
	DropdownLabel,
	DropdownMenu,
} from "@/components/catalyst/dropdown";
import {
	Listbox,
	ListboxLabel,
	ListboxOption,
	ListboxDivider,
} from "@/components/catalyst/listbox";
import { SidebarItem, SidebarLabel } from "@/components/catalyst/sidebar";
import { Divider } from "@/components/catalyst/divider";
import {
	ArrowRightStartOnRectangleIcon,
	ChevronDownIcon,
	PlusIcon,
} from "@heroicons/react/16/solid";
import { usePlaidLink } from "react-plaid-link";
import type {
	PlaidLinkError,
	PlaidLinkOnExitMetadata,
	PlaidLinkOptions,
} from "react-plaid-link";
import { toast } from "sonner";
import { useSearchParams, usePathname } from "next/navigation";
import { setPrimaryAccount } from "@/utils/supabase/actions";

export function BankSelect({ plaidAccounts }: { plaidAccounts: any[] | null }) {
	const [linkToken, setLinkToken] = useState<string | null>(null);
	const [banks, setBanks] = useState<any[]>(plaidAccounts || []);
	const [selectedBank, setSelectedBank] = useState<any | null>(
		banks.filter((bank) => bank.use_for_payouts)[0] || null,
	);
	const searchParams = useSearchParams();
	const pathname = usePathname();

	const handleAddBank = async () => {
		await generateToken();
		setSelectedBank(null);
		if (linkToken && ready) {
			open();
		}
	};

	const generateToken = async () => {
		console.log("generateToken");
		if (searchParams.has("oauth_state_id")) {
			const link_token = localStorage.getItem("link_token");
			if (!link_token) {
				console.error("Link token not found");
				return;
			}
			setLinkToken(link_token);
			return;
		}
		const response = await fetch("/api/plaid/create_link_token", {
			method: "POST",
		});
		if (!response.ok) {
			console.error("Failed to create link token");
			return;
		}
		const data = await response.json();
		localStorage.setItem("link_token", data.link_token);
		setLinkToken(data.link_token);
	};

	const onSuccess = async (publicToken: string) => {
		toast.promise(
			async () => {
				const response = await fetch("/api/plaid/set_access_token", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ publicToken }),
				});
				if (!response.ok) {
					throw new Error("Failed to exchange public token for access token");
				}
				const { success } = await response.json();

				localStorage.removeItem("link_token");
				setLinkToken(null);

				// Fetch updated banks
				const supabase = createClient();
				const {
					data: { user },
				} = await supabase.auth.getUser();

				if (!user) {
					return;
				}
				const { data: existingAccounts } = await supabase
					.from("plaid_accounts")
					.select("*")
					.eq("user_id", user.id)
					.order("use_for_payouts", { ascending: false });

				setBanks(existingAccounts || []);
				setSelectedBank(existingAccounts?.[0]);

				if (existingAccounts && existingAccounts.length > 0) {
					const primaryAccount =
						existingAccounts.find((account) => account.use_for_payouts) ||
						existingAccounts[0];
					setSelectedBank(primaryAccount);
					await setPrimaryAccount(primaryAccount.account_id);
				}

				return success;
			},
			{
				loading: "Linking bank account...",
				success: () => "Bank account linked successfully",
				error: "Failed to link bank account",
			},
		);
	};

	const config: PlaidLinkOptions = {
		token: linkToken,
		onSuccess,
		onExit: (
			error: PlaidLinkError | null,
			metadata: PlaidLinkOnExitMetadata,
		) => {
			localStorage.removeItem("link_token");
			setLinkToken(null);
			if (error) {
				toast.error("Bank account linking failed");
			}
		},
	};

	if (searchParams.has("oauth_state_id")) {
		config.receivedRedirectUri = pathname;
	}

	const { open, ready } = usePlaidLink(config);

	useEffect(() => {
		if (linkToken && ready) {
			open();
		}
	}, [linkToken, ready, open]);

	return (
		<Listbox
			name="bank-select"
			value={selectedBank ? selectedBank.name : "Select Bank"}
			defaultValue={"Select Bank"}
			onChange={(value) => {
				if (value === "Add bank") {
					handleAddBank();
				} else {
					const selected = banks.find((bank) => bank.name === value);
					setSelectedBank(selected);
					setPrimaryAccount(selected.account_id);
				}
			}}
		>
			{banks.map((bank) => (
				<ListboxOption key={bank.account_id} value={bank.name}>
					<ListboxLabel>{bank.name}</ListboxLabel>
				</ListboxOption>
			))}
			<ListboxOption value="Add bank">
				<ListboxLabel className="mr-2">Add bank</ListboxLabel>
				<PlusIcon className="w-4 h-4" />
			</ListboxOption>
		</Listbox>
		// <Dropdown>
		// {/* <DropdownButton outline className="w-full">
		// 	<SidebarLabel>
		// 		{selectedBank ? selectedBank.name : "Select Bank"}
		// 	</SidebarLabel>
		// 	<ChevronDownIcon />
		// </DropdownButton> */}

		// {/* <ListboxOption onClick={handleAddBank}>
		// 	<PlusIcon />
		// 	<ListboxLabel>Add bank</ListboxLabel>
		// </ListboxOption> */}
		// {/* <DropdownMenu className="w-80 lg:w-64">
		// 	{banks.map((bank) => (
		// 		<DropdownItem
		// 			key={bank.account_id}
		// 			onClick={() => setPrimaryAccount(bank.account_id)}
		// 		>
		// 			{bank.account_id === selectedBank?.account_id && (
		// 				<div className="bg-blue-500 h-4 w-4 mr-3 rounded-full" />
		// 			)}
		// 			<DropdownLabel>{bank.name}</DropdownLabel>
		// 		</DropdownItem>
		// 	))}
		// 	{banks.length > 0 && <DropdownDivider />}
		// 	<DropdownItem onClick={handleAddBank}>
		// 		<PlusIcon />
		// 		<DropdownLabel>Add bank</DropdownLabel>
		// 	</DropdownItem>
		// </DropdownMenu> */}
		// </Dropdown>
	);
}
