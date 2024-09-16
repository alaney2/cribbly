"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/catalyst/button";
import { Step0 } from "@/components/welcome/Step0";
import { InputName } from "@/components/welcome/InputName";
import { AutofilledProperty } from "@/components/welcome/AutofilledProperty";
import { Checkout } from "@/components/welcome/Checkout";
import Payment from "@/components/welcome/Payment";
import { Pricing } from "@/components/landing/Pricing";
import { Checkout2 } from "@/components/welcome/Checkout2";
import { SetupProperty } from "@/components/welcome/SetupProperty";
import { InviteCard } from "@/components/PropertySettings/InviteCard";
import { setWelcomeScreen } from "@/utils/supabase/actions";
import { useRouter, useSearchParams } from "next/navigation";
import GoogleMap from "@/components/welcome/GoogleMap";
import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";
import {
	Verification,
	VerificationForm,
} from "@/components/Dashboard/Verification";

export default function WelcomeLayout({
	user,
	subscription,
	products,
	subscriptionActive,
	property,
}: {
	user: any;
	subscription: any;
	products: any;
	subscriptionActive: boolean;
	property: any;
}) {
	const [currentStep, setCurrentStep] = useState(property ? 2 : 0);
	const [propertyId, setPropertyId] = useState(property?.id || "");
	const [fullName, setFullName] = useState("");
	const [finishWelcome, setFinishWelcome] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();
	const [currentProperty, setCurrentProperty] = useState({
		street_address: property?.street_address || "",
		apt: property?.apt || "",
		city: property?.city || "",
		state: property?.state || "",
		zip: property?.zip || "",
		property_rent: property?.property_rents || null,
		property_security_deposit: property?.property_security_deposits || null,
		property_fees: property?.property_fees || [],
	});

	const supabase = createClient();
	const fetcher = async () => {
		const { data, error } = await supabase
			.from("customers")
			.select("*")
			.eq("id", user.id)
			.single();

		if (error) throw error;
		return data;
	};

	const {
		data: customerData,
		error: customerError,
		mutate,
	} = useSWR(user?.id ? `customers-${user.id}` : null, () => fetcher());

	useEffect(() => {
		const redirectStatus = searchParams.get("redirect_status");
		if (redirectStatus === "succeeded") {
			mutate();
			//clear search params
			router.replace("/welcome");
		}
	}, [searchParams, mutate, router]);

	// useEffect(() => {
	// 	if (customerData) {
	// 		setCurrentStep(5);
	// 	}
	// }, [customerData]);

	const steps = [
		{ name: "Step 0" },
		{ name: "Step 1" },
		// { name: "Step 2" },
		// { name: "Step 3" },
		// { name: "Step 4" },
		// { name: "Step 5" },
		// { name: "Step 6" },
	];

	const handleStepClick = (stepIndex: number) => {
		// if (subscriptionActive) {
		// 	setCurrentStep(5);
		// 	return;
		// }
		if (stepIndex < currentStep) {
			setCurrentStep(stepIndex);
		}
	};

	const renderStepContent = (stepIndex: number) => {
		switch (stepIndex) {
			case 0:
				return <Step0 buttonOnClick={() => setCurrentStep(currentStep + 1)} />;
			case 1:
				return (
					<>
						<VerificationForm
							full_name={""}
							email={user.email}
							// buttonOnClick={() => setCurrentStep(currentStep + 1)}
						/>
					</>
				);
			// case 1:
			// 	return (
			// 		<InputName
			// 			fullName={fullName}
			// 			setFullName={setFullName}
			// 			buttonOnClick={() => setCurrentStep(currentStep + 1)}
			// 		/>
			// 	);
			case 2:
				return (
					<div className="mt-4 sm:mt-0">
						<GoogleMap
							currentProperty={currentProperty}
							setCurrentProperty={setCurrentProperty}
							buttonOnClick={() => setCurrentStep(currentStep + 1)}
						/>
					</div>
				);
			case 3:
				return (
					<SetupProperty
						currentProperty={currentProperty}
						setCurrentProperty={setCurrentProperty}
						propertyId={propertyId}
						buttonOnClick={() => setCurrentStep(currentStep + 1)}
					/>
				);
			// case 4:
			// 	return (
			// 		<Checkout2
			// 			user={user}
			// 			subscription={subscription}
			// 			products={products}
			// 		/>
			// 	);
			case 4:
				return (
					<div
						className={
							"relative flex h-full flex-col items-center justify-center gap-y-4 px-2 pt-8 sm:pt-4"
						}
					>
						<InviteCard
							propertyId={propertyId}
							setPropertyId={setPropertyId}
							finishWelcome={finishWelcome}
							setFinishWelcome={setFinishWelcome}
						/>
						<Button
							disabled={!finishWelcome}
							className="mt-4 sm:mt-8"
							color="blue"
							onClick={async () => {
								// setFadeOut(true)
								localStorage.removeItem("propertyId");
								localStorage.removeItem("fullName");
								localStorage.removeItem("email");
								await setWelcomeScreen(false);
								router.push("/dashboard");
							}}
						>
							Finish setup
						</Button>
						<Button
							className="sm:mt-4"
							plain
							onClick={async () => {
								// setFadeOut(true)
								localStorage.removeItem("propertyId");
								localStorage.removeItem("fullName");
								localStorage.removeItem("email");
								await setWelcomeScreen(false);
								router.push("/dashboard");
							}}
						>
							Skip, do later
						</Button>
					</div>
				);

			// case 6:
			// 	return (
			// 		<Checkout
			// 			user={user}
			// 			subscription={subscription}
			// 			products={products}
			// 		/>
			// 	);
			default:
				return <div className="h-full w-full px-32 pb-28 pt-16">Error</div>;
		}
	};

	return (
		<>
			<div className="flex flex-col h-full w-full bg-white dark:bg-zinc-900">
				<div className="flex-grow flex flex-col items-center justify-center p-2">
					{renderStepContent(currentStep)}
				</div>

				{/* Nav dots */}
				{/* <nav
					className="flex items-center justify-center z-0 py-16"
					aria-label="Progress"
				>
					<ol className="flex items-center space-x-5">
						{steps.map((step, index) => (
							<li
								key={step.name}
								onClick={() => handleStepClick(index)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										handleStepClick(index);
									}
								}}
							>
								{index === currentStep ? (
									<span className="block h-2.5 w-2.5 rounded-full bg-blue-600">
										<span className="sr-only">{step.name}</span>
									</span>
								) : (
									<button
										type="button"
										className="block h-2.5 w-2.5 rounded-full bg-zinc-300 transition duration-300 ease-in-out cursor-default"
									>
										<span className="sr-only">{step.name}</span>
									</button>
								)}
							</li>
						))}
					</ol>
				</nav> */}
			</div>
		</>
	);
}
