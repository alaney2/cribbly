"use client";

import { Button } from "@/components/catalyst/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator"
import { Divider } from "@/components/catalyst/divider";
import { useState, useEffect, useTransition } from "react";
import { Input } from "@/components/catalyst/input";
import {
	Description,
	Field,
	FieldGroup,
	Fieldset,
	Label,
	Legend,
} from "@/components/catalyst/fieldset";
import { toast } from "sonner";
import { sendInviteEmail } from "@/utils/resend/actions";
import { setWelcomeScreen, deleteInvite } from "@/utils/supabase/actions";
import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/catalyst/table";
import { TrashIcon } from "@heroicons/react/24/outline";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Heading } from "@/components/catalyst/heading";
import { Strong, Text, TextLink } from "@/components/catalyst/text";

const fetcher = async (propertyId: string) => {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("property_invites")
		.select("*")
		.eq("property_id", propertyId);
	if (error) {
		throw error;
	}
	return data;
};

type InviteCardProps = {
	propertyId: string;
	setPropertyId?: (propertyId: string) => void;
	finishWelcome?: boolean;
	setFinishWelcome?: (finishWelcome: boolean) => void;
};

export function InviteCard({
	propertyId,
	setPropertyId,
	finishWelcome,
	setFinishWelcome,
}: InviteCardProps) {
	useEffect(() => {
		if (typeof window !== "undefined" && setPropertyId && !propertyId) {
			setPropertyId(localStorage.getItem("propertyId") || "");
		}
	}, [propertyId, setPropertyId]);

	const {
		data: invites,
		error,
		isLoading,
		mutate,
	} = useSWR(
		propertyId ? ["invitesSent", propertyId] : null,
		([_, propertyId]) => fetcher(propertyId),
	);

	useEffect(() => {
		if (invites && invites.length > 0 && setFinishWelcome && !finishWelcome) {
			setFinishWelcome(true);
		}
	}, [finishWelcome, invites, setFinishWelcome]);

	const [fadeOut, setFadeOut] = useState(false);
	const [email, setEmail] = useState("");
	const [fullName, setFullName] = useState("");
	const animationClass = fadeOut ? " animate__fadeOut" : "animate__fadeIn";
	const [buttonEnabled, setButtonEnabled] = useState(true);
	const [isPending, startTransition] = useTransition();

	const handleDeleteInvite = async (token: string) => {
		try {
			await deleteInvite(token);
			mutate();
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<>
			<Card
				className={`w-full animate__animated animate__faster} ${animationClass}`}
			>
				<CardHeader>
					<Heading>Invite tenants</Heading>
					<Text className="">
						Invite a tenant to this property to pay rent online
					</Text>
				</CardHeader>
				<form
					action={(formData) => {
						startTransition(async () => {
							toast.promise(
								(async () => {
									try {
										await sendInviteEmail(formData);
										setEmail("");
										setFullName("");
										mutate();
										return "Email sent!";
									} catch (error) {
										console.error(error);
										throw error;
									}
								})(),
								{
									loading: "Inviting...",
									success: "Tenant has been invited!",
									error:
										"An error occurred, please check the form and try again.",
								},
							);
						});
					}}
				>
					<CardContent>
						<div className="grid w-full items-center gap-4">
							<div className="flex flex-col space-y-1.5">
								<Fieldset>
									<FieldGroup>
										<Field>
											<Label htmlFor="fullName">Name</Label>
											<Input
												id="fullName"
												type="text"
												placeholder="John Doe"
												name="fullName"
												value={fullName}
												onChange={(e) => setFullName(e.target.value)}
												autoComplete="off"
											/>
										</Field>
									</FieldGroup>
								</Fieldset>
							</div>
							<div className="flex flex-col space-y-1.5">
								<Field>
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										type="email"
										placeholder="name@example.com"
										name="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
										autoComplete="off"
									/>
								</Field>
							</div>
						</div>
						<input
							name="propertyId"
							defaultValue={propertyId}
							readOnly
							className="hidden"
						/>
						{isLoading && !invites && (
							<div className="mt-6">
								<Skeleton count={2} />
							</div>
						)}
						{invites && invites.length > 0 && (
							<div className="mt-6">
								<h3 className="text-md font-semibold mb-2">Invites Sent</h3>
								<Table striped>
									<TableHead>
										<TableRow>
											<TableHeader>Name</TableHeader>
											<TableHeader>Email</TableHeader>
											<TableHeader />
										</TableRow>
									</TableHead>
									<TableBody>
										{invites.map((invite) => (
											<TableRow key={invite.token}>
												<TableCell>{invite.full_name || "-"}</TableCell>
												<TableCell>{invite.email}</TableCell>
												<TableCell>
													<button
														type="button"
														onClick={() => {
															handleDeleteInvite(invite.token);
														}}
													>
														<TrashIcon className="size-5 text-red-600 hover:text-red-500" />
													</button>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						)}
					</CardContent>
					<Divider />

					<CardFooter className="flex justify-end">
						<Button type="submit" color="blue" disabled={isPending}>
							{isPending ? "Sending..." : "Send invite"}
						</Button>
					</CardFooter>
				</form>
			</Card>
			{/* <Button disabled={!finishWelcome} className="mt-8" 
      onClick={async () => {
        setFadeOut(true)
        localStorage.removeItem('propertyId')
        localStorage.removeItem('fullName')
        localStorage.removeItem('email')
        await setWelcomeScreen(false)
        router.push('/dashboard')
      }}
    >Finish setup
    </Button> */}
		</>
	);
}
