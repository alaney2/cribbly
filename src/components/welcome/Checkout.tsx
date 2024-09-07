"use client";

import { useState } from "react";
import { CheckIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { Button } from "@/components/catalyst/button";
import { Switch, SwitchField } from "@/components/catalyst/switch";
import { Field as HeadlessField } from "@headlessui/react";
import { Label } from "@/components/catalyst/fieldset";
import Link from "next/link";
import { getStripe } from "@/utils/stripe/client";
import { checkoutWithStripe } from "@/utils/stripe/server";
import { useRouter, usePathname } from "next/navigation";
import type { Tables } from "@/types_db";
import { User } from "@supabase/supabase-js";
import "animate.css";
import { motion, AnimatePresence } from "framer-motion";
import { Spinner } from "@/components/Spinners/Spinner";

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

type BillingInterval = "lifetime" | "year" | "month";

const tiers = [
	{
		name: "Subscription",
		id: "tier-sub",
		href: "",
		priceMonthly: 20,
		priceYearly: 15,
		description:
			"Modi dolorem expedita deleniti. Corporis iste qui inventore pariatur adipisci vitae.",
		features: [
			"Tiered pricing",
			"Ability to switch between monthly and yearly plans",
			"48-hour support response time",
		],
	},
	{
		name: "Lifetime",
		id: "tier-life",
		href: "",
		price: 450,
		description:
			"Explicabo quo fugit vel facere ullam corrupti non dolores. Expedita eius sit sequi.",
		features: ["Unlimited updates", "Same features"],
	},
];

export function Checkout({ user, subscription, products }: Props) {
	const router = useRouter();
	const currentPath = usePathname();

	const [yearly, setYearly] = useState(true);
	const [subSelected, setSubSelected] = useState(false);
	const [lifetimeSelected, setLifetimeSelected] = useState(false);

	const [billingInterval, setBillingInterval] =
		useState<BillingInterval>("year");

	const handleStripeCheckout = async (price: Price) => {
		if (!user) {
			return router.push("/sign-in");
		}

		const { errorRedirect, sessionId } = await checkoutWithStripe(
			price,
			currentPath,
		);

		if (errorRedirect) {
			return router.push(errorRedirect);
		}

		if (!sessionId) {
			return;
			// return router.push(
			//   getErrorRedirect(
		}

		const stripe = await getStripe();
		stripe?.redirectToCheckout({ sessionId });
	};
	const subscriptionProduct = products.find(
		(product) => product.name?.toLowerCase() === "subscription",
	);
	const lifetimeProduct = products.find(
		(product) => product.name?.toLowerCase() === "lifetime",
	);
	const product = products[0];
	const priceMonthly =
		subscriptionProduct?.prices[0].interval === "month"
			? product.prices[0]
			: product.prices[1];
	const priceYearly =
		subscriptionProduct?.prices[0].interval === "year"
			? product.prices[0]
			: product.prices[1];
	const priceLifetime = lifetimeProduct!.prices[0];

	const handleButtonClick = (tier: any) => {
		if (user) {
			if (tier.name === "Subscription") {
				setSubSelected(true);
				if (yearly) {
					handleStripeCheckout(priceYearly);
				} else {
					handleStripeCheckout(priceMonthly);
				}
			} else {
				setLifetimeSelected(true);
				handleStripeCheckout(priceLifetime);
			}
		} else {
			router.push("/sign-in");
		}
	};

	return (
		<div
			className={`flex flex-col lg:mt-8 md:py-8 justify-center items-center relative md:h-full w-full`}
		>
			<div
				className={`isolate overflow-hidden flex flex-col items-center mx-auto align-center justify-center w-full md:w-4/5 2xl:w-2/3 transition-opacity appearance-none animate__animated animate__fadeIn bg-gray-50 md:rounded-2xl pb-24 sm:pb-32`}
			>
				<div className="mx-auto max-w-7xl px-6 pb-96 pt-24 text-center sm:pt-24 lg:px-8">
					<div className="mx-auto max-w-4xl">
						<p className="mt-2 text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-black">
							Choose the right plan for you
						</p>
					</div>
					<div className="relative mt-6">
						<p className="mx-auto max-w-2xl text-lg leading-8 text-black/60">
							30 day money-back guarantee. No questions asked.
						</p>
						<svg
							viewBox="0 0 1208 1024"
							className="absolute -top-10 left-1/2 -z-10 h-[72rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:-top-12 md:-top-20 lg:-top-12 xl:top-0"
						>
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
				<div className=" ">
					<div className="-mt-80">
						<div className="mx-auto max-w-7xl px-6 lg:px-8">
							<div className="mx-auto grid max-w-md grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-2">
								{tiers.map((tier) => (
									<div
										key={tier.id}
										className="flex flex-col relative justify-between w-auto rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-900/10 sm:p-10"
									>
										<AnimatePresence>
											{yearly === true && tier.name === "Subscription" && (
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
												{tier.name === "Subscription" && (
													<SwitchField className="">
														<Label className="-mr-4">Annual billing</Label>
														<Switch
															color="blue"
															name="subscription_interval"
															defaultChecked
															onChange={setYearly}
														/>
													</SwitchField>
												)}
											</div>
											{tier.name === "Subscription" ? (
												<>
													<div className="mt-4 flex flex-col items-start gap-x-2">
														<div className="flex items-baseline">
															<span className="relative text-5xl font-bold tracking-tight text-gray-900">
																<span
																	className={`ml-2 transition-opacity duration-500 ${yearly ? "opacity-100" : "opacity-100"}`}
																>
																	$
																	{yearly
																		? tier.priceYearly
																		: tier.priceMonthly}
																</span>
															</span>
															<span className="text-base font-semibold leading-7 text-gray-600">
																/ month / property
															</span>
														</div>
														<span className="text-sm text-gray-600 ml-2">
															$
															{yearly
																? tier!.priceYearly! * 12
																: tier.priceMonthly}{" "}
															billed {yearly ? "annually" : "monthly"}
														</span>
													</div>
												</>
											) : (
												<>
													<div className="mt-4 flex flex-col items-start gap-x-2">
														<div className="flex items-baseline">
															<span className="relative text-5xl font-bold tracking-tight text-gray-900">
																<span
																	className={`ml-2 transition-opacity duration-500 ${yearly ? "opacity-100" : "opacity-100"}`}
																>
																	${tier.price}
																</span>
															</span>
															<span className="text-base font-semibold leading-7 text-gray-600">
																/ property
															</span>
														</div>
														<span className="text-sm text-gray-600 ml-2">
															One-time purchase
														</span>
													</div>
												</>
											)}
											<p className="mt-6 text-base leading-7 text-gray-600">
												{tier.description}
											</p>
											<ul
												role="list"
												className="mt-10 space-y-4 text-sm leading-6 text-gray-600"
											>
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
											onClick={() => handleButtonClick(tier)}
											aria-describedby={tier.id}
											className="mt-8 block rounded-md px-3.5 py-2 text-center text-sm font-semibold leading-6 text-white h-10"
										>
											{(tier.name === "Subscription" && subSelected) ||
											(tier.name === "Lifetime" && lifetimeSelected) ? (
												<Spinner />
											) : (
												"Select"
											)}
										</Button>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
