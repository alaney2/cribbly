import { type NextRequest, NextResponse } from "next/server";
import https from "node:https";

export async function POST(req: NextRequest) {
	try {
		const { accessToken, accountIds } = await req.json();

		if (!accessToken || !accountIds || !Array.isArray(accountIds)) {
			return NextResponse.json(
				{ error: "Invalid request parameters" },
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

		const zelleSupport = await Promise.all(
			accountIds.map(async (accountId) => {
				const supported = await checkZelleSupport(
					accountId,
					accessToken,
					cert,
					key,
				);
				return { accountId, zelleSupported: supported };
			}),
		);

		return NextResponse.json(zelleSupport);
	} catch (error) {
		console.error("Error checking Zelle support:", error);

		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ error: "An unknown error occurred" },
			{ status: 500 },
		);
	}
}

async function checkZelleSupport(
	accountId: string,
	accessToken: string,
	cert: string,
	key: string,
): Promise<boolean> {
	return new Promise((resolve, reject) => {
		const options = {
			hostname: "api.teller.io",
			port: 443,
			path: `/accounts/${accountId}/payments`,
			method: "OPTIONS",
			cert: cert,
			key: key,
			headers: {
				Authorization: `Basic ${Buffer.from(`${accessToken}:`).toString("base64")}`,
			},
		};

		const req = https.request(options, (res) => {
			let data = "";

			res.on("data", (chunk) => {
				data += chunk;
			});

			res.on("end", () => {
				if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
					try {
						const response = JSON.parse(data);
						console.log("RESPONSE", response);
						const zelleSupported =
							response.schemes?.some(
								(scheme: any) => scheme.name === "zelle",
							) || false;
						resolve(zelleSupported);
					} catch (error) {
						console.error("Error parsing Teller API response:", error);
						reject(new Error("Error parsing Teller API response"));
					}
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
}
