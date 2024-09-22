import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	const requestUrl = new URL(request.url);

	const data = await request.json();
	const email = data.email;

	console.log("Resending OTP for email:", email);

	if (email) {
		const supabase = createClient();

		const { error } = await supabase.auth.signInWithOtp({
			// type: "signup",
			email: email,
		});

		console.log("Resend OTP response:", data, error);

		if (error) {
			return NextResponse.redirect(
				`${requestUrl.origin}/get-started?error=Could not resend code`,
				{
					status: 301,
				},
			);
		}
		return NextResponse.redirect(
			`${requestUrl.origin}/get-started?success=Code resent`,
			{
				status: 301,
			},
		);
	}
	return NextResponse.redirect(
		`${requestUrl.origin}/get-started?error=Invalid email`,
		{
			status: 301,
		},
	);
}
