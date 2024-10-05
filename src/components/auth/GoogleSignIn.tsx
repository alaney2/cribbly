"use client";
import { signInGoogle } from "@/app/auth/sign-in/google/action";
import { Google } from "@/components/auth/Google";
import { Button } from "@/components/catalyst/button";

export function GoogleSignIn() {
	return (
		<Button
			type="button"
			onClick={async () => {
				await signInGoogle();
			}}
			color="blue"
			className="w-full h-12 cursor-default"
		>
			<Google />
		</Button>
	);
}
