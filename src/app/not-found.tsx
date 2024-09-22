import Link from "next/link";
import { Heading, Subheading } from "@/components/catalyst/heading";
import { Text } from "@/components/catalyst/text";
import { Button } from "@/components/catalyst/button";
import { Logo } from "@/components/Logo";
import { SlimLayout } from "@/components/default/SlimLayout";

export default function NotFound() {
	return (
		<SlimLayout heading="Page not found" subHeading="">
			<div className="flex">
				<Link
					href={{ pathname: "/" }}
					aria-label="Home"
					className="cursor-default"
				>
					<Logo className="h-10 w-auto" />
				</Link>
			</div>
			<Text className="mt-20 text-sm font-medium text-gray-700">404</Text>
			<Heading className="mt-3 text-lg font-semibold text-gray-900">
				Page not found
			</Heading>
			<Text className="mt-3 text-sm text-gray-700">
				Sorry, we couldn’t find the page you’re looking for.
			</Text>
			<Button
				href="/dashboard"
				className="mt-10 cursor-default hover:text-gray-200"
				color="blue"
			>
				Go back home
			</Button>
		</SlimLayout>
	);
}
