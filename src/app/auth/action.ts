"use server";
import { createClient } from "@/utils/supabase/server";

export async function signInWithOtp(formData: FormData) {
	const supabase = createClient();

	const email = String(formData.get("email"));
	const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

	if (!emailRegex.test(email.toLowerCase())) {
		throw new Error("Invalid email");
	}

	const { data: supabaseData, error } = await supabase.auth.signInWithOtp({
		email: email,
	});

	if (error) {
		throw new Error("Error sending OTP");
	}
}
