import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	try {
		// Ensure environment variables are set
		const certBase64 = process.env.CERTIFICATE_PEM_BASE64 || "";
		const keyBase64 = process.env.PRIVATE_KEY_PEM_BASE64 || "";

		if (!certBase64 || !keyBase64) {
			return NextResponse.json(
				{ error: "Certificate or key not provided" },
				{ status: 500 },
			);
		}

		// Decode base64-encoded certificate and key
		const cert = Buffer.from(certBase64, "base64").toString();
		const key = Buffer.from(keyBase64, "base64").toString();

		// Create an HTTPS agent with the client certificate and key
		const response = await fetch("https://api.teller.io/", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			// @ts-ignore - Next.js extends the fetch options type, but TypeScript doesn't recognize it
			cert: cert,
			key: key,
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();

		return NextResponse.json(data, { status: response.status });
	} catch (error) {
		console.error("Error making request to Teller API:", error);

		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ error: "An unknown error occurred" },
			{ status: 500 },
		);
	}
}
