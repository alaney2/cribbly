// app/api/createMoovAccount/route.ts

import { type NextRequest, NextResponse } from "next/server";
// import { Moov, SCOPES } from "@moovio/node";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
	try {
		const formData = await request.json();

		// const moov = new Moov({
		// 	accountID: process.env.NEXT_PUBLIC_MOOV_ACCOUNT_ID as string,
		// 	publicKey: process.env.NEXT_PUBLIC_MOOV_PUBLIC_KEY as string,
		// 	secretKey: process.env.MOOV_SECRET_KEY as string,
		// 	domain: process.env.NEXT_PUBLIC_SITE_URL as string,
		// });
		const payload = {
			iss: process.env.NEXT_PUBLIC_MOOV_PUBLIC_KEY,
			aud: "moov_issuer",
			iat: Math.floor(Date.now() / 1000),
			scopes: ["accounts.create"], // Adjust scopes as needed
		};
		// const scopes = [SCOPES.ACCOUNTS_CREATE];
		// const { token } = await moov.generateToken(scopes);
		const token = jwt.sign(payload, process.env.MOOV_SECRET_KEY as string, {
			algorithm: "HS256",
		});

		const [year, month, day] = formData["birthDate"].split("-");

		const accountPayload = {
			accountType: formData["accountType"],
			profile: {
				individual: {
					address: {
						addressLine1: formData["address"]["addressLine1"],
						addressLine2: formData["address"]["addressLine2"],
						city: formData["address"]["city"],
						country: formData["address"]["country"],
						postalCode: formData["address"]["postalCode"],
						state: formData["address"]["state"],
					},
					birthDate: {
						day: Number.parseInt(day, 10),
						month: Number.parseInt(month, 10),
						year: Number.parseInt(year, 10),
					},
					email: formData["email"],
					governmentID: {
						ssn: {
							full: formData["governmentID"]["ssn"].replace(/-/g, ""),
							lastFour: formData["governmentID"]["ssn"]?.slice(-4),
						},
					},
					name: {
						firstName: formData["name"]["firstName"],
						lastName: formData["name"]["lastName"],
					},
					phone: {
						number: formData["phone"]["number"].replace(/-/g, ""),
						countryCode: formData["phone"]["countryCode"],
					},
				},
			},
			metadata: {},
			capabilities: ["transfers", "send-funds", "wallet"],
			mode: "production",
			settings: null,
			customerSupport: null,
			foreignId: null,
			termsOfService: {
				token: formData["tosToken"],
			},
		};

		const response = await fetch("https://api.moov.io/accounts", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"X-Wait-For": "connection",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(accountPayload),
		});

		if (!response.ok) {
			const errorData = await response.json();
			console.error("Error response from Moov API:", errorData);
			return NextResponse.json(
				{ error: "Error creating Moov account", details: errorData },
				{ status: response.status },
			);
		}

		const account = await response.json();
		return NextResponse.json(account);
	} catch (err: any) {
		console.error("Error creating Moov account:", err);
		return NextResponse.json(
			{ error: "Error creating Moov account" },
			{ status: 500 },
		);
	}
}
