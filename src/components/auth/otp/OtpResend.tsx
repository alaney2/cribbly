"use client";
import { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { Text } from "@/components/catalyst/text";

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
		console.log("Resending OTP", email);
		try {
			const response = await fetch("/auth/otp/resend", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
			});
			if (response.ok) {
				setCooldownTime(30);
			} else {
				throw new Error("Failed to resend OTP");
			}
		} catch (error) {
			console.error("Error resending OTP:", error);
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
