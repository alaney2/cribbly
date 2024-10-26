"use client";

import React, { useState, useEffect, useCallback } from "react";
import { usePlaidLink } from "react-plaid-link";
import { Button } from "@/components/catalyst/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const IdentityVerification = () => {
	const [linkToken, setLinkToken] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	// Function to fetch the link token
	const fetchLinkToken = useCallback(async () => {
		const response = await fetch("/api/plaid/generate_link_token_for_idv", {
			method: "POST",
		});
		const data = await response.json();
		setLinkToken(data.link_token);
	}, []);

	// Fetch the link token when the component mounts
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		fetchLinkToken();
	}, []);

	const handleIDVSuccess = async (metadata: any) => {
		console.log("handleIDVSuccess", metadata);
		const linkSessionId = metadata.link_session_id;
		console.log("linkSessionId", linkSessionId);
		try {
			const response = await fetch("/api/plaid/idv_complete", {
				method: "POST",
				body: JSON.stringify({ linkSessionId }),
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (!response.ok) {
				if (response.status >= 400 && response.status < 600) {
					toast.error(
						`Error: ${response.statusText}. Please contact support@cribbly.io.`,
					);
				}
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			toast.success("Verification completed successfully");
		} catch (error) {
			console.error(error);
			toast.error("An error occurred during verification");
		}
	};

	// Plaid Link configuration
	const config = {
		token: linkToken,
		onSuccess: async (publicToken: any, metadata: any) => {
			console.log("success", publicToken);
			await handleIDVSuccess(metadata);
		},
		onExit: (err: any, metadata: any) => {
			// console.log("onExit", err, metadata);
		},
		onEvent: async (eventName: any, metadata: any) => {
			// console.log("onEvent", eventName);
			// if (eventName === "IDENTITY_VERIFICATION_PASS_SESSION") {
			// 	console.log("passing");
			// 	await handleIDVSuccess(metadata);
			// }
		},
	};

	const { open, ready } = usePlaidLink(config);

	const handleClick = useCallback(async () => {
		if (!linkToken) {
			await fetchLinkToken();
		}
		if (ready) {
			open();
		}
	}, [linkToken, ready, open, fetchLinkToken]);

	return (
		<div>
			<Button
				onClick={handleClick}
				disabled={!ready}
				color="blue"
				className="w-full mt-2"
			>
				Continue
			</Button>
		</div>
	);
};
