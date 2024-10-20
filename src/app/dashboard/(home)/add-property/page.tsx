"use client";
import GoogleMap from "@/components/welcome/GoogleMap";
import { useState } from "react";
import { Button } from "@/components/catalyst/button";
import { motion, AnimatePresence } from "framer-motion";
import { RentCard } from "@/components/PropertySettings/RentCard";
import { RentCardInDialog } from "@/components/PropertySettings/RentCardInDialog";
import { useCurrentProperty } from "@/contexts/CurrentPropertyContext";
import { InviteCardInDialog } from "@/components/PropertySettings/InviteCardInDialog";
import { BankCardInDialog } from "@/components/PropertySettings/BankCardInDialog";
import { useRouter } from "next/navigation";

export default function AddProperty() {
	const [step, setStep] = useState(0);
	const [lease, setLease] = useState(null);
	const { currentPropertyId } = useCurrentProperty();
	const totalSteps = 4;
	const router = useRouter();

	const stepVariants = {
		hidden: { opacity: 0, y: -20 },
		visible: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: 20 },
	};

	const handleNext = () => {
		if (step < totalSteps - 1) {
			setStep(step + 1);
		}
	};

	const handlePrevious = () => {
		if (step > 0) {
			setStep(step - 1);
		}
	};

	return (
		<div className="flex flex-col w-full max-w-xl mx-auto sm:ring-1 ring-gray-200 rounded-lg sm:p-4">
			<div className="w-full h-1.5 bg-gray-200 dark:bg-zinc-700 sm:rounded-full absolute top-0 left-0 sm:relative sm:mb-4 flex">
				{[...Array(totalSteps)].map((_, i) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						key={i}
						className={`h-full transition-all duration-300 cursor-default ${
							i > 0 ? "ml-1" : ""
						} ${i <= step ? "bg-blue-500" : "bg-gray-200 dark:bg-zinc-700"} 
						${i === 0 || i === totalSteps - 1 ? "sm:rounded-full" : "sm:rounded-none"}`}
						style={{ width: `${100 / totalSteps}%` }}
					/>
				))}
			</div>
			<div className="grow h-full sm:mt-2">
				<AnimatePresence mode="wait">
					<motion.div
						key={step}
						variants={stepVariants}
						initial="hidden"
						animate="visible"
						exit="exit"
						transition={{ duration: 0.25 }}
						className="grow h-full"
					>
						{step === 0 && (
							// <div className="flex justify-center">
							<GoogleMap
								buttonOnClick={() => {
									setStep(step + 1);
								}}
							/>
							// </div>
						)}
						{/* Add more steps here */}
						{step === 1 && (
							<RentCardInDialog
								buttonOnClick={() => {
									setStep(step + 1);
								}}
								propertyId={currentPropertyId}
								setLease={setLease}
							/>
						)}
						{step === 2 && (
							<InviteCardInDialog
								lease={lease}
								// buttonOnClick={() => {
								// 	setStep(step + 1);
								// }}
								propertyId={currentPropertyId}
							/>
						)}
						{step === 3 && <BankCardInDialog />}
					</motion.div>
				</AnimatePresence>
			</div>
			<>
				{/* {step > 0 && (
					<Button type="button" onClick={handlePrevious} plain>
						Previous
					</Button>
				)} */}
				{step === 2 && (
					<Button
						type="button"
						color="blue"
						onClick={handleNext}
						className="w-full mt-4"
					>
						Skip / Continue
					</Button>
				)}
				{step === totalSteps - 1 && (
					<Button
						type="submit"
						color="blue"
						className="w-full mt-2"
						onClick={() => {
							router.push("/dashboard");
						}}
					>
						Done
					</Button>
				)}
			</>
		</div>
	);
}
