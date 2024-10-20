"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Strong, Text, TextLink } from "@/components/catalyst/text";
import {
	getTasks,
	getCurrentProperty,
	getNameAndEmail,
	updateCurrentProperty,
} from "@/utils/supabase/actions";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { DashboardWrapper } from "@/components/Dashboard/DashboardWrapper";
import { useCurrentProperty } from "@/contexts/CurrentPropertyContext";

export default async function CurrentProperty() {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return;

	const { data: show_welcome_data } = await supabase
		.from("users")
		.select("welcome_screen")
		.eq("id", user?.id)
		.single();

	const welcome_screen = show_welcome_data?.welcome_screen;

	if (welcome_screen === true) {
		redirect("/welcome");
	}

	return <DashboardWrapper />;
}
