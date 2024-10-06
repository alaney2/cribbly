"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { Spinner } from "@/components/Spinners/Spinner";
import { verifyOtp } from "@/app/auth/otp/action";
import { toast } from "sonner";
import { NewOtp } from "@/components/auth/otp/NewOtp";

function OtpInputWithParams({ email }: { email: string }) {
	const [isFilled, setIsFilled] = useState(false);
	const formRef = useRef<HTMLFormElement>(null);
	const [otpValue, setOtpValue] = useState("");
	const [otpKey, setOtpKey] = useState(0);

	const handleSubmit = async () => {
		const loading = toast.loading("Verifying OTP...");
		try {
			await verifyOtp(email, otpValue);
			toast.dismiss(loading);
			toast.success("OTP verified successfully!");
		} catch (error) {
			toast.dismiss(loading);
			toast.error("An error occurred, please try again.");
			setIsFilled(false);
			setOtpValue("");
			setOtpKey((prevKey) => prevKey + 1);
		}
	};

	useEffect(() => {
		if (isFilled) {
			formRef.current?.requestSubmit();
		}
	}, [isFilled]);

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				handleSubmit();
			}}
			autoComplete="one-time-code"
			ref={formRef}
		>
			<div className="flex justify-center space-x-2 mt-10 mb-4">
				<NewOtp
					key={otpKey}
					onComplete={() => {
						setIsFilled(true);
					}}
					isDisabled={isFilled}
					value={otpValue}
					onChange={setOtpValue}
				/>
			</div>
		</form>
	);
}

export function OtpInput({ email }: { email: string }) {
	return (
		<Suspense fallback={<Spinner />}>
			<OtpInputWithParams email={email} />
		</Suspense>
	);
}
