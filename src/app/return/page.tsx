"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Return() {
	const router = useRouter();
	const [status, setStatus] = useState(null);
	const [customerEmail, setCustomerEmail] = useState("");

	useEffect(() => {
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		const sessionId = urlParams.get("session_id");

		fetch(`/api/checkout_sessions?session_id=${sessionId}`, {
			method: "GET",
		})
			.then((res) => res.json())
			.then((data) => {
				setStatus(data.status);
				setCustomerEmail(data.customer_email);
			});
	}, []);

	if (status === "open") {
		return router.push("/");
	}

	if (status === "complete") {
		return (
			<section id="success">
				<p>
					We appreciate your business! A confirmation email will be sent to{" "}
					{customerEmail}. If you have any questions, please email{" "}
					<a href="mailto:support@cribbly.io">support@cribbly.io</a>.
				</p>
			</section>
		);
	}

	return null;
}
