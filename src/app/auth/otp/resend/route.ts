import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	const data = await request.json();
	const email = data.email;

	if (email) {
		const supabase = createClient();

		const { error } = await supabase.auth.signInWithOtp({
			// type: "signup",
			email: email,
		});

		if (error) {
			return NextResponse.json(
				{ error: "Could not resend code" },
				{ status: 400 },
			);
		}
		return NextResponse.json(
			{ message: "Code resent successfully" },
			{ status: 200 },
		);
	}
	return NextResponse.json({ error: "Invalid email" }, { status: 400 });
}
