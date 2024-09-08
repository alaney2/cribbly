import WelcomeLayout from "@/components/welcome/WelcomeLayout";
import {
	getUser,
	getSubscription,
	getProducts,
} from "@/utils/supabase/actions";
import { createClient } from "@/utils/supabase/server";

export default async function WelcomePage() {
	const supabase = createClient();
	const user = await getUser();
	if (!user) {
		return;
	}
	const { subscription, error } = await getSubscription();
	if (error) {
		console.log(error);
	}
	const products = await getProducts();

	const { data: customerData, error: customerError } = await supabase
		.from("customers")
		.select("*")
		.eq("id", user.id)
		.single();

	return (
		<WelcomeLayout
			user={user}
			subscription={subscription}
			products={products}
			customer={customerData}
		/>
	);
}
