import { type NextRequest, NextResponse } from "next/server";
import https from "node:https";

export async function POST(req: NextRequest) {
	try {
		const { accessToken } = await req.json();

		if (!accessToken) {
			return NextResponse.json(
				{ error: "Access token not provided" },
				{ status: 400 },
			);
		}
		// Ensure environment variables are set
		const certBase64 = process.env.CERTIFICATE_PEM_BASE64 || "";
		const keyBase64 = process.env.PRIVATE_KEY_PEM_BASE64 || "";

		if (!certBase64 || !keyBase64) {
			console.error("Certificate or key not provided in environment variables");
			return NextResponse.json(
				{ error: "Certificate or key not provided" },
				{ status: 500 },
			);
		}

		// Decode base64-encoded certificate and key
		const cert = Buffer.from(certBase64, "base64").toString();
		const key = Buffer.from(keyBase64, "base64").toString();

		// Create an HTTPS agent with the client certificate and key
		return new Promise((resolve, reject) => {
			const options = {
				hostname: "api.teller.io",
				port: 443,
				path: "/accounts",
				method: "GET",
				cert: cert,
				key: key,
				headers: {
					Authorization: `Basic ${Buffer.from(`${accessToken}:`).toString("base64")}`,
					Accept: "application/json",
				},
			};

			const req = https.request(options, (res) => {
				let data = "";

				res.on("data", (chunk) => {
					data += chunk;
				});

				res.on("end", () => {
					if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
						resolve(
							NextResponse.json(JSON.parse(data), { status: res.statusCode }),
						);
					} else {
						console.error(`Teller API error (${res.statusCode}):`, data);
						reject(new Error(`HTTP error! status: ${res.statusCode}`));
					}
				});
			});

			req.on("error", (error) => {
				console.error("Error making request to Teller API:", error);
				reject(error);
			});

			req.end();
		});
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
