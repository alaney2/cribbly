"use client";
import { useState } from "react";
import { Input } from "@/components/catalyst/input";
import {
	Description,
	Field,
	FieldGroup,
	Fieldset,
	Label,
	Legend,
} from "@/components/catalyst/fieldset";
import { Select } from "@/components/catalyst/select";
import { Text } from "@/components/catalyst/text";
import { Textarea } from "@/components/catalyst/textarea";
import { Button } from "@/components/catalyst/button";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AnimatedBackground } from "@/components/landing/AnimatedBackground";
import icon from "@/images/icon.png";
import Image from "next/image";
import Link from "next/link";

export function WaitList() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [propertyCount, setPropertyCount] = useState("");
	const [reason, setReason] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const supabase = createClient();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const loading = toast.loading("Submitting...");
		setIsSubmitting(true);

		try {
			const { error } = await supabase.from("waitlist").insert([
				{
					email,
					name,
					propertyCount: propertyCount
						? Number.parseInt(propertyCount, 10)
						: null,
					reason,
				},
			]);

			if (error) {
				console.error(error);
				throw error;
			}

			await new Promise((resolve) => setTimeout(resolve, 500));

			toast.dismiss(loading);
			toast.success(
				"Thank you for joining our waitlist! We'll be in touch soon.",
			);
			setName("");
			setEmail("");
			setPropertyCount("");
			setReason("");
		} catch (err) {
			toast.dismiss(loading);
			toast.error("Failed to join waitlist. Please try again.");
			console.error("Error submitting to waitlist:", err);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<AnimatedBackground hideOnSmallScreens={true} darkBackground={true}>
			<div className="w-full h-full mx-auto my-auto max-w-xl px-4 py-8 sm:px-6 lg:px-8">
				<form
					onSubmit={handleSubmit}
					className="rounded-lg sm:ring-2 ring-gray-200 dark:ring-gray-700 sm:p-6 bg-gray-50 dark:bg-zinc-900 text-zinc-950 dark:text-white dark:lg:bg-zinc-950"
				>
					<Link
						href="/"
						aria-label="Cribbly"
						className="flex items-center font-lexend text-lg sm:text-md tracking-tight font-medium select-none w-full mb-4 sm:mb-3"
					>
						<Image
							src={icon}
							alt="logo"
							height={32}
							width={32}
							className="mr-1 sm:hidden"
						/>
						<Image
							src={icon}
							alt="logo"
							height={28}
							width={28}
							className="mr-1 hidden sm:block"
						/>
						<>
							<span className={"text-gray-600"}>Crib</span>
							<span className={"text-blue-500"}>bly</span>
						</>
					</Link>
					<Fieldset>
						<Legend>Join our Waitlist</Legend>
						<Text>
							Fill out this form to join our waitlist and be notified when
							Cribbly launches.
						</Text>
						<FieldGroup>
							<Field>
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</Field>
							<Field>
								<Label htmlFor="name">Name (optional)</Label>
								<Input
									id="name"
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</Field>
							<Field>
								<Label htmlFor="property_count">
									How many properties you are looking to manage (optional)
								</Label>
								<Input
									id="property_count"
									type="number"
									inputMode="numeric"
									value={propertyCount}
									onChange={(e) => setPropertyCount(e.target.value)}
								/>
							</Field>
							<Field>
								<Label htmlFor="reason">
									Any additional comments? (optional)
								</Label>
								<Textarea
									id="reason"
									value={reason}
									onChange={(e) => setReason(e.target.value)}
								/>
							</Field>
						</FieldGroup>
					</Fieldset>
					<Button
						type="submit"
						disabled={isSubmitting}
						color="blue"
						className="mt-8 w-full h-32"
					>
						{isSubmitting ? "Submitting..." : "Join Waitlist"}
					</Button>
				</form>
			</div>
		</AnimatedBackground>
	);
}
