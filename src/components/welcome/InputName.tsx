import { useState, useEffect } from "react";
import logo from "@/images/icon.png";
import Image from "next/image";
import styles from "@/styles/InputCenter.module.css";
import { Button } from "@/components/catalyst/button";
import { updateFullName } from "@/utils/supabase/actions";
import { createClient } from "@/utils/supabase/client";
import useSWR from "swr";
import { Heading, Subheading } from "@/components/catalyst/heading";

type InputNameProps = {
	fullName: string;
	setFullName: (fullName: string) => void;
	buttonOnClick: () => void;
};
const formClasses =
	"block text-base w-80 h-10 rounded-md border-1 border-gray-200 dark:border-gray-500 px-3 py-1.5 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm ring-1 ring-inset ring-gray-300 text-center animate__animated animate__fadeIn animate__fast dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700";

const fetcher = async () => {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) throw new Error("Not authenticated");

	const { data, error } = await supabase
		.from("users")
		.select("full_name")
		.eq("id", user.id)
		.single();

	if (error) throw error;
	return data?.full_name || "";
};

export function InputName({
	fullName,
	setFullName,
	buttonOnClick,
}: InputNameProps) {
	const [fadeOut, setFadeOut] = useState(false);
	const { data: initialFullName, error } = useSWR("fullName", fetcher);
	const animationClass = fadeOut
		? "animate__animated animate__fadeOut animate__faster"
		: "";

	const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		const fullNameTrimmed = fullName.trim();
		if (fullNameTrimmed === "") return;
		setFadeOut(true);
		setTimeout(buttonOnClick, 300);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFullName(e.target.value);
	};

	useEffect(() => {
		if (initialFullName) {
			setFullName(initialFullName);
		}
	}, [initialFullName, setFullName]);

	return (
		<>
			<div
				className={`mt-8 w-full flex flex-col items-center justify-center h-full mx-auto ${animationClass}`}
			>
				<Image
					src={logo}
					className="animate__animated animate__fadeIn animate__fast mx-auto w-12 sm:w-16"
					alt="Cribbly logo"
					style={{ animationDelay: "0.1s" }}
				/>
				<Heading
					className="text-xl sm:text-2xl font-semibold text-nowrap mb-4 mt-2 animate__animated animate__fadeIn animate__fast"
					style={{ animationDelay: "0.2s" }}
				>
					How shall we call you?
				</Heading>
				<form action={updateFullName}>
					<label htmlFor="name" className="sr-only">
						Legal name
					</label>
					<input
						type="name"
						name="name"
						id="name"
						className={`${formClasses} ${styles.inputCenterText}`}
						placeholder="Legal name"
						style={{ animationDelay: "0.3s" }}
						required
						onChange={handleInputChange}
						// biome-ignore lint/a11y/noAutofocus: <explanation>
						autoFocus
						defaultValue={fullName}
						autoComplete="off"
					/>
					<Button
						type="submit"
						onClick={handleButtonClick}
						color="blue"
						className="w-80 h-10 text-sm mt-4 mb-12 py-2 px-4 rounded-md animate__animated animate__fadeIn"
						style={{ animationDelay: "0.4s" }}
					>
						Next
					</Button>
				</form>
			</div>
		</>
	);
}
