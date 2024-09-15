"use server";
import { Moov, SCOPES } from "@moovio/node";
// import { MoovOnboarding } from "@moovio/moov-js";

export async function createMoovToken() {
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
	} catch (err) {
		console.error(err);
		throw err;
	}
}

export async function createMoovAccount(formData: any) {
	const moov = new Moov({
		accountID: process.env.NEXT_PUBLIC_MOOV_ACCOUNT_ID as string,
		publicKey: process.env.NEXT_PUBLIC_MOOV_PUBLIC_KEY as string,
		secretKey: process.env.MOOV_SECRET_KEY as string,
		domain: process.env.NEXT_PUBLIC_SITE_URL as string,
	});
	try {
		const [year, month, day] = formData["birthDate"].split("-");
		const accountPayload = {
			accountType: formData["accountType"],
			profile: {
				individual: {
					address: {
						addressLine1: formData["address"]["addressLine1"],
						addressLine2: formData["address"]["addressLine2"],
						city: formData["address"]["city"],
						stateOrProvince: formData["address"]["stateOrProvince"],
						postalCode: formData["address"]["zipCode"],
						country: formData["address"]["country"],
					},
					birthDate: {
						day: Number.parseInt(day, 10),
						month: Number.parseInt(month, 10),
						year: Number.parseInt(year, 10),
					},
					birthDateProvided: true,
					email: formData["email"],
					governmentID: {
						ssn: {
							full: formData["governmentID"]["ssn"].replace(/-/g, ""),
							lastFour: formData["governmentID"]["ssn"]?.slice(-4),
						},
					},
					governmentIDProvided: true,
					name: {
						firstName: formData["name"]["firstName"],
						middleName: "",
						lastName: formData["name"]["lastName"],
						suffix: "",
					},
					phone: {
						number: formData["phone"]["number"].replace(/-/g, ""),
						countryCode: formData["phone"]["countryCode"],
					},
				},
			},
			metadata: {},
			capabilities: ["transfers", "send-funds", "wallet"],
			mode: "sandbox",
			settings: null,
			customerSupport: null,
			foreignID: "",
			termsOfService: {
				token: formData["tosToken"],
			},
		};

		// console.log("ACCOUNT PAYLOAD", accountPayload.profile.individual.birthDate);
		console.log(formData["tosToken"]);

		const account = await moov.accounts.create(accountPayload);
		console.log(account);
		return account;
	} catch (err: any) {
		// console.error("Error creating Moov account:", err);
		if (err.response) {
			console.error("Response headers:", err.response.headers);
		}
		throw err;
	}
}
