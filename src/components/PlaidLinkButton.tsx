"use client";
import { useState, useEffect, forwardRef, cloneElement, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { usePlaidLink } from "react-plaid-link";
import type {
	PlaidLinkError,
	PlaidLinkOnExitMetadata,
	PlaidLinkOptions,
} from "react-plaid-link";
import { toast } from "sonner";
import { useSearchParams, usePathname } from "next/navigation";
import { linkBankAccount } from "@/utils/moov/actions";
import React from "react";
import { useMediaQuery } from "usehooks-ts";

type PlaidLinkButtonProps = {
	onSuccess: (accounts: any[]) => void;
	onClick?: () => void;
	children: React.ReactNode;
};

export const PlaidLinkButton = forwardRef<
	HTMLButtonElement,
	PlaidLinkButtonProps
>(({ onSuccess, onClick, children }, ref) => {
	const [linkToken, setLinkToken] = useState<string | null>(null);
	const [isMounted, setIsMounted] = useState(false);
	const isMobile = useMediaQuery("(max-width: 640px)");
	const searchParams = useSearchParams();
	const pathname = usePathname();

	useEffect(() => {
		setIsMounted(true);
	}, []);

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
				const result = await response.json();

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

				const linkingResponse = await linkBankAccount(result);

				onSuccess(existingAccounts || []);
				return result.success;
			},
			{
				loading: "Linking bank account...",
				success: () => "Bank account linked successfully",
				error: "Failed to link bank account",
			},
		);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const config: PlaidLinkOptions = useMemo(() => {
		const baseConfig: PlaidLinkOptions = {
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
			baseConfig.receivedRedirectUri = pathname;
		}

		return baseConfig;
	}, [linkToken, searchParams, pathname]);

	const { open, ready } = usePlaidLink(config);

	const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
		if (isMobile) {
			if (onClick) {
				onClick();
			}
		}
		await generateToken();
		if (!isMobile) {
			if (onClick) {
				onClick();
			}
		}
	};

	useEffect(() => {
		if (linkToken && ready) {
			open();
		}
	}, [linkToken, ready, open]);

	if (!isMounted) {
		return null;
	}

	return (
		<>
			{cloneElement(React.Children.only(children) as React.ReactElement, {
				onClick: handleClick,
				ref: ref,
			})}
		</>
	);
});
