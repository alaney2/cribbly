"use client";
import clsx from "clsx";
import { useState } from "react";
import { OtpResend } from "@/components/auth/otp/OtpResend";
import { OtpInput } from "@/components/auth/otp/OtpInput";
import "animate.css";

interface OtpFormProps {
	email: string;
	backToSignIn?: () => void;
}

export function OtpForm({ email, backToSignIn }: OtpFormProps) {
	const [fadeOut, setFadeOut] = useState(false);

	const handleButtonSubmit = () => {
		setFadeOut(true);
		setTimeout(() => {
			backToSignIn?.();
		}, 400);
	};

	return (
		<div
			className={clsx(
				"animate__animated animate__fastest",
				fadeOut ? "animate__fadeOut" : "animate__fadeIn animate__fastest",
			)}
		>
			<div className="text-center text-md text-gray-500 dark:text-gray-400 fond-medium tracking-tight">
				<p>We&apos;ve sent a verification code to your email</p>
				<p className="text-gray-700 dark:text-gray-300">{email}</p>
			</div>
			<div className="flex flex-col">
				<OtpInput email={email} />
				<OtpResend email={email} />
				{backToSignIn && (
					<div className="mt-16 text-center">
						<button
							type="button"
							onClick={handleButtonSubmit}
							className="text-sm tracking-tight font-medium leading-6 text-gray-400 hover:text-gray-500 active:text-gray-600 cursor-pointer"
						>
							Back to sign-in
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
