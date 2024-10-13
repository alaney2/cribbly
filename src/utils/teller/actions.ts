"use server";

import { supabaseAdmin } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

export async function createNewAccount(authorization: any) {
	const supabase = createClient();
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();
	if (!user || userError) {
		console.error("Error fetching user in createNewAccount:", userError);
		return;
	}
	const { data, error } = await supabase.from("teller_accounts").insert([
		{
			access_token: authorization.accessToken,
			user_id: user.id,
			enrollment_id: authorization.enrollment.id,
			teller_user_id: authorization.user.id,
		},
	]);

	if (error) {
		console.error("Error inserting teller account:", error);
		throw error;
	}
	return authorization.accessToken;
}
