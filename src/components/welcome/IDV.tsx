"use client";

import React, { useState, useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";
import { Button } from "@/components/catalyst/button";

export const IdentityVerification = () => {
	const [linkToken, setLinkToken] = useState(null);

	// Function to fetch the link token
	const fetchLinkToken = async () => {
		const response = await fetch("/api/plaid/generate_link_token_for_idv", {
			method: "POST",
		});
		const data = await response.json();
		setLinkToken(data.link_token);
	};

	// Fetch the link token when the component mounts
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		fetchLinkToken();
	}, []);

	// Plaid Link configuration
	const config = {
		token: linkToken,
		onSuccess: (publicToken: any, metadata: any) => {
			console.log("onSuccess", publicToken, metadata);
			// You can make an API call to your server here to exchange the public token
		},
		onExit: (err: any, metadata: any) => {
			console.log("onExit", err, metadata);
		},
		onEvent: (eventName: any, metadata: any) => {
			console.log("onEvent", eventName, metadata);
		},
	};

	const { open, ready } = usePlaidLink(config);

	return (
		<div>
			<Button
				onClick={() => open()}
				disabled={!ready}
				color="blue"
				className="w-full mt-2"
			>
				Continue
			</Button>
		</div>
	);
};
