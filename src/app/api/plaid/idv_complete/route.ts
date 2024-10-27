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
import {
	setIdentityVerificationStatus,
	setWelcomeScreen,
} from "@/utils/supabase/actions";

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

	if (!request.body) {
		return NextResponse.json(
			{ error: "Request body is missing" },
			{ status: 400 },
		);
	}

	const { linkSessionId } = await request.json();

	if (!user) {
		return NextResponse.json(
			{ error: "User not authenticated" },
			{ status: 401 },
		);
	}

	const IDVResult = await plaidClient.identityVerificationGet({
		identity_verification_id: linkSessionId,
	});

	const IDVData = IDVResult.data;

	if (IDVData.status !== "success") {
		const { data, error } = await supabase
			.from("users")
			.update({
				is_verified: false,
				idv_status: IDVData.status,
				most_recent_idv_session: linkSessionId,
			})
			.eq("id", IDVData.client_user_id);

		if (error) {
			console.error("Error updating user data:", error);
			return NextResponse.json(
				{ error: "Error updating user data" },
				{ status: 500 },
			);
		}

		return NextResponse.json(
			{ error: "Identity verification failed" },
			{ status: 400 },
		);
	}

	const { data, error } = await supabase
		.from("users")
		.update({
			first_name: IDVData.user.name?.given_name,
			last_name: IDVData.user.name?.family_name,
			phone_number: IDVData.user.phone_number,
			is_verified: true,
			idv_status: IDVData.status,
			most_recent_idv_session: linkSessionId,
		})
		.eq("id", IDVData.client_user_id);

	if (error) {
		console.error("Error updating user data:", error);
		return NextResponse.json(
			{ error: "Error updating user data" },
			{ status: 500 },
		);
	}
	try {
		await setWelcomeScreen(false);
		await setIdentityVerificationStatus();
		return NextResponse.redirect(new URL("/dashboard", request.url));
	} catch (error) {
		console.error("Error updating user data:", error);
		return NextResponse.json(
			{ error: "Error updating user data" },
			{ status: 500 },
		);
	}
}
