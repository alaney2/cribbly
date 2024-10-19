"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
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
import { debounce } from "lodash";

const formClasses = `
    block w-full mt-6 h-11 appearance-none rounded-lg px-3 py-2
    text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 dark:text-white
    border border-zinc-950/10 hover:border-zinc-950/20 dark:border-white/10 dark:hover:border-white/20
    bg-white dark:bg-white/5
    focus:outline-none focus:ring-2 focus:ring-blue-500
    relative
    before:absolute before:inset-px before:rounded-[calc(theme(borderRadius.lg)-1px)] before:bg-white before:shadow
    dark:before:hidden
    after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-inset after:ring-transparent
    data-[invalid]:border-red-500 data-[invalid]:hover:border-red-500 data-[invalid]:dark:border-red-500 data-[invalid]:hover:dark:border-red-500
    data-[disabled]:border-zinc-950/20 dark:hover:data-[disabled]:border-white/15 data-[disabled]:dark:border-white/15 data-[disabled]:dark:bg-white/[2.5%]
    dark:[color-scheme:dark]
    text-center animate__animated animate__fadeIn animate__fast
    transition-colors duration-300 box-border
`;

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
	const [isButtonDisabled, setIsButtonDisabled] = useState(false);

	const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsButtonDisabled(true);
		const formData = new FormData(event.currentTarget);

		const loading = toast.loading("Sending...");
		try {
			if (isValidEmail(email)) {
				await signInWithOtp(formData);
				setFadeOut(true);
				setTimeout(() => {
					setCurrentStep(1);
				}, 0);
				toast.dismiss(loading);
				toast.success("OTP sent successfully");
			} else {
				setShowInvalidEmail(true);
				setIsButtonDisabled(false);
			}
		} catch (error) {
			setIsButtonDisabled(false);
			toast.error("An error occurred, please try again");
			console.error(error);
		}
	};

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
		setIsButtonDisabled(false);
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
								// action={handleFormSubmit}
								onSubmit={handleFormSubmit}
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
										autoComplete="email"
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
										buttonType === "button" ? handleButtonClick : undefined
									}
									disabled={isButtonDisabled}
								>
									Continue with Email
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
