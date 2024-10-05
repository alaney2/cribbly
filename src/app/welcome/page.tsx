import WelcomeLayout from "@/components/welcome/WelcomeLayout";
import {
	getUser,
	getSubscription,
	getProducts,
} from "@/utils/supabase/actions";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function WelcomePage() {
	const supabase = createClient();
	const user = await getUser();
	if (!user) {
		return;
	}

	const { data: show_welcome_data } = await supabase
		.from("users")
		.select("welcome_screen")
		.eq("id", user?.id)
		.single();

	const welcome_screen = show_welcome_data?.welcome_screen;

	if (!welcome_screen) {
		redirect("/dashboard");
	}

	return <WelcomeLayout user={user} />;
}
