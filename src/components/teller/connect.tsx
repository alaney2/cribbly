"use client";
import React, { useCallback, useState } from "react";

import {
	useTellerConnect,
	type TellerConnectOnSuccess,
	type TellerConnectOnEvent,
	type TellerConnectOnExit,
	type TellerConnectOptions,
} from "teller-connect-react";
import { Button } from "@/components/catalyst/button";
import { createNewAccount } from "@/utils/teller/actions";

export function TellerConnect() {
	const [accounts, setAccounts] = useState<any[]>([]);
	const [zelleSupport, setZelleSupport] = useState<Record<string, boolean>>({});
	const applicationId = process.env.NEXT_PUBLIC_TELLER_APP_ID || "";

	const onSuccess = useCallback<TellerConnectOnSuccess>(
		async (authorization) => {
			// send public_token to server
			console.log(authorization);
			await createNewAccount(authorization);
			const accessToken = authorization.accessToken;
			fetch("/api/teller/accounts", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ accessToken }),
			})
				.then((response) => response.json())
				.then((data) => {
					setAccounts(data);
					return data;
				})
				.then((accounts) => {
					const accountIds = accounts.map((account: any) => account.id);
					return fetch("/api/teller/zelle-support", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ accessToken, accountIds }),
					});
				})
				.then((response) => response.json())
				.then((zelleData) => {
					const supportMap = zelleData.reduce(
						(acc: Record<string, boolean>, item: any) => {
							acc[item.accountId] = item.zelleSupported;
							return acc;
						},
						{},
					);
					setZelleSupport(supportMap);
				})
				.catch((error) => {
					console.error("Error:", error);
				});

			console.log("TellerConnect was successful");
		},
		[],
	);
	const onEvent = useCallback<TellerConnectOnEvent>((name, data) => {
		console.log(name, data);
	}, []);
	const onExit = useCallback<TellerConnectOnExit>(() => {
		console.log("TellerConnect was dismissed by user");
	}, []);

	const config: TellerConnectOptions = {
		applicationId,
		onSuccess,
		onEvent,
		onExit,
		environment: "sandbox",
	};

	const { open, ready } = useTellerConnect(config);

	return (
		<>
			<Button onClick={() => open()} disabled={!ready}>
				Connect a bank account
			</Button>
			{accounts.length > 0 && (
				<div>
					<h2>Connected Accounts:</h2>
					<ul>
						{accounts.map((account) => (
							<li key={account.id}>
								{account.id} - Zelle Supported:{" "}
								{zelleSupport[account.id] ? "Yes" : "No"}
							</li>
						))}
					</ul>
				</div>
			)}
		</>
	);
}
