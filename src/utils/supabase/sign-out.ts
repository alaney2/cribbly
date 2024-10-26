"use server";
import { createClient } from "@/utils/supabase/server";
import { toast } from "sonner";
import { redirect } from "next/navigation";

export async function signOut() {
	const supabase = createClient();
	const { error } = await supabase.auth.signOut();
	if (error) {
		toast.error("Error signing out user");
	} else {
		redirect("/");
	}
}
