"use client";
import { IconBolt, IconLock } from "@tabler/icons-react";
import { Button } from "@/components/catalyst/button";
import { motion, AnimatePresence } from "framer-motion";
import { createMoovAccount, createMoovToken } from "@/utils/moov/actions";
import { loadMoov, TermsOfServiceToken, type Drops } from "@moovio/moov-js";
import { useState } from "react";
import { Input } from "@/components/catalyst/input";
import {
	Fieldset,
	Legend,
	FieldGroup,
	Field,
	ErrorMessage,
	Label,
} from "@/components/catalyst/fieldset";
import { Text, Strong, TextLink } from "@/components/catalyst/text";
import * as Headless from "@headlessui/react";
import { Radio } from "@/components/catalyst/radio";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { setWelcomeScreen, updateName } from "@/utils/supabase/actions";
import { toast } from "sonner";
import { FramerSpinner } from "@/components/Spinners/FramerSpinner";
import { Heading, Subheading } from "@/components/catalyst/heading";
import moovSvg from "@/images/moov.svg";

export const VerificationForm = ({
	full_name,
	email,
}: {
	full_name: string | undefined;
	email: string | undefined;
}) => {
	const router = useRouter();
	const [step, setStep] = useState(0);
	const totalSteps = 3; // Total number of steps (0 to 3)
	const [formData, setFormData] = useState({
		tosToken: "",
		address: {
			addressLine1: "",
			addressLine2: "",
			city: "",
			stateOrProvince: "",
			zipCode: "",
			country: "US",
		},
		accountType: "individual",
		birthDate: new Date().toISOString(), // Use ISO date format for simplicity
		email: email,
		governmentID: {
			ssn: "",
			useITIN: false,
			itin: "",
		},
		name: {
			firstName: full_name?.split(" ")[0],
			lastName: full_name?.split(" ")[1],
		},
		phone: {
			number: "",
			countryCode: "1",
		},
	});
	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const [buttonLoading, setButtonLoading] = useState(false);

	const stepVariants = {
		hidden: { opacity: 0, y: -20 },
		visible: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: 20 },
	};

	// Validation functions for each step
	const getValidationErrors = () => {
		const newErrors: { [key: string]: string } = {};
		if (step === 1) {
			// Step 1 validations
			if (!formData.name.firstName?.trim()) {
				newErrors["name.firstName"] = "First name is required";
			}
			if (!formData.name.lastName?.trim()) {
				newErrors["name.lastName"] = "Last name is required";
			}
			if (!formData.email?.trim()) {
				newErrors["email"] = "Email is required";
			} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
				newErrors["email"] = "Email is invalid";
			}
			if (!formData.phone.number.trim()) {
				newErrors["phone.number"] = "Phone number is required";
			} else if (!/^\d{3}-\d{3}-\d{4}$/.test(formData.phone.number)) {
				newErrors["phone.number"] = "Phone number is invalid";
			}
		} else if (step === 2) {
			// Step 2 validations
			if (!formData.birthDate) {
				newErrors["birthDate"] = "Birth date is required";
			} else {
				const birthDate = new Date(formData.birthDate);
				const today = new Date();
				const age = today.getFullYear() - birthDate.getFullYear();
				if (age < 18) {
					newErrors["birthDate"] = "You must be at least 18 years old";
				}
			}
			const govID = formData.governmentID.useITIN
				? formData.governmentID.itin
				: formData.governmentID.ssn;
			if (!govID.trim()) {
				newErrors["governmentID"] = "This field is required";
			} else if (!/^\d{3}-\d{2}-\d{4}$/.test(govID)) {
				newErrors["governmentID"] = "Number is invalid";
			}
		} else if (step === 3) {
			// Step 3 validations
			if (!formData.address.addressLine1.trim()) {
				newErrors["address.addressLine1"] = "Street address is required";
			}
			if (!formData.address.city.trim()) {
				newErrors["address.city"] = "City is required";
			}
			if (!formData.address.stateOrProvince.trim()) {
				newErrors["address.stateOrProvince"] = "State is required";
			}
			if (!formData.address.zipCode.trim()) {
				newErrors["address.zipCode"] = "Zip code is required";
			} else if (!/^\d{5}$/.test(formData.address.zipCode)) {
				newErrors["address.zipCode"] = "Zip code is invalid";
			}
		}
		return newErrors;
	};

	const validateStep = () => {
		const newErrors = getValidationErrors();
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleNext = () => {
		if (validateStep()) {
			setStep(step + 1);
		}
	};

	const handleChange = (e: { target: { name: any; value: any } }) => {
		const { name, value } = e.target;
		const keys = name.split(".");
		setFormData((prevState) => {
			const data = { ...prevState };
			let temp: any = data;
			for (let i = 0; i < keys.length - 1; i++) {
				temp = temp[keys[i]] as any;
			}
			temp[keys[keys.length - 1]] = value;
			return data;
		});

		if (value.trim() === "") {
			setErrors((prevErrors) => ({
				...prevErrors,
				[name]: "This field is required",
			}));
		} else {
			setErrors((prevErrors) => {
				const newErrors = { ...prevErrors };
				delete newErrors[name];
				return newErrors;
			});
		}
	};

	const handleSubmit = async (e: { preventDefault: () => void }) => {
		e.preventDefault();
		const loadingToast = toast.loading("Creating account...");
		try {
			const account = await createMoovAccount(formData);
			const fullName =
				`${formData.name.firstName?.trim()} ${formData.name.lastName?.trim()}`.trim();
			await updateName(fullName);
			await setWelcomeScreen(false);
			toast.dismiss(loadingToast);
			toast.success("Account created successfully");
			router.push("/dashboard");
		} catch (error) {
			console.error("Error creating account:", error);
			toast.dismiss(loadingToast);
			toast.error("Failed to create account. Please try again.");
		}
	};

	const validateSSN = (value: string) => {
		const cleanedValue = value.replace(/\D/g, "");
		const blacklist = ["078051120", "219099999", "457555462"];

		// Check if the length is exactly 9 digits
		if (cleanedValue.length !== 9) {
			return "SSN/ITIN must be exactly 9 digits";
		}

		// Check against the blacklist
		if (blacklist.includes(cleanedValue)) {
			return "Invalid SSN/ITIN";
		}

		// Validate against the SSN pattern
		const ssnRegex = /^(?!666|000|9\d{2})\d{3}(?!00)\d{2}(?!0{4})\d{4}$/;
		if (!ssnRegex.test(cleanedValue)) {
			return "Invalid SSN/ITIN format";
		}

		return "";
	};

	const today = new Date();
	const maxDate = new Date(
		today.getFullYear() - 18,
		today.getMonth(),
		today.getDate(),
	);

	const validateBirthDate = (value: string) => {
		if (!value) {
			return "Birth date is required";
		}

		const selectedDate = new Date(value);
		const today = new Date();

		// Check if the date is valid
		if (Number.isNaN(selectedDate.getTime())) {
			return "Invalid date format";
		}

		// Check if the date is before January 1, 1900
		const minDate = new Date("1900-01-01");
		if (selectedDate < minDate) {
			return "Date cannot be before January 1, 1900";
		}

		// Check if the user is at least 18 years old
		if (selectedDate > maxDate) {
			return "You must be at least 18 years old";
		}

		// All validations passed
		return "";
	};

	const handleProgressBarClick = (clickedStep: number) => {
		if (clickedStep < step) {
			setStep(clickedStep);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col min-h-[550px] w-full max-w-lg mx-auto sm:ring-1 ring-gray-200 rounded-lg sm:p-4"
		>
			<div className="w-full h-1.5 bg-gray-200 dark:bg-zinc-700 sm:rounded-full absolute top-0 left-0 sm:relative sm:mb-4 flex">
				{[0, 1, 2, 3].map((i) => (
					<div
						key={i}
						className={`h-full transition-all duration-300 cursor-default ${
							i > 0 ? "ml-1" : ""
						} ${i < step ? "bg-blue-500" : "bg-gray-200 dark:bg-zinc-700"} 
						${
							i === 0 || i === totalSteps - 1
								? "sm:rounded-full"
								: "sm:rounded-none"
						}`}
						style={{ width: `${100 / (totalSteps + 1)}%` }}
						onClick={() => handleProgressBarClick(i + 1)}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								handleProgressBarClick(i);
							}
						}}
						role="button"
						tabIndex={i < step ? 0 : -1}
					/>
				))}
			</div>
			<div className="grow h-full sm:mt-4">
				<AnimatePresence mode="wait">
					<motion.div
						key={step}
						variants={stepVariants}
						initial="hidden"
						animate="visible"
						exit="exit"
						transition={{ duration: 0.25 }}
						className="grow h-full sm:mt-4"
					>
						{step === 0 && (
							<div className="h-full flex flex-col gap-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									xmlnsXlink="http://www.w3.org/1999/xlink"
									fill="none"
									viewBox="0 0 390 97"
								>
									<defs>
										<path
											id="reuse-0"
											stroke="#3b82f6"
											strokeLinecap="round"
											strokeWidth="0.674"
											d="M.337-.337h18.87"
										/>
									</defs>
									<path
										fill="#22c55e"
										d="M1.685 96.397a.61.61 0 1 0-.168-1.208l.168 1.208Zm6.202-2.289a.61.61 0 1 0 .235 1.197l-.235-1.197Zm3.427.531a.61.61 0 0 0-.262-1.191l.262 1.191Zm6.024-2.72a.61.61 0 1 0 .314 1.178l-.314-1.179Zm3.456.305a.61.61 0 1 0-.339-1.171l.34 1.171Zm5.828-3.112a.61.61 0 1 0 .394 1.155l-.394-1.155Zm3.468.063a.61.61 0 1 0-.424-1.145l.424 1.145Zm5.566-3.558a.61.61 0 1 0 .49 1.117l-.49-1.117Zm3.46-.249a.61.61 0 1 0-.528-1.099l.529 1.1Zm5.156-4.124a.61.61 0 1 0 .62 1.05l-.62-1.05Zm3.401-.692a.61.61 0 1 0-.675-1.016l.675 1.016Zm4.413-4.9a.61.61 0 0 0 .81.913l-.81-.913ZM.072 96.606c.513-.061 1.051-.13 1.613-.209l-.168-1.208c-.554.077-1.084.145-1.589.205l.144 1.212Zm8.05-1.3c1.03-.203 2.096-.425 3.192-.667l-.262-1.191c-1.087.24-2.144.46-3.165.66l.235 1.197Zm9.53-2.209c1.035-.275 2.084-.566 3.142-.873l-.339-1.171c-1.05.304-2.09.592-3.117.865l.314 1.18Zm9.364-2.83c1.025-.35 2.05-.714 3.074-1.092l-.424-1.145c-1.012.375-2.029.736-3.044 1.082l.394 1.155Zm9.13-3.533a94.013 94.013 0 0 0 2.97-1.366l-.528-1.099c-.964.464-1.943.913-2.932 1.348l.49 1.117Zm8.747-4.44a61.689 61.689 0 0 0 2.78-1.742l-.675-1.016c-.88.586-1.79 1.155-2.726 1.707l.62 1.05Zm8.003-5.73c.414-.367.818-.74 1.21-1.12l-.85-.876c-.378.366-.768.728-1.17 1.084l.81.913Z"
									/>
									<path
										stroke="#22c55e"
										strokeDasharray="3.25 6.51"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="1.22"
										d="M115.902 37.056c7.049-4.306 26.434-11.062 47.581-3.633M361.533 16.062c7.32-4.037 20.333-7.67 28.467-5.248M331.846 35.037c5.286-5.248 8.133-7.267 12.607-10.093M243.191 67.18c9.48 4.217 33.488 8.456 53.681-8.323"
									/>
									<path
										stroke="#3b82f6"
										strokeWidth="0.674"
										d="M101.112 16.82c.493 3.916-2.305 7.49-6.255 7.98-3.95.49-7.547-2.292-8.04-6.207-.492-3.916 2.306-7.49 6.256-7.98 3.95-.49 7.547 2.292 8.039 6.208Z"
									/>
									<mask id="a" fill="#3b82f6">
										<path
											fill="white"
											fillRule="evenodd"
											d="M90.482 24.346c-1.7.845-3.208 2.061-4.397 3.58a12.725 12.725 0 0 0-2.474 5.399c-.43 2.19 1.659 3.8 3.876 3.526l8.75-1.085 8.749-1.084c2.217-.275 3.842-2.346 2.883-4.364a12.793 12.793 0 0 0-3.734-4.63 12.91 12.91 0 0 0-5.15-2.396 7.535 7.535 0 0 1-.7.552 12.227 12.227 0 0 1 5.437 2.378 12.103 12.103 0 0 1 3.537 4.384c.365.768.245 1.533-.194 2.16-.449.64-1.235 1.13-2.163 1.246l-8.75 1.084-8.75 1.085c-.928.115-1.811-.168-2.405-.68-.581-.5-.886-1.213-.723-2.045a12.051 12.051 0 0 1 2.342-5.114 12.176 12.176 0 0 1 4.682-3.632 7.577 7.577 0 0 1-.816-.364Z"
											clipRule="evenodd"
										/>
									</mask>
									<path
										fill="#3b82f6"
										d="m86.085 27.925-.531-.416.53.416Zm4.397-3.579.31-.598-.305-.157-.306.152.3.603Zm-6.87 8.979-.662-.131.661.13Zm3.875 3.526-.085-.669.085.669Zm8.75-1.085.084.669-.085-.669Zm11.632-5.448-.609.288.609-.288Zm-3.734-4.63.411-.533-.411.533Zm-5.15-2.396.143-.658-.335-.073-.255.227.448.504Zm-.7.552-.386-.554-1.356.943 1.63.275.112-.664Zm5.437 2.378.412-.533-.412.533Zm3.537 4.384.609-.288-.609.288Zm-.194 2.16.553.387-.553-.387Zm-2.163 1.246.084.669-.084-.67Zm-8.75 1.084.084.67-.084-.67Zm-8.75 1.085-.084-.669.084.669Zm-2.405-.68-.44.51.44-.51Zm-.723-2.045-.662-.131.662.13Zm2.342-5.114-.53-.416.53.416Zm4.682-3.632.273.617 1.511-.666-1.547-.582-.237.63Zm-4.682 3.631a12.168 12.168 0 0 1 4.167-3.391l-.602-1.207a13.514 13.514 0 0 0-4.627 3.766l1.062.832Zm-2.343 5.114a12.052 12.052 0 0 1 2.343-5.114l-1.062-.832a13.399 13.399 0 0 0-2.604 5.685l1.323.261Zm3.13 2.727c-.93.115-1.813-.168-2.407-.68-.581-.5-.887-1.213-.723-2.047l-1.323-.261c-.267 1.357.257 2.545 1.167 3.328.897.773 2.166 1.157 3.454.997l-.169-1.337Zm8.75-1.085-8.75 1.085.168 1.337 8.75-1.084-.169-1.338Zm8.749-1.084-8.75 1.084.168 1.338 8.75-1.085-.168-1.337Zm2.358-3.407c.365.768.246 1.533-.194 2.16-.449.641-1.235 1.132-2.164 1.247l.168 1.337c1.288-.16 2.423-.842 3.101-1.81.688-.98.901-2.26.307-3.51l-1.218.576Zm-3.537-4.385a12.103 12.103 0 0 1 3.537 4.385l1.218-.577a13.465 13.465 0 0 0-3.932-4.874l-.823 1.066Zm-4.88-2.27a12.23 12.23 0 0 1 4.88 2.27l.823-1.066a13.58 13.58 0 0 0-5.418-2.521l-.284 1.317Zm-.305-1.163c-.202.18-.416.347-.639.502l.771 1.107c.267-.185.522-.386.764-.6l-.896-1.01Zm5.596 2.9a12.907 12.907 0 0 0-5.738-2.509l-.223 1.33a11.562 11.562 0 0 1 5.138 2.246l.823-1.066Zm3.734 4.63a12.782 12.782 0 0 0-3.734-4.63l-.823 1.067a11.432 11.432 0 0 1 3.339 4.14l1.218-.577Zm-.25 2.835c.564-.805.729-1.827.25-2.835l-1.218.577c.251.526.177 1.035-.137 1.484l1.105.774Zm-2.632 1.528c1.108-.138 2.068-.724 2.632-1.528l-1.105-.774c-.335.477-.947.871-1.695.964l.168 1.337Zm-8.75 1.084 8.75-1.084-.168-1.338-8.75 1.085.168 1.337Zm-8.75 1.085 8.75-1.085-.168-1.337-8.75 1.084.168 1.338Zm-2.929-.839c.745.642 1.821.976 2.93.839l-.169-1.338c-.748.093-1.439-.14-1.882-.521l-.879 1.02Zm-.945-2.686c-.214 1.094.2 2.044.945 2.686l.88-1.02c-.416-.358-.614-.833-.501-1.404l-1.324-.262Zm2.474-5.4a12.724 12.724 0 0 0-2.474 5.4l1.324.261a11.38 11.38 0 0 1 2.211-4.828l-1.062-.832Zm4.94-3.832a12.847 12.847 0 0 0-4.94 3.833l1.061.832a11.504 11.504 0 0 1 4.424-3.431l-.545-1.234Zm.509-.014a6.898 6.898 0 0 1-.744-.33l-.618 1.195c.287.15.584.282.889.396l.473-1.26Z"
										mask="url(#a)"
									/>
									<path
										stroke="#3b82f6"
										strokeLinecap="round"
										strokeWidth="0.674"
										d="M.337-.337h24.261"
										transform="rotate(-7.066 474.857 -392.59) skewX(.102)"
									/>
									<use
										xlinkHref="#reuse-0"
										strokeLinecap="round"
										strokeWidth="0.674"
										transform="rotate(-7.066 518.206 -395.345) skewX(.102)"
									/>
									<use
										xlinkHref="#reuse-0"
										strokeLinecap="round"
										strokeWidth="0.674"
										transform="rotate(-7.066 431.506 -389.836) skewX(.102)"
									/>
									<path
										stroke="#3b82f6"
										strokeWidth="0.674"
										d="M115.148 20.956c1.429 11.364-6.692 21.731-18.144 23.15-11.453 1.42-21.893-6.646-23.322-18.01-1.43-11.364 6.692-21.73 18.145-23.15 11.452-1.42 21.892 6.646 23.321 18.01Z"
									/>
									<path
										stroke="#3b82f6"
										strokeWidth="0.674"
										d="m114.479 29.131 3.379 26.872a2.69 2.69 0 0 1-2.339 3.006l-65.543 8.125a2.702 2.702 0 0 1-3.012-2.344l-4.922-39.135a2.69 2.69 0 0 1 2.34-3.007L74 18.977"
									/>
									<path
										stroke="#3b82f6"
										strokeLinecap="round"
										strokeWidth="0.674"
										d="m110.545 62.66.289 2.305a2.69 2.69 0 0 1-2.339 3.007l-65.543 8.124a2.702 2.702 0 0 1-3.012-2.343l-4.922-39.136a2.69 2.69 0 0 1 2.34-3.007l1.671-.207 1.003-.124"
									/>
									<path
										stroke="#3b82f6"
										strokeLinecap="round"
										strokeWidth="0.741"
										d="m245.673 23.741.193-2.609a2.27 2.27 0 0 0-2.1-2.431l-76.318-5.543a2.276 2.276 0 0 0-2.434 2.103l-3.674 49.862a2.27 2.27 0 0 0 2.09 2.43l76.291 5.897a2.275 2.275 0 0 0 2.444-2.101l1.187-16.102"
									/>
									<path
										stroke="#3b82f6"
										strokeWidth="0.741"
										d="m219.823 41.022 2.643.196 1.945-1.701a.757.757 0 0 1 1.075.08l1.68 1.969 1.468.109 2.575-2.253a.759.759 0 0 1 1.076.08l2.496 2.927 1.175.087 2.904-2.54a.758.758 0 0 0 .077-1.062l-2.509-2.942-16.19-1.2"
									/>
									<path
										stroke="#3b82f6"
										strokeWidth="0.741"
										d="M220.521 34.794c-1.046-3.236-3.937-5.675-7.497-5.938-4.705-.349-8.797 3.23-9.141 7.995-.345 4.764 3.19 8.908 7.894 9.257 3.672.272 6.972-1.85 8.407-5.06M171.262 18.278a1.465 1.465 0 0 1-1.572 1.346 1.461 1.461 0 0 1-1.359-1.56c.059-.799.761-1.404 1.573-1.345.811.059 1.417.76 1.358 1.559ZM178.819 18.826a1.465 1.465 0 0 1-1.573 1.346 1.461 1.461 0 0 1-1.359-1.558c.059-.8.761-1.405 1.573-1.346.812.059 1.417.759 1.359 1.558ZM186.375 19.375a1.465 1.465 0 0 1-1.573 1.346 1.46 1.46 0 0 1-1.358-1.558c.058-.8.76-1.405 1.572-1.346.812.058 1.418.759 1.359 1.558Z"
									/>
									<path
										stroke="#3b82f6"
										strokeWidth="0.741"
										d="M211.652 37.502a1.465 1.465 0 0 1-1.573 1.346 1.46 1.46 0 0 1-1.358-1.558c.059-.8.76-1.405 1.572-1.346.812.059 1.418.759 1.359 1.558Z"
									/>
									<rect
										width="57.938"
										height="24.83"
										x="0.343"
										y="0.397"
										stroke="#3b82f6"
										strokeWidth="0.741"
										rx="1.902"
										transform="rotate(4.238 -211.938 2620.373) skewX(.105)"
									/>
									<path
										stroke="#3b82f6"
										strokeWidth="0.779"
										d="m327.282 67.32 2.211.74a1.333 1.333 0 0 0 1.649-.744l.577-1.36m2.273-29.382-39.577-16.526a1.334 1.334 0 0 0-1.776.803l-.154.455"
									/>
									<path
										stroke="#3b82f6"
										strokeLinecap="round"
										strokeWidth="0.779"
										d="m320.863 39.928 29.662-7.888a1.383 1.383 0 0 1 1.69.972l5.383 19.675a1.382 1.382 0 0 1-.883 1.672l-2.502.865"
									/>
									<path
										stroke="#3b82f6"
										strokeWidth="0.779"
										d="m325.706 43.54 22.065-5.869a1.338 1.338 0 0 1 1.636.944l5.417 20.068a1.327 1.327 0 0 1-.947 1.63l-33.011 8.637M329.541 48.728l20.929-5.779m1.66 6.18-25.871 7.28"
									/>
									<path
										stroke="#3b82f6"
										strokeWidth="0.779"
										d="m293.972 20.605 35.512 26.03a.938.938 0 0 1 .309 1.123l-10.95 25.843a.948.948 0 0 1-1.432.395l-35.512-26.03a.938.938 0 0 1-.309-1.122L292.54 21a.948.948 0 0 1 1.432-.396Z"
									/>
									<path
										stroke="#3b82f6"
										strokeLinecap="round"
										strokeWidth="0.779"
										d="M353.565 9.375c-.708-1.297-3.994-2.667-6.222-.455-1.107 1.1-1.799 3.552 2.228 4.867 3.103.897 4.886 1.782 4.456 4.424-.462 2.225-4.027 3.994-7.576 0M350.737 5.045v17.802"
									/>
									<path
										stroke="#3b82f6"
										strokeWidth="0.779"
										d="M361.045 13.64c0 6.025-4.921 10.915-10.998 10.915-6.076 0-10.997-4.89-10.997-10.915 0-6.026 4.921-10.915 10.997-10.915 6.077 0 10.998 4.89 10.998 10.915Z"
									/>
									<title>Moov</title>
								</svg>
								<Text className="mt-4">
									We partner with <Strong>Moov</Strong> to collect and verify
									your data for rent payments.{" "}
								</Text>
								<div className="flex flex-col gap-4">
									<div className="flex items-center gap-2">
										<IconBolt className="w-5 h-5" />
										<Text>Verify and connect in seconds.</Text>
									</div>
									<div className="flex items-center gap-2">
										<IconLock className="w-5 h-5" />
										<Text>Your personal data is encrypted and private.</Text>
									</div>{" "}
								</div>
							</div>
						)}

						{step === 1 && (
							<>
								<Fieldset>
									<Legend className="text-lg font-bold mb-4">
										Let's start with the basics.
									</Legend>
									<FieldGroup>
										<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-4">
											<Field>
												<Label>Legal first Name</Label>
												<Input
													id="name.firstName"
													name="name.firstName"
													value={formData.name.firstName}
													onChange={handleChange}
													invalid={!!errors["name.firstName"]}
													onBlur={(e) => {
														const { value } = e.target;
														if (value.trim() === "") {
															setErrors({
																...errors,
																"name.firstName": "First name is required",
															});
														} else {
															const { "name.firstName": _, ...rest } = errors;
															setErrors(rest);
														}
													}}
													required
												/>
											</Field>
											<Field>
												<Label>Last Name</Label>
												<Input
													id="name.lastName"
													name="name.lastName"
													value={formData.name.lastName}
													onChange={handleChange}
													invalid={!!errors["name.lastName"]}
													onBlur={(e) => {
														const { value } = e.target;
														if (value.trim() === "") {
															setErrors({
																...errors,
																"name.lastName": "Last name is required",
															});
														} else {
															const { "name.lastName": _, ...rest } = errors;
															setErrors(rest);
														}
													}}
													required
												/>
											</Field>
										</div>
									</FieldGroup>
									<FieldGroup>
										<Field>
											<Label>Email address</Label>
											<Input
												id="email"
												name="email"
												type="email"
												value={formData.email}
												onChange={handleChange}
												readOnly
												invalid={!!errors.email}
												required
											/>
										</Field>
									</FieldGroup>
									<FieldGroup>
										<Field>
											<Label>Phone Number (US)</Label>
											<Input
												id="phone.number"
												name="phone.number"
												type="tel"
												pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
												value={formData.phone.number}
												onChange={(e) => {
													const { value } = e.target;
													// Remove all non-digit characters
													const cleanedValue = value.replace(/\D/g, "");
													// Format the number
													let formattedValue = "";
													if (cleanedValue.length > 0) {
														formattedValue = cleanedValue.slice(0, 3);
													}
													if (cleanedValue.length >= 4) {
														formattedValue += `-${cleanedValue.slice(3, 6)}`;
													}
													if (cleanedValue.length >= 7) {
														formattedValue += `-${cleanedValue.slice(6, 10)}`;
													}

													setFormData({
														...formData,
														phone: {
															...formData.phone,
															number: formattedValue,
														},
													});
												}}
												onBlur={(e) => {
													const { value } = e.target;
													const cleanedValue = value.replace(/\D/g, "");
													if (cleanedValue.length !== 10) {
														setErrors({
															...errors,
															"phone.number":
																"Phone number must be exactly 10 digits",
														});
													} else {
														const { "phone.number": _, ...rest } = errors;
														setErrors(rest);
													}
												}}
												invalid={!!errors["phone.number"]}
												required
											/>
										</Field>
									</FieldGroup>
								</Fieldset>
							</>
						)}

						{step === 2 && (
							<>
								<Fieldset>
									<Legend className="text-lg font-bold mb-4">
										Now add your personal details.
									</Legend>
									<FieldGroup>
										<Field>
											<Headless.Fieldset className="w-full">
												<Headless.Legend className="text-base/6 font-medium sm:text-sm/6">
													Are you signing up as an individual or a business?
												</Headless.Legend>
												<Headless.RadioGroup
													name="accountType"
													defaultValue={formData.accountType}
													className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-4"
													onChange={(accountType: "individual" | "business") =>
														setFormData({
															...formData,
															accountType,
														})
													}
												>
													<Headless.RadioGroup.Option
														value="individual"
														className={clsx([
															"flex grow justify-between items-center gap-2",
															"ring-1 ring-inset ring-zinc-950/10 hover:ring-zinc-950/20 dark:ring-white/10 dark:hover:ring-white/20 rounded-lg px-4 py-4",
															// "before:absolute before:inset-px before:rounded-[calc(theme(borderRadius.lg)-1px)] before:bg-white before:shadow-none",
															"dark:before:hidden",
															"bg-transparent dark:bg-white/5",
															formData.accountType === "individual" &&
																"ring-2 hover:ring-blue-500 dark:hover:ring-blue-500 ring-blue-500 dark:ring-blue-500",
														])}
													>
														<Headless.Field className="flex grow justify-between items-center gap-x-3">
															<Headless.Label className="select-none text-base/6 sm:text-sm/6 font-medium">
																Individual
															</Headless.Label>
															<Radio
																value="individual"
																color={
																	formData.accountType === "individual"
																		? "blue"
																		: "zinc"
																}
															/>
														</Headless.Field>
													</Headless.RadioGroup.Option>

													<Headless.RadioGroup.Option
														value="business"
														disabled
														className={clsx([
															"flex grow justify-between items-center gap-2",
															"ring-1 ring-inset ring-zinc-950/10 hover:ring-zinc-950/20 dark:ring-white/10 dark:hover:ring-white/20 disabled:hover:ring-zinc-950/10 dark:disabled:hover:ring-white/10 rounded-lg px-4 py-4",
															// "before:absolute before:inset-px before:rounded-[calc(theme(borderRadius.lg)-1px)] before:bg-white before:shadow-none",
															"dark:before:hidden",
															"bg-transparent dark:bg-white/5",
															formData.accountType === "business" &&
																"ring-2 hover:ring-blue-500 dark:hover:ring-blue-500 ring-blue-500 dark:ring-blue-500",
															"opacity-50",
														])}
													>
														<Headless.Field className="flex grow justify-between items-center gap-x-3">
															<Headless.Label className="select-none text-base/6 sm:text-sm/6 font-medium">
																Business
															</Headless.Label>
															<Radio
																value="business"
																color={
																	formData.accountType === "business"
																		? "blue"
																		: "zinc"
																}
															/>
														</Headless.Field>
													</Headless.RadioGroup.Option>
												</Headless.RadioGroup>
											</Headless.Fieldset>
										</Field>
									</FieldGroup>
									<FieldGroup>
										<Field>
											<Label htmlFor="birthDate">Birth Date</Label>
											<Input
												id="birthDate"
												type="date"
												name="birthDate"
												value={formData.birthDate}
												onChange={handleChange}
												min="1900-01-01"
												max={maxDate.toISOString().split("T")[0]}
												invalid={!!errors["birthDate"]}
												onBlur={(e) => {
													const { value } = e.target;
													const error = validateBirthDate(value);
													if (error) {
														setErrors((prevErrors) => ({
															...prevErrors,
															birthDate: error,
														}));
													}
												}}
												required
											/>
										</Field>
									</FieldGroup>
									<FieldGroup>
										<Field>
											<Label className="flex justify-between">
												<span>
													{formData.governmentID.useITIN
														? "Full ITIN"
														: "Full SSN"}
												</span>
												<span
													onClick={() =>
														setFormData({
															...formData,
															governmentID: {
																...formData.governmentID,
																useITIN: !formData.governmentID.useITIN,
															},
														})
													}
													onKeyDown={(e) => {
														if (e.key === "Enter" || e.key === " ") {
															setFormData({
																...formData,
																governmentID: {
																	...formData.governmentID,
																	useITIN: !formData.governmentID.useITIN,
																},
															});
														}
													}}
													role="button"
													tabIndex={0}
												>
													{formData.governmentID.useITIN
														? "Use SSN"
														: "Use ITIN"}
												</span>
											</Label>
											<Input
												id={
													formData.governmentID.useITIN
														? "governmentID.itin"
														: "governmentID.ssn"
												}
												name={
													formData.governmentID.useITIN
														? "governmentID.itin"
														: "governmentID.ssn"
												}
												value={
													formData.governmentID.useITIN
														? formData.governmentID.itin
														: formData.governmentID.ssn
												}
												// pattern="/^(?!666|000|9\d{2})\d{3}[- ]{0,1}(?!00)\d{2}[- ]{0,1}(?!0{4})\d{4}$/"
												inputMode="numeric"
												// onChange={handleChange}
												onChange={(e) => {
													const { value } = e.target;
													// Remove all non-digit characters
													const cleanedValue = value.replace(/\D/g, "");
													// Format the number
													let formattedValue = "";
													if (cleanedValue.length > 0) {
														formattedValue = cleanedValue.slice(0, 3);
													}
													if (cleanedValue.length >= 4) {
														formattedValue += `-${cleanedValue.slice(3, 5)}`;
													}
													if (cleanedValue.length >= 6) {
														formattedValue += `-${cleanedValue.slice(5, 9)}`;
													}
													if (formData.governmentID.useITIN) {
														setFormData({
															...formData,
															governmentID: {
																...formData.governmentID,
																itin: formattedValue,
															},
														});
													} else {
														setFormData({
															...formData,
															governmentID: {
																...formData.governmentID,
																ssn: formattedValue,
															},
														});
													}
												}}
												onBlur={(e) => {
													const { value } = e.target;
													const error = validateSSN(value);
													if (error) {
														setErrors((prevErrors) => ({
															...prevErrors,
															governmentID: error,
														}));
													} else {
														setErrors((prevErrors) => {
															const { governmentID: _, ...rest } = prevErrors;
															return rest;
														});
													}
												}}
												placeholder="000-00-0000"
												invalid={!!errors["governmentID"]}
												required
											/>
										</Field>
									</FieldGroup>
								</Fieldset>
							</>
						)}

						{step === 3 && (
							<>
								<Fieldset>
									<Legend className="text-lg font-bold mb-4">
										Last thing! Add your address.
									</Legend>
									<FieldGroup>
										<Field>
											<Label htmlFor="address.addressLine1">
												Street Address
											</Label>
											<Input
												id="address.addressLine1"
												name="address.addressLine1"
												value={formData.address.addressLine1}
												onChange={handleChange}
												invalid={!!errors["address.addressLine1"]}
												onBlur={(e) => {
													const { value } = e.target;
													if (value.trim() === "") {
														setErrors({
															...errors,
															"address.addressLine1":
																"Street address is required",
														});
													} else {
														const { "address.addressLine1": _, ...rest } =
															errors;
														setErrors(rest);
													}
												}}
												required
											/>
										</Field>
										<Field>
											<Label htmlFor="address.addressLine2">
												Apt, Suite, etc. (optional)
											</Label>
											<Input
												id="address.addressLine2"
												name="address.addressLine2"
												value={formData.address.addressLine2}
												onChange={handleChange}
											/>
										</Field>
									</FieldGroup>
									<FieldGroup>
										<Field>
											<Label htmlFor="address.city">City</Label>
											<Input
												id="address.city"
												name="address.city"
												value={formData.address.city}
												onChange={handleChange}
												invalid={!!errors["address.city"]}
												onBlur={(e) => {
													const { value } = e.target;
													if (value.trim() === "") {
														setErrors({
															...errors,
															"address.city": "City is required",
														});
													} else {
														const { "address.city": _, ...rest } = errors;
														setErrors(rest);
													}
												}}
												required
											/>
										</Field>
										<div className="grid gap-8 grid-cols-2 sm:gap-4">
											<Field>
												<Label htmlFor="address.stateOrProvince">State</Label>
												<Input
													id="address.stateOrProvince"
													name="address.stateOrProvince"
													value={formData.address.stateOrProvince}
													onChange={handleChange}
													invalid={!!errors["address.stateOrProvince"]}
													onBlur={(e) => {
														const { value } = e.target;
														if (value.trim() === "") {
															setErrors({
																...errors,
																"address.stateOrProvince": "State is required",
															});
														} else {
															const { "address.stateOrProvince": _, ...rest } =
																errors;
															setErrors(rest);
														}
													}}
													required
												/>
											</Field>
											<Field>
												<Label htmlFor="address.zipCode">Zip Code</Label>
												<Input
													id="address.zipCode"
													name="address.zipCode"
													maxLength={5}
													pattern="\d{5}"
													inputMode="numeric"
													value={formData.address.zipCode}
													onChange={(e) => {
														const { value } = e.target;
														const cleanedValue = value.replace(/\D/g, "");
														setFormData({
															...formData,
															address: {
																...formData.address,
																zipCode: cleanedValue,
															},
														});
													}}
													invalid={!!errors["address.zipCode"]}
													onBlur={(e) => {
														const { value } = e.target;

														if (value.trim() === "") {
															setErrors({
																...errors,
																"address.zipCode": "Zip code is required",
															});
														} else if (value.length !== 5) {
															setErrors({
																...errors,
																"address.zipCode": "Zip code must be 5 digits",
															});
														} else {
															const { "address.zipCode": _, ...rest } = errors;
															setErrors(rest);
														}
													}}
													required
												/>
											</Field>
										</div>
									</FieldGroup>
								</Fieldset>
							</>
						)}
					</motion.div>
				</AnimatePresence>
			</div>

			{/* Navigation Buttons */}
			<div className="absolute sm:relative bottom-6 sm:bottom-0 left-0 right-0 mx-2 sm:mx-0 sm:flex sm:flex-none sm:pt-4 sm:mt-4">
				{step === 0 && (
					<div className="flex flex-col gap-4">
						<Text className="mx-2 sm:mx-12 text-sm">
							By clicking "Let's Start", you agree to the terms of Moov's{" "}
							<TextLink
								href="https://moov.io/legal/privacy-policy/"
								target="_blank"
							>
								Privacy Policy
							</TextLink>{" "}
							and{" "}
							<TextLink
								href="https://moov.io/legal/platform-agreement/"
								target="_blank"
							>
								Platform Agreement
							</TextLink>
							.
						</Text>
						<Button
							className=""
							color="blue"
							onClick={async () => {
								setButtonLoading(true);
								const token = await createMoovToken();
								if (!token) return;
								const moovjs = await loadMoov(token);
								if (!moovjs) return;
								const tosToken = await moovjs.accounts.getTermsOfServiceToken();
								setFormData({
									...formData,
									tosToken: tosToken.token,
								});
								setStep(1);
								setButtonLoading(false);
							}}
							disabled={buttonLoading}
						>
							{buttonLoading ? <FramerSpinner /> : "Let's Start"}
						</Button>
					</div>
				)}
				{/* {step > 0 && (
					<Button
						type="button"
						onClick={() => setStep(step - 1)}
						plain
						// className="bg-blue-500 text-white px-4 py-1 rounded-md"
					>
						Previous
					</Button>
				)} */}
				{step !== 0 && step < totalSteps && (
					<Button
						type="button"
						color="blue"
						onClick={handleNext}
						className="w-full"
						disabled={Object.keys(getValidationErrors()).length > 0}
					>
						Continue
					</Button>
				)}
				{step === totalSteps && (
					<Button
						type="submit"
						color="blue"
						className="w-full"
						disabled={Object.keys(getValidationErrors()).length > 0}
					>
						Submit
					</Button>
				)}
			</div>
		</form>
	);
};

