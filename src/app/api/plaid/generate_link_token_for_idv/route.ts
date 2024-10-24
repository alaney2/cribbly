import { NextResponse } from "next/server";
import {
	Configuration,
	PlaidApi,
	PlaidEnvironments,
	type Products,
	type LinkTokenCreateRequest,
	type CountryCode,
} from "plaid";
import { createClient } from "@/utils/supabase/server";

const PLAID_ENV = process.env.PLAID_ENV || "sandbox";
const ID_VER_TEMPLATE = process.env.TEMPLATE_ID || "";
const PLAID_COUNTRY_CODES: CountryCode[] = (
	process.env.PLAID_COUNTRY_CODES || "US"
).split(",") as CountryCode[];

const configuration = new Configuration({
	basePath: PlaidEnvironments[PLAID_ENV],
	baseOptions: {
		headers: {
			"PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
			"PLAID-SECRET": process.env.PLAID_SECRET,
			"Plaid-Version": "2020-09-14",
		},
	},
});

const plaidClient = new PlaidApi(configuration);

export async function POST(request: Request) {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return;
	const email = user.email;
	const configs: LinkTokenCreateRequest = {
		user: {
			client_user_id: user.id,
			email_address: email,
		},
		client_name: "Cribbly",
		products: ["identity_verification"] as Products[],
		identity_verification: {
			template_id: ID_VER_TEMPLATE,
		},
		country_codes: PLAID_COUNTRY_CODES,
		language: "en",
	};

	const createTokenResponse = await plaidClient.linkTokenCreate(configs);
	return NextResponse.json(createTokenResponse.data);
}
