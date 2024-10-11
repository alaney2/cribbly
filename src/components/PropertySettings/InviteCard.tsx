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
import {
	deleteInvite,
	getTenants,
	getPreviousTenants,
} from "@/utils/supabase/actions";
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
import { Heading, Subheading } from "@/components/catalyst/heading";
import { Strong, Text, TextLink } from "@/components/catalyst/text";
import { Select } from "@/components/catalyst/select";

interface Tenant {
	user_id: string;
	users:
		| {
				email: string;
				full_name: string | null;
		  }
		| {
				email: string;
				full_name: string | null;
		  }[];
}

const previousTenantsFetcher = async (
	propertyId: string,
	leaseId: string,
): Promise<Tenant[]> => {
	const data = await getPreviousTenants(propertyId, leaseId);
	return data;
};

const tenantsFetcher = async (leaseId: string): Promise<Tenant[]> => {
	const data = await getTenants(leaseId);
	return data;
};

const fetcher = async (leaseId: string) => {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("property_invites")
		.select("*")
		.eq("lease_id", leaseId);
	if (error) {
		throw error;
	}
	return data;
};

type InviteCardProps = {
	lease: any;
	propertyId: string;
	setPropertyId?: (propertyId: string) => void;
	finishWelcome?: boolean;
	setFinishWelcome?: (finishWelcome: boolean) => void;
};

export function InviteCard({
	lease,
	propertyId,
	setPropertyId,
	finishWelcome,
	setFinishWelcome,
}: InviteCardProps) {
	const { data: invites, error, mutate } = useSWR(lease.id, fetcher);
	const { data: tenants, error: tenantsError } = useSWR<Tenant[]>(
		"tenants",
		() => tenantsFetcher(lease.id),
	);
	const { data: previousTenants, error: previousTenantsError } = useSWR<
		Tenant[]
	>(["previousTenants", propertyId, lease.id], () =>
		previousTenantsFetcher(propertyId, lease.id),
	);

	const filteredPreviousTenants = previousTenants?.filter((tenant) => {
		const tenantEmail = Array.isArray(tenant.users)
			? tenant.users[0].email
			: tenant.users.email;
		return !invites?.some((invite) => invite.email === tenantEmail);
	});

	console.log("prev", previousTenants);

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
	const [selectedPreviousTenant, setSelectedPreviousTenant] =
		useState<string>("");

	const isFormValid = () => {
		return email.trim() !== "" && fullName.trim() !== "";
	};

	const handleDeleteInvite = async (token: string) => {
		const loading = toast.loading("Deleting invite...");
		try {
			await deleteInvite(token);
			toast.dismiss(loading);
			toast.success("Invite deleted");
			mutate();
		} catch (error) {
			toast.dismiss(loading);
			toast.error("Failed to delete invite");
			console.error(error);
		}
	};

	const handleInvitePreviousTenant = async () => {
		if (!selectedPreviousTenant) return;

		const tenant = previousTenants?.find(
			(t) => t.user_id === selectedPreviousTenant,
		);
		if (!tenant) return;

		const formData = new FormData();
		const user = Array.isArray(tenant.users) ? tenant.users[0] : tenant.users;
		formData.append("fullName", user.full_name || "");
		formData.append("email", user.email);
		formData.append("leaseId", lease.id);
		formData.append("propertyId", propertyId);

		startTransition(async () => {
			toast.promise(
				(async () => {
					try {
						await sendInviteEmail(formData);
						setSelectedPreviousTenant("");
						return "Email sent!";
					} catch (error) {
						console.error(error);
						throw error;
					} finally {
						mutate();
					}
				})(),
				{
					loading: "Inviting previous tenant...",
					success: "Previous tenant has been invited!",
					error: "An error occurred, please try again.",
				},
			);
		});
	};

	return (
		<>
			<Card className={`w-full animate__faster} ${animationClass}`}>
				<CardHeader>
					<Heading>Invite tenants</Heading>
					<Text className="">
						Invite a tenant to this lease to pay rent online.
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
										return "Email sent!";
									} catch (error) {
										console.error(error);
										throw error;
									} finally {
										mutate();
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
							<div className="flex flex-col space-y-1.5">
								<Fieldset>
									<FieldGroup>
										<Field>
											<Label htmlFor="fullName">Name</Label>
											<Input
												id="fullName"
												type="text"
												placeholder="Full Name"
												name="fullName"
												value={fullName}
												onChange={(e) => setFullName(e.target.value)}
												required
												autoComplete="off"
											/>
										</Field>
									</FieldGroup>
								</Fieldset>
							</div>
						</div>
						<input
							name="leaseId"
							defaultValue={lease.id}
							readOnly
							className="hidden"
						/>
						<input
							name="propertyId"
							defaultValue={propertyId}
							readOnly
							className="hidden"
						/>
						<div className="mt-6 flex justify-end">
							<Button
								type="submit"
								color="blue"
								disabled={isPending || !isFormValid()}
							>
								{isPending ? "Sending..." : "Invite"}
							</Button>
						</div>

						<div className="my-2 flex items-center">
							<Divider className="flex-grow" />
							<span className="mx-4 text-md text-zinc-600 dark:text-zinc-300">
								or
							</span>
							<Divider className="flex-grow" />
						</div>

						<div className="flex items-end gap-4">
							<Field className="flex-grow">
								<Label htmlFor="previousTenant">Invite Previous Tenant</Label>
								<Select
									id="previousTenant"
									value={selectedPreviousTenant}
									onChange={(e) => setSelectedPreviousTenant(e.target.value)}
									disabled={!previousTenants || previousTenants.length === 0}
								>
									<option value="">Select tenant</option>
									{filteredPreviousTenants?.map((tenant) => {
										const user = Array.isArray(tenant.users)
											? tenant.users[0]
											: tenant.users;

										return (
											<option key={tenant.user_id} value={tenant.user_id}>
												{`${user.full_name} — ${user.email}`}
											</option>
										);
									})}
								</Select>
							</Field>
							<Button
								type="button"
								color="blue"
								disabled={!selectedPreviousTenant || isPending}
								onClick={handleInvitePreviousTenant}
							>
								Invite
							</Button>
						</div>

						<Divider strong className="mt-12 mb-8" />

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
												<TableCell className="text-right">
													<button
														type="button"
														onClick={() => {
															handleDeleteInvite(invite.token);
														}}
														className="cursor-default hover:bg-red-500/30 p-1.5 rounded-sm"
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
						{tenants && tenants.length > 0 && (
							<div className="mt-6">
								<Subheading className="text-md font-semibold mb-2">
									Current Tenants
								</Subheading>
								<Table striped>
									<TableHead>
										<TableRow>
											<TableHeader>Name</TableHeader>
											<TableHeader>Email</TableHeader>
										</TableRow>
									</TableHead>
									<TableBody>
										{tenants.map((tenant) => {
											const user = Array.isArray(tenant.users)
												? tenant.users[0]
												: tenant.users;

											return (
												<TableRow key={tenant.user_id}>
													<TableCell>{user?.full_name || "-"}</TableCell>
													<TableCell>{user?.email}</TableCell>
												</TableRow>
											);
										})}
									</TableBody>
								</Table>
							</div>
						)}
					</CardContent>
					<Divider />

					{/* <CardFooter className="flex justify-end">
						<Button
							type="submit"
							color="blue"
							disabled={isPending || !isFormValid()}
						>
							{isPending ? "Sending..." : "Send invite"}
						</Button>
					</CardFooter> */}
				</form>
			</Card>
		</>
	);
}
