"use server";
import { Moov, SCOPES } from "@moovio/node";
import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/utils/supabase/actions";
// import { MoovOnboarding } from "@moovio/moov-js";

const moov = new Moov({
	accountID: process.env.NEXT_PUBLIC_MOOV_ACCOUNT_ID as string,
	publicKey: process.env.NEXT_PUBLIC_MOOV_PUBLIC_KEY as string,
	secretKey: process.env.MOOV_SECRET_KEY as string,
	domain: process.env.NEXT_PUBLIC_SITE_URL as string,
});

const supabase = createClient();

export async function createMoovToken() {
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
	const useItin = formData["governmentID"]["useITIN"];

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
						ssn: useItin
							? null
							: {
									full: formData["governmentID"]["ssn"].replace(/-/g, ""),
									lastFour: formData["governmentID"]["ssn"]?.slice(-4),
								},
						itin: useItin
							? {
									full: formData["governmentID"]["itin"].replace(/-/g, ""),
									lastFour: formData["governmentID"]["itin"]?.slice(-4),
								}
							: null,
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

		const account = await moov.accounts.create(accountPayload);
		if (account.accountID) {
			const supabase = createClient();
			const {
				data: { user },
				error: userError,
			} = await supabase.auth.getUser();
			const { data, error } = await supabase.from("moov_accounts").insert([
				{
					user_id: user?.id,
					account_id: account.accountID,
					account_type: account.accountType,
				},
			]);
			const capabilities = ["transfers", "send-funds", "wallet"];
			const response = await moov.capabilities.requestCapabilities(
				account.accountID,
				capabilities,
			);
			console.log(response);
			if (error) {
				console.error("Error inserting moov account:", error);
			}
		}
		return account;
	} catch (err: any) {
		if (err.response) {
			console.error("Response headers:", err.response.headers);
		}
		throw err;
	}
}

export async function linkBankAccount(result: any) {
	const user = await getUser();
	if (!user) return;

	const { data: userData, error: userError } = await supabase
		.from("users")
		.select("*")
		.eq("id", user.id)
		.single();

	if (userError) {
		console.error("Error fetching user in linkBankAccount:", userError);
		return;
	}

	const { data: moovAccount, error } = await supabase
		.from("moov_accounts")
		.select("*")
		.eq("user_id", user.id)
		.single();

	if (error) {
		console.error("Error fetching moov account in linkBankAccount:", error);
		return;
	}

	const bankAccountPayload = {
		bankAccount: {
			accountNumber: result.accountNumber,
			bankAccountType: result.subtype,
			holderName: userData.full_name,
			holderType: "individual",
			routingNumber: result.routingNumber,
		},
		processorToken: result.processorToken,
	};

	const response = await moov.bankAccounts.link(
		moovAccount.account_id,
		bankAccountPayload.bankAccount,
		bankAccountPayload.processorToken,
	);

	return response;
}
