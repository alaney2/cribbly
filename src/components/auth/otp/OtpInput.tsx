"use client";
import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { Button } from "@/components/catalyst/button";
import { Spinner } from "@/components/Spinners/Spinner";
import { verifyOtp } from "@/app/auth/otp/action";
import { toast } from "sonner";
import { NewOtp } from "@/components/auth/otp/NewOtp";

function OtpInputWithParams({ email }: { email: string }) {
	const [isFilled, setIsFilled] = useState(false);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const formRef = useRef<HTMLFormElement>(null);
	const [otpValue, setOtpValue] = useState("");

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
					onComplete={() => {
						setIsFilled(true);
					}}
					isDisabled={isFilled}
					value={otpValue}
					onChange={setOtpValue}
				/>
			</div>
			{/* <Button
				id="submitButton"
				type="submit"
				disabled={isSubmitting}
				color={"blue"}
				className="w-full h-10 mt-2"
				ref={buttonRef}
			>
				{isFilled ? <Spinner /> : "Submit"}
			</Button> */}
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
