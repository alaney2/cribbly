"use server";
import { Moov, SCOPES } from "@moovio/node";
// import { MoovOnboarding } from "@moovio/moov-js";

export async function createMoovAccount() {
	const moov = new Moov({
		accountID: process.env.NEXT_PUBLIC_MOOV_ACCOUNT_ID as string,
		publicKey: process.env.NEXT_PUBLIC_MOOV_PUBLIC_KEY as string,
		secretKey: process.env.MOOV_SECRET_KEY as string,
		domain: process.env.NEXT_PUBLIC_SITE_URL as string,
	});
	const scopes = [SCOPES.ACCOUNTS_CREATE];
	try {
		const { token } = await moov.generateToken(scopes);
		return token;
		// console.log(token);

		// // Do something with token
		// // const moov = Moov(token);
		// const moov = await loadMoov(token);
		// const accountPayload = {
		// 	accountType: "business",
		// 	profile: {
		// 		business: {
		// 			legalBusinessName: "Whole Body Fitness LLC",
		// 			businessType: "llc",
		// 			website: "wbfllc.com",
		// 		},
		// 	},
		// 	foreignId: "your-correlation-id",
		// };
	} catch (err) {
		// Handle any errors
		console.error(err);
	}
}
