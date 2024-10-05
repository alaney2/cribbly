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
						<VerificationForm full_name={""} email={user.email} />
					</>
				);

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
			</div>
		</>
	);
}
