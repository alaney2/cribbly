"use client";
import { useState, useEffect, forwardRef } from "react";
import { createClient } from "@/utils/supabase/client";
import {
	Dialog,
	DialogActions,
	DialogDescription,
	DialogTitle,
} from "@/components/catalyst/dialog";
import { Button } from "@/components/catalyst/button";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import { usePlaidLink } from "react-plaid-link";
import type {
	PlaidLinkError,
	PlaidLinkOnExitMetadata,
	PlaidLinkOptions,
} from "react-plaid-link";
import { toast } from "sonner";
import { useSearchParams, usePathname } from "next/navigation";

type PlaidLinkButtonProps = {
	onSuccess: (accounts: any[]) => void;
	children: React.ReactNode;
};

export const PlaidLinkButton = forwardRef<
	HTMLButtonElement,
	PlaidLinkButtonProps
>(({ onSuccess, children }, ref) => {
	const [linkToken, setLinkToken] = useState<string | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const searchParams = useSearchParams();
	const pathname = usePathname();

	const generateToken = async () => {
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

	const handlePlaidSuccess = async (publicToken: string) => {
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

				onSuccess(existingAccounts || []);

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
		onSuccess: handlePlaidSuccess,
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
		<>
			<button
				onClick={(e) => {
					e.preventDefault();
					setIsDialogOpen(true);
				}}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						setIsDialogOpen(true);
					}
				}}
				type="button"
				tabIndex={0}
				className="cursor-default"
				ref={ref}
			>
				{children}
			</button>
			<Dialog open={isDialogOpen} onClose={setIsDialogOpen}>
				<div className="flex items-center gap-x-4 mb-4">
					<LockClosedIcon className="w-6 text-gray-500" />
					<DialogTitle className="text-xl font-semibold">
						Link Bank Account
					</DialogTitle>
				</div>
				<DialogDescription className="mb-4">
					In order to verify your bank account information, you will be
					redirected to our third-party partner, Plaid.
				</DialogDescription>
				<DialogDescription>
					The transfer of your data is encrypted end-to-end and your credentials
					will never be made accessible to Cribbly.
				</DialogDescription>
				<DialogActions>
					<Button plain onClick={() => setIsDialogOpen(false)}>
						Cancel
					</Button>
					<Button
						color="blue"
						onClick={async () => {
							await generateToken();
							setIsDialogOpen(false);
						}}
					>
						Continue
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
});
