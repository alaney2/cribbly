"use client";

import { useState } from "react";
import { Button } from "@/components/catalyst/button";
import { useRouter, usePathname } from "next/navigation";
import type { Tables } from "@/types_db";
import type { User } from "@supabase/supabase-js";
import "animate.css";
import { motion, AnimatePresence } from "framer-motion";
import { CheckIcon } from "@heroicons/react/20/solid";

type Subscription = Tables<"subscriptions">;
type Product = Tables<"products">;
type Price = Tables<"prices">;
interface ProductWithPrices extends Product {
	prices: Price[];
}
interface PriceWithProduct extends Price {
	products: Product | null;
}
interface SubscriptionWithProduct extends Subscription {
	prices: PriceWithProduct | null;
}

interface Props {
	user: User | null | undefined;
	products: ProductWithPrices[];
	subscription: SubscriptionWithProduct | null;
}

const tiers = [
	{
		name: "Standard",
		id: "tier-life",
		href: "",
		price: 79,
		description:
			"Perfect for sole proprietorships and LLCs. Get unlimited access to all features.",
		features: [
			"Add any number of properties",
			"All features included",
			"Lifetime updates",
			"Support for any questions",
		],
	},
	{
		name: "Corporate",
		id: "tier-corporate",
		href: "",
		price: null,
		description: "Tailored solutions for larger businesses with custom needs.",
		features: ["Dedicated account manager", "Priority support"],
		contactUs: true,
	},
];

export function Checkout2({ user, subscription, products }: Props) {
	const [loading, setLoading] = useState(false);

	const router = useRouter();

	const priceLifetime = products.find(
		(product) => product.name?.toLowerCase() === "lifetime",
	)?.prices[0];

	const handleCheckout = async (priceId: string) => {
		setLoading(true);
		try {
			const response = await fetch("/api/create-checkout-session", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ priceId }),
			});

			const data = await response.json();

			if (data.url) {
				// Redirect to the Stripe-hosted checkout page
				window.location.href = data.url;
			} else {
				throw new Error("Failed to create checkout session");
			}
		} catch (error) {
			console.error("Error creating checkout session:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			className={
				"flex flex-col md:py-8 justify-center items-center relative md:h-full w-full"
			}
		>
			<div
				className={
					"isolate overflow-hidden flex flex-col mx-auto align-center justify-center w-full md:w-4/5 2xl:w-2/3 transition-opacity appearance-none animate__animated animate__fadeIn  md:rounded-2xl pb-24 sm:pb-32"
				}
			>
				<div className="mx-auto max-w-7xl px-6 pb-96 pt-8 text-center sm:pt-8 lg:px-8">
					<div className="mx-auto max-w-4xl">
						<p className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
							Choose your plan
						</p>
						<p className="mt-2 text-md font-medium">
							This is a perpetual license with a one-time payment.
						</p>
					</div>
					<div className="relative mt-6">
						<svg
							viewBox="0 0 1208 1024"
							className="absolute -top-10 left-1/2 -z-10 h-[72rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:-top-12 md:-top-20 lg:-top-12 xl:top-0"
						>
							<title>Background</title>
							<ellipse
								cx={604}
								cy={512}
								fill="url(#6d1bd035-0dd1-437e-93fa-59d316231eb0)"
								rx={604}
								ry={512}
							/>
							<defs>
								<radialGradient id="6d1bd035-0dd1-437e-93fa-59d316231eb0">
									<stop stopColor="rgb(29 78 216)" />
									3b82f6
									<stop offset={1} stopColor="#3b82f6" />
								</radialGradient>
							</defs>
						</svg>
					</div>
				</div>
				<div className="-mb-8">
					<div className="-mt-[22rem]">
						<div className="mx-auto max-w-7xl px-6 lg:px-8">
							<div className="mx-auto grid max-w-md grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-2">
								{tiers.map((tier) => (
									<div
										key={tier.id}
										className="flex flex-col relative justify-between w-auto rounded-3xl bg-white dark:bg-black p-8 shadow-xl ring-1 ring-gray-900/10 sm:p-10"
									>
										<AnimatePresence>
											{tier.name === "Subscription" && (
												<motion.span
													initial={{ opacity: 0, y: -20 }}
													animate={{ opacity: 1, y: -15 }}
													exit={{ opacity: 0, y: -20 }}
													transition={{ duration: 0.2 }}
													className="absolute top-0 -translate-y-1/2 transform items-center rounded-full bg-green-200 px-4 py-1 text-md font-semibold text-green-700 ring-1 ring-inset ring-green-600/20"
												>
													Save $60
												</motion.span>
											)}
										</AnimatePresence>

										<div>
											<div className="flex justify-between">
												<h3
													id={tier.id}
													className="text-base font-semibold leading-7 text-blue-500"
												>
													{tier.name}
												</h3>
											</div>
											{!tier.contactUs ? (
												<div className="mt-4 flex flex-col items-start gap-x-2">
													<div className="flex items-baseline">
														<span className="relative text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
															<span className="ml-2 transition-opacity duration-500 opacity-100">
																${tier.price}
															</span>
														</span>
													</div>
													<span className="text-sm text-gray-600 ml-2 dark:text-white">
														One-time purchase
													</span>
												</div>
											) : (
												<div className="mt-4 flex flex-col items-start gap-x-2">
													<div className="flex items-baseline">
														<span className="relative text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
															Custom
														</span>
													</div>
													<span className="text-sm ml-2 text-gray-600 dark:text-white">
														Contact us for pricing
													</span>
												</div>
											)}
											<p className="mt-6 text-base leading-7 text-gray-600 dark:text-gray-100">
												{tier.description}
											</p>
											<ul className="mt-10 space-y-4 text-sm leading-6 text-gray-600 dark:text-gray-100">
												{tier.features.map((feature) => (
													<li key={feature} className="flex gap-x-3">
														<CheckIcon
															className="h-6 w-5 flex-none text-blue-500"
															aria-hidden="true"
														/>
														{feature}
													</li>
												))}
											</ul>
										</div>
										<Button
											color="blue"
											onClick={() =>
												tier.contactUs
													? router.push("mailto:support@cribbly.io")
													: handleCheckout(priceLifetime?.id || "")
											}
											aria-describedby={tier.id}
											className="mt-8 block rounded-md px-3.5 py-2 text-center text-sm font-semibold leading-6 h-10"
											disabled={loading}
										>
											{tier.contactUs ? "Contact Us" : "Select"}
										</Button>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
				<p className="text-center absolute bottom-0 sm:bottom-6 md:bottom-12 lg:bottom-20 left-0 right-0 text-zinc-500 lg:text-white text-sm">
					We partner with Stripe to offer a 30 day money-back guarantee.
				</p>
			</div>
		</div>
	);
}
