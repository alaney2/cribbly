import { NextResponse } from "next/server";
import {
	Configuration,
	PlaidApi,
	Products,
	PlaidEnvironments,
	type ProcessorTokenCreateRequest,
	ProcessorTokenCreateRequestProcessorEnum,
} from "plaid";
import { createClient } from "@/utils/supabase/server";
import { getURL } from "@/utils/helpers";

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || "sandbox";
const PLAID_PRODUCTS = (
	process.env.PLAID_PRODUCTS || Products.Transactions
).split(",");
const PLAID_COUNTRY_CODES = (process.env.PLAID_COUNTRY_CODES || "US").split(
	",",
);
const PLAID_REDIRECT_URI = process.env.PLAID_REDIRECT_URI || "";

// We store the access_token in memory - in production, store it in a secure
// persistent data store
let ACCESS_TOKEN = null;
let ITEM_ID = null;
// let PUBLIC_TOKEN = null;
// let ACCOUNT_ID = null;

// The transfer_id and authorization_id are only relevant for Transfer ACH product.
// We store the transfer_id in memory - in production, store it in a secure
// persistent data store
// let AUTHORIZATION_ID = null;
// let TRANSFER_ID = null;

const configuration = new Configuration({
	basePath: PlaidEnvironments[PLAID_ENV],
	baseOptions: {
		headers: {
			"PLAID-CLIENT-ID": PLAID_CLIENT_ID,
			"PLAID-SECRET": PLAID_SECRET,
			"Plaid-Version": "2020-09-14",
		},
	},
});

const client = new PlaidApi(configuration);

export async function POST(request: Request) {
	const json = await request.json();
	const PUBLIC_TOKEN = json.publicToken;

	try {
		const exchangeTokenResponse = await client.itemPublicTokenExchange({
			public_token: PUBLIC_TOKEN,
		});
		// Store in supabase
		ACCESS_TOKEN = exchangeTokenResponse.data.access_token;
		ITEM_ID = exchangeTokenResponse.data.item_id;

		const supabase = createClient();

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return Response.redirect(getURL("/sign-in"));
		}

		const authResponse = await client.authGet({
			access_token: ACCESS_TOKEN,
		});

		const {
			accounts,
			item,
			numbers: { ach },
		} = authResponse.data;

		if (
			accounts.length === 0 ||
			accounts.length >= 2 ||
			accounts.length !== ach.length
		) {
			throw new Error("Invalid number of accounts");
		}

		const ach0 = ach[0];
		const account = accounts[0];
		const { account_id, name, mask, official_name, type, subtype } = account;
		const { account: account_number, routing, wire_routing } = ach0;

		const request: ProcessorTokenCreateRequest = {
			access_token: ACCESS_TOKEN,
			account_id: account_id,
			processor: ProcessorTokenCreateRequestProcessorEnum.Moov,
		};

		const processorTokenResponse = await client.processorTokenCreate(request);
		const processorToken = processorTokenResponse.data.processor_token;

		const { error } = await supabase.from("plaid_accounts").insert([
			{
				account_id,
				user_id: user.id,
				access_token: ACCESS_TOKEN,
				item_id: ITEM_ID,
				account_number: account_number,
				routing_number: routing,
				wire_routing: wire_routing,
				mask: mask,
				name: name,
				processor_token: processorToken,
				type: type,
				subtype: subtype,
				official_name: official_name,
			},
		]);

		if (error) {
			throw error;
		}

		const response = {
			success: "Bank linked successfully",
			accountId: account_id,
			accountNumber: account_number,
			routingNumber: routing,
			subtype: subtype,
			processorToken: processorToken,
		};

		return NextResponse.json(response);
	} catch (error) {
		return NextResponse.json({
			error: error,
		});
	}
}
