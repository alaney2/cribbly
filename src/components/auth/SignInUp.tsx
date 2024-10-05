"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/catalyst/button";
import logo from "@/images/icon.png";
import { TextField } from "@/components/default/Fields";
import Image from "next/image";
import { GoogleSignIn } from "@/components/auth/GoogleSignIn";
import { SlimLayout } from "@/components/default/SlimLayout";
import styles from "@/styles/InputCenter.module.css";
import { signInWithOtp } from "@/app/auth/action";
import { OtpForm } from "@/components/auth/otp/OtpForm";
import "animate.css";
import clsx from "clsx";
import Link from "next/link";
import { toast } from "sonner";
import { Heading } from "@/components/catalyst/heading";

const formClasses = `
    block text-base w-full mt-6 h-11 appearance-none bg-gray-50 rounded-md 
    border-0.5 border-gray-200 bg-white dark:bg-zinc-800 px-3 py-1.5 text-gray-900 dark:text-white 
    placeholder-gray-400 focus:border-blue-500 focus:outline-none 
    focus:ring-blue-500 sm:text-sm ring-1 focus:ring-2 ring-inset ring-gray-300 
    text-center animate__animated animate__fadeIn animate__fast
    transition-colors duration-300 box-border	`;

export function SignInUp({
	signIn,
	splineLink,
}: { signIn: boolean; splineLink?: string }) {
	const [showEmailInput, setShowEmailInput] = useState(false);
	const [buttonType, setButtonType] = useState<"submit" | "button" | "reset">(
		"button",
	);
	const [fadeOut, setFadeOut] = useState(false);
	const [currentStep, setCurrentStep] = useState(0);
	const [email, setEmail] = useState("");
	const [showInvalidEmail, setShowInvalidEmail] = useState(false);

	useEffect(() => {
		setFadeOut(false);
	}, []);

	const backToSignIn = () => {
		setShowEmailInput(false);
		setFadeOut(false);
		setButtonType("button");
		setEmail("");
		setCurrentStep(0);
		setShowInvalidEmail(false);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	};

	const handleButtonClick = () => {
		setShowEmailInput(true);
		setTimeout(() => {
			setButtonType("submit");
		}, 0);
	};

	const isValidEmail = (email: string) => {
		const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		return emailRegex.test(email.toLowerCase());
	};

	const handleButtonSubmit = () => {
		if (isValidEmail(email)) {
			setFadeOut(true);
			setTimeout(() => {
				setCurrentStep(1);
			}, 400);
		} else {
			setShowInvalidEmail(true);
		}
	};

	const renderStepContent = (stepIndex: number) => {
		switch (stepIndex) {
			case 0:
				return (
					<div
						className={clsx(
							"animate__animated touch-none mb-40",
							fadeOut
								? "animate__fadeOut animate__fastest"
								: "animate__fadeIn animate__fastest",
						)}
					>
						<div className="sm:w-full sm:max-w-md">
							<Link href="/" className="cursor-default">
								<Image
									className="h-16 w-auto mx-auto"
									src={logo}
									alt=""
									priority={false}
								/>
							</Link>
							<Heading className="text-center my-6 text-lg font-semibold text-zinc-600 cursor-default">
								{signIn ? " Sign in to Cribbly" : "Create your account"}
							</Heading>
						</div>

						<div className="sm:mx-auto">
							<div className="mt-6 grid grid-cols-1 gap-4">
								<GoogleSignIn />
							</div>

							<form
								className=""
								action={async (formData) => {
									try {
										await signInWithOtp(formData);
									} catch (error) {
										toast.error("An error occurred, please try again");
										console.error(error);
									}
								}}
							>
								{showEmailInput && (
									<input
										type="email"
										name="email"
										id="email"
										className={`${formClasses} ${styles.inputCenterText} font-semibold`}
										placeholder="Email"
										onChange={handleInputChange}
										required={true}
										autoComplete="off"
										// biome-ignore lint/a11y/noAutofocus: <explanation>
										autoFocus
									/>
								)}
								{showInvalidEmail && (
									<p className="text-red-500 text-xs mt-1 -mb-1 text-center">
										Please enter a valid email address
									</p>
								)}
								<Button
									color="light"
									type={buttonType}
									className="w-full mt-3 h-12 text-zinc-600 cursor-default"
									onClick={
										buttonType === "button"
											? handleButtonClick
											: handleButtonSubmit
									}
								>
									{/* <span className="text-sm leading-6 font-semibold"> */}
									Continue with Email
									{/* </span> */}
								</Button>
							</form>
							{!signIn && (
								<div className="mt-8 px-12 text-center text-xs text-zinc-500">
									<span>
										By signing up, you agree to the{" "}
										<Link
											href="/terms"
											className="hover:underline cursor-default"
										>
											Terms of Service
										</Link>{" "}
										and{" "}
										<Link
											href="/terms"
											className="hover:underline cursor-default"
										>
											Privacy Policy
										</Link>
										.
									</span>
								</div>
							)}
						</div>
					</div>
				);
			case 1:
				return <OtpForm email={email} backToSignIn={backToSignIn} />;
			default:
				return null;
		}
	};

	return (
		<SlimLayout
			splineLink={splineLink}
			heading={signIn ? "Sign in to Cribbly" : undefined}
			subHeading={
				signIn
					? "Sign in to your account through Google or email verification"
					: undefined
			}
		>
			{renderStepContent(currentStep)}
		</SlimLayout>
	);
}
