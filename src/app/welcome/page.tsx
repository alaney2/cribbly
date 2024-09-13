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

	const { data: subscriptionData, error: subscriptionError } = await supabase
		.from("subscriptions")
		.select("*")
		.eq("user_id", user.id)
		.single();

	const { data: propertyData, error: propertyError } = await supabase
		.from("properties")
		.select(
			"*, property_rents(*), property_fees(*), property_security_deposits(*)",
		)
		.eq("user_id", user.id)
		.order("created_at", { ascending: false });

	console.log(subscriptionData);

	return (
		<WelcomeLayout
			user={user}
			subscription={subscription}
			products={products}
			subscriptionActive={
				subscriptionData?.status === "active" && !subscriptionError
			}
			property={propertyData?.[0]}
		/>
	);
}
