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
// import { SetupProperty } from "@/components/welcome/SetupProperty";
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
import { IdentityVerification } from "@/components/welcome/IDV";
import { Check, Lock } from "lucide-react";
import { Heading } from "@/components/catalyst/heading";
import icon from "@/images/icon.png";
import Image from "next/image";
import { signOut } from "@/utils/supabase/sign-out";

export default function WelcomeLayout({
	user,
}: {
	user: any;
}) {
	const [currentStep, setCurrentStep] = useState(0);

	const renderStepContent = (stepIndex: number) => {
		switch (stepIndex) {
			case 0:
				return <Step0 buttonOnClick={() => setCurrentStep(currentStep + 1)} />;
			case 1:
				return (
					<>
						{/* <VerificationForm full_name={""} email={user.email} /> */}
						<div className="max-w-lg w-full space-y-6 p-4">
							<div className="flex flex-col mb-8">
								<Lock className="w-12 h-12 text-blue-500 mb-3" />
								<Heading>Verify Your Identity</Heading>
							</div>
							<ul className="space-y-6 mb-36">
								{[
									"Cribbly uses a secure verification platform to confirm your identity",
									"This helps us comply with legal requirements and prevent fraud and money laundering",
									"Your sensitive information is protected and used only for regulatory purposes",
									"Identity verification ensures the safety of your transactions and property data",
								].map((text, index) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									<li key={index} className="flex items-start">
										<Check className="flex-shrink-0 w-5 h-5 text-blue-500 mr-4 mt-1" />
										<span>{text}</span>
									</li>
								))}
							</ul>
							<IdentityVerification />
						</div>
					</>
				);

			default:
				return <div className="h-full w-full px-32 pb-28 pt-16">Error</div>;
		}
	};

	return (
		<>
			<div className="flex flex-col h-full w-full bg-white dark:bg-zinc-900">
				<div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700">
					<div className="flex items-center text-lg font-medium">
						<Image
							src={icon}
							alt="logo"
							height={30}
							width={30}
							className="mr-1"
						/>
						<span className={"text-gray-600 dark:text-gray-500"}>Crib</span>
						<span className={"text-blue-500"}>bly</span>
					</div>
					<Button
						plain
						onClick={async () => {
							await signOut();
						}}
					>
						Sign out
					</Button>
				</div>
				<div className="flex-grow flex flex-col items-center justify-center p-2">
					{renderStepContent(currentStep)}
				</div>
			</div>
		</>
	);
}
