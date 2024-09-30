"use client";
import { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { Text } from "@/components/catalyst/text";
import { toast } from "sonner";

export function OtpResend({ email }: { email: string }) {
	const [cooldownTime, setCooldownTime] = useState(60);

	useEffect(() => {
		if (cooldownTime > 0) {
			const interval = setInterval(() => {
				setCooldownTime((prevTime) => prevTime - 1);
			}, 1000);

			return () => clearInterval(interval);
		}
	}, [cooldownTime]);

	const handleResendOtp = async () => {
		setTimeout(() => setCooldownTime(30), 500);
		const loading = toast.loading("Sending...");
		try {
			const response = await fetch("/auth/otp/resend", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
			});
			if (response.ok) {
				toast.dismiss(loading);
				toast.success("Email sent");
				setCooldownTime(30);
			} else {
				setCooldownTime(0);
				toast.dismiss(loading);
				throw new Error("Failed to resend OTP");
			}
		} catch (error) {
			console.error("Error resending OTP:", error);
			toast.dismiss(loading);
			toast.error("Failed to resend OTP");
			setCooldownTime(0);
		}
	};

	return (
		<div className="text-center mt-6 text-sm tracking-tight text-gray-400 font-medium">
			<p>
				Didn&apos;t receive code?{" "}
				<button
					type="button"
					className={clsx(
						"font-semibold cursor-default",
						cooldownTime > 0
							? "text-blue-300"
							: "text-blue-500 active:text-gray-500 hover:text-blue-400",
					)}
					onClick={handleResendOtp}
					disabled={cooldownTime > 0}
				>
					{cooldownTime > 0 ? `Resend (${cooldownTime}s)` : "Resend"}
				</button>
			</p>
		</div>
	);
}
