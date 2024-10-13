"use client";
import React, { useState, useCallback, forwardRef, cloneElement } from "react";
import {
	useTellerConnect,
	type TellerConnectOptions,
} from "teller-connect-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { createNewAccount } from "@/utils/teller/actions";

type TellerConnectButtonProps = {
	onSuccess: (accounts: any[]) => void;
	onClick?: () => void;
	children: React.ReactNode;
};

export const TellerConnectButton = forwardRef<
	HTMLButtonElement,
	TellerConnectButtonProps
>(({ onSuccess, onClick, children }, ref) => {
	const [isMounted, setIsMounted] = useState(false);
	const applicationId = process.env.NEXT_PUBLIC_TELLER_APP_ID || "";

	React.useEffect(() => {
		setIsMounted(true);
	}, []);

	const handleTellerSuccess = useCallback(
		async (authorization: any) => {
			toast.promise(
				async () => {
					// await createNewAccount(authorization);
					if (onClick) {
						onClick();
					}
					const accessToken = authorization.accessToken;

					const accountsResponse = await fetch("/api/teller/accounts", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ accessToken }),
					});

					if (!accountsResponse.ok) {
						throw new Error("Failed to fetch accounts");
					}

					const accounts = await accountsResponse.json();
					const accountIds = accounts.map((account: any) => account.id);

					const zelleSupportResponse = await fetch(
						"/api/teller/zelle-support",
						{
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({ accessToken, accountIds }),
						},
					);

					if (!zelleSupportResponse.ok) {
						throw new Error("Failed to fetch Zelle support");
					}

					const zelleData = await zelleSupportResponse.json();
					const zelleSupport = zelleData.reduce(
						(acc: Record<string, boolean>, item: any) => {
							acc[item.accountId] = item.zelleSupported;
							return acc;
						},
						{},
					);

					const supabase = createClient();
					const {
						data: { user },
					} = await supabase.auth.getUser();

					if (!user) {
						throw new Error("User not authenticated");
					}

					const zelleBanks = accounts.filter(
						(account: { id: string | number }) => zelleSupport[account.id],
					);
					const insertedBanks = [];

					for (const bank of zelleBanks) {
						const { data, error } = await supabase
							.from("bank_accounts")
							.insert({
								user_id: user.id,
								account_id: bank.id,
								access_token: accessToken,
								last_four: bank.last_four,
								name: bank.name,
								institution_name: bank.institution.name,
								enrollment_id: bank.enrollment_id,
							})
							.select();

						if (error) {
							console.error("Error inserting bank account:", error);
							throw error;
						}
						if (data && data.length > 0) {
							insertedBanks.push(data[0]);
						}
					}
					onSuccess(insertedBanks);

					return { insertedBanks };
				},
				{
					loading: "Checking eligible accounts...",
					success: () => "Bank account linked successfully",
					error: "Failed to link bank account",
				},
			);
		},
		[onSuccess, onClick],
	);

	const config: TellerConnectOptions = {
		applicationId,
		onSuccess: handleTellerSuccess,
		onEvent: (name, data) => console.log(name, data),
		onExit: () => console.log("Teller Connect was dismissed by user"),
		environment: "sandbox",
	};

	const { open, ready } = useTellerConnect(config);

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
		if (ready) {
			open();
		}
	};

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

TellerConnectButton.displayName = "TellerConnectButton";
