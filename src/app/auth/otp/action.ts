"use server";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function verifyOtp(email: string, otpValue: string) {
	const supabase = createClient();
	const {
		data: { user },
		error,
	} = await supabase.auth.verifyOtp({ email, token: otpValue, type: "email" });

	if (error) {
		throw new Error("Invalid verification code");
	}

	// Handle successful verification
	if (user) {
		if (user.user_metadata.role && user.user_metadata.role === "tenant") {
			redirect("/tenant-dashboard");
		} else {
			const { data: show_welcome } = await supabase
				.from("users")
				.select("welcome_screen")
				.eq("id", user?.id)
				.single();

			const welcome_screen = show_welcome?.welcome_screen;

			if (welcome_screen) {
				redirect("/welcome");
			}

			redirect("/dashboard");
		}
	} else {
		throw new Error("Invalid verification code");
	}
}
