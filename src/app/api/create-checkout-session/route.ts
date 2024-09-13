// /app/api/create-checkout-session/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { stripe } from "@/utils/stripe/config";
import { createOrRetrieveCustomer } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
	console.log("create-checkout-session");
	try {
		const { priceId } = await req.json();

		const supabase = createClient();
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser();

		if (!user) {
			if (error) {
				console.error(error);
			}
			throw new Error("Could not get user session.");
		}

		let customer;
		try {
			customer = await createOrRetrieveCustomer({
				uuid: user.id || "",
				email: user.email || "",
			});
		} catch (err) {
			console.error(err);
			throw new Error("Unable to access customer record.");
		}

		const session = await stripe.checkout.sessions.create({
			mode: "payment",
			line_items: [
				{
					price: priceId,
					quantity: 1,
				},
			],
			customer,
			customer_update: {
				address: "auto", // Save the billing address to the customer
			},
			// billing_address_collection: "auto",
			success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/welcome`,
			cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/welcome`,
			allow_promotion_codes: true,
			// automatic_tax: { enabled: true },
		});

		return NextResponse.json({ url: session.url });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 },
		);
	}
}