export function Verification({
	full_name,
	email,
}: { full_name: string; email: string }) {
	const [moovjs, setMoovjs] = useState<any>(null);
	const [moovToken, setMoovToken] = useState<string | null>(null);

	const openOnboardingDrop = async () => {
		try {
			const dropsInstance = await moovjs?.drops();

			dropsInstance.onboarding({
				token: moovToken,
				open: true,
				onResourceCreated: ({
					resourceType,
					resource,
				}: { resourceType: string; resource: any }) => {
					console.log(`Resource created: ${resourceType}`, resource);
				},
				onError: ({ errorType, error }: { errorType: string; error: any }) => {
					console.error(`Error in ${errorType}:`, error);
				},
				onCancel: () => {
					console.log("Onboarding cancelled");
				},
				onSuccess: () => {
					console.log("Onboarding completed successfully");
				},
			});
		} catch (error) {
			console.error("Error loading Moov:", error);
		}
	};

	const openTOSDrop = async () => {
		try {
			const dropsInstance = await moovjs?.drops();
			const token = await moovjs.accounts.getTermsOfServiceToken();
			console.log("Terms of Service token:", token);

			const result = await moovjs.accounts.acceptTermsOfService({
				accountId: process.env.NEXT_PUBLIC_MOOV_ACCOUNT_ID as string,
				termsOfServiceToken: token,
			});

			console.log("Terms of Service accepted:", result);
			dropsInstance.termsOfService({
				token: token,
				textColor: "#000",
				linkColor: "#0000ff",
				backgroundColor: "#fff",
				fontSize: "16px",
				customActionCopy: "I agree to the terms of service",
				onTermsOfServiceReady: (termsOfServiceToken: any) => {
					console.log("Terms of Service ready", termsOfServiceToken);
				},
				onTermsOfServiceError: (error: any) => {
					console.error("Error loading terms of service:", error);
					console.log(error);
				},
			});
		} catch (error) {
			console.error("Error loading Moov:", error);
		}
	};

	return (
		<div className="h-full max-w-lg">
			<div className="max-w-lg mx-auto">
				<VerificationForm full_name={full_name} email={email} />
			</div>

			<Button
				onClick={async () => {
					const token = await createMoovToken();
					console.log(token);
					if (!token) return;
					setMoovToken(token);
					const loadedMoovjs = await loadMoov(token);
					setMoovjs(loadedMoovjs);
					console.log("Moov.js loaded", loadedMoovjs);
				}}
				className="mt-16"
			>
				Create Moov Account
			</Button>
			<Button onClick={() => openOnboardingDrop()} disabled={!moovjs}>
				Open Onboarding
			</Button>
			<Button onClick={openTOSDrop} disabled={!moovjs}>
				Open TOS
			</Button>
		</div>
	);
}
