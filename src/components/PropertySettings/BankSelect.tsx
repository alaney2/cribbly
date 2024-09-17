"use client";
import { useState, useEffect } from "react";
import { Field, Label } from "@/components/catalyst/fieldset";
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
import { usePlaidLink } from "react-plaid-link";
import type {
	PlaidLinkError,
	PlaidLinkOnExitMetadata,
	PlaidLinkOptions,
} from "react-plaid-link";
import { toast } from "sonner";
import { useSearchParams, usePathname } from "next/navigation";

export function BankSelect() {
	const [linkToken, setLinkToken] = useState<string | null>(null);
	const [banks, setBanks] = useState<string[]>([]); // You'll need to fetch this from your backend
	const searchParams = useSearchParams();
	const pathname = usePathname();

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

				// Fetch updated bank list here
				// setBanks([...]);

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
		<Dropdown>
			<DropdownButton outline className="w-full">
				<SidebarLabel>Select Bank</SidebarLabel>
				<ChevronDownIcon />
			</DropdownButton>
			<DropdownMenu className="w-80 lg:w-64">
				<DropdownItem>
					<DropdownLabel>Chase</DropdownLabel>
				</DropdownItem>
				<DropdownDivider />
				<DropdownItem onClick={generateToken}>
					<PlusIcon />
					<DropdownLabel>Add bank</DropdownLabel>
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	);
}
