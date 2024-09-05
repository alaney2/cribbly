import { Moov, SCOPES } from "@moovio/node";

export async function createMoovAccount() {
	const moov = new Moov({
		accountID: process.env.NEXT_PUBLIC_MOOV_ACCOUNT_ID as string,
		publicKey: process.env.NEXT_PUBLIC_MOOV_PUBLIC_KEY as string,
		secretKey: process.env.MOOV_SECRET_KEY as string,
		domain: process.env.NEXT_PUBLIC_DOMAIN as string,
	});

	const scopes = [SCOPES.ACCOUNTS_CREATE];
	try {
		const { token } = await moov.generateToken(scopes);
		// Do something with token
	} catch (err) {
		// Handle any errors
	}
}
