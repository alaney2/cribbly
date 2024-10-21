"use client";
import { useMediaQuery } from "usehooks-ts";
import { useState, useEffect } from "react";
import { Drawer } from "vaul";
import {
	Dialog,
	DialogActions,
	DialogBody,
	DialogDescription,
	DialogTitle,
} from "@/components/catalyst/dialog";
import { Heading, Subheading } from "@/components/catalyst/heading";
import { Text } from "@/components/catalyst/text";
import { Button } from "@/components/catalyst/button";
import { Input } from "@/components/catalyst/input";
import { Field, Label } from "@/components/catalyst/fieldset";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { deleteProperty } from "@/utils/supabase/actions";
import useSWR, { useSWRConfig } from "swr";
import { useRouter } from "next/navigation";
import { useCurrentProperty } from "@/contexts/CurrentPropertyContext";
import { createClient } from "@/utils/supabase/client";

type DeleteProperyDialogProps = {
	isOpen: boolean;
	onClose: () => void;
	propertyId: string;
};

const fetcher = async (propertyId: string) => {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("properties")
		.select("street_address")
		.eq("id", propertyId)
		.single();

	if (error) throw error;
	return data;
};

export function DeleteProperyDialog({
	isOpen,
	onClose,
	propertyId,
}: DeleteProperyDialogProps) {
	const isMobile = useMediaQuery("(max-width: 640px)");
	const [isMounted, setIsMounted] = useState(false);
	const [deleteInput, setDeleteInput] = useState("");
	const [isDeleting, setIsDeleting] = useState(false);
	const { mutate } = useSWRConfig();
	const router = useRouter();
	const { setCurrentPropertyId } = useCurrentProperty();
	const { data: property, error } = useSWR(propertyId, fetcher);
	const USER_INPUT = property?.street_address;

	const handleDeleteProperty = async (e: { preventDefault: () => void }) => {
		e.preventDefault();
		if (deleteInput !== USER_INPUT) return;
		setIsDeleting(true);
		const toastId = toast.loading("Deleting property...");
		try {
			const newPropertyId = await deleteProperty(propertyId);
			setCurrentPropertyId(newPropertyId);
			// mutate("properties");
			// mutate(["propertyRent", propertyId]);
			// mutate(["tenants", propertyId]);
			// mutate(`documents-${propertyId}`);
			toast.success("Property has been deleted", {
				id: toastId,
				duration: 5000,
			});
			router.push("/dashboard");
		} catch (error) {
			toast.error("Error deleting property", {
				id: toastId,
			});
			console.error(error);
		} finally {
			setIsDeleting(false);
			onClose();
		}
	};

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	if (isMobile) {
		return (
			<Drawer.Root
				open={isOpen}
				onOpenChange={onClose}
				repositionInputs={false}
			>
				<Drawer.Portal>
					<Drawer.Overlay className="fixed inset-0 bg-zinc-950/25 dark:bg-zinc-950/50" />
					<Drawer.Content className="bg-white dark:bg-zinc-900 flex flex-col fixed bottom-0 left-0 right-0 max-h-[82vh] rounded-t-[10px]">
						<div className="max-w-md w-full mx-auto overflow-auto p-4 rounded-t-[10px]">
							<Drawer.Handle />
							<Drawer.Title asChild className="mt-8">
								<Subheading level={1}>Delete Property</Subheading>
							</Drawer.Title>
							<Drawer.Description
								asChild
								className="leading-6 mt-2 text-gray-600"
							>
								<Text>
									This property will be deleted, along with its Settings,
									Tenants, Maintenance tasks, and all other Data. This action is
									not reversible.
								</Text>
							</Drawer.Description>
							<form>
								<DialogBody>
									<div className="">
										<Field className="items-center">
											<Label htmlFor="verifyDelete" className="">
												<span className="">To verify, type </span>
												<span className="font-extrabold dark:text-white">
													{USER_INPUT}
												</span>{" "}
												below:
											</Label>
											<Input
												type="text"
												id="verifyDelete"
												name="verifyDelete"
												className="mt-2"
												pattern={`\\s*${USER_INPUT}\\s*`}
												title={`Validate the input by typing '${USER_INPUT}' exactly as shown.`}
												required={true}
												aria-required="true"
												aria-invalid={deleteInput !== USER_INPUT}
												autoCapitalize="off"
												autoComplete="off"
												autoCorrect="off"
												onChange={(e) => {
													setDeleteInput(e.target.value);
												}}
											/>
										</Field>
									</div>
								</DialogBody>
								<DialogActions>
									<Button type="button" outline onClick={() => onClose()}>
										Cancel
									</Button>
									<Button
										type="submit"
										color="red"
										onClick={handleDeleteProperty}
									>
										Delete
									</Button>
								</DialogActions>
							</form>
						</div>
					</Drawer.Content>
				</Drawer.Portal>
			</Drawer.Root>
		);
	}
	return (
		<>
			<Dialog open={isOpen} onClose={onClose}>
				<DialogTitle>Delete Property</DialogTitle>
				<DialogDescription>
					This property will be deleted, along with its Settings, Tenants,
					Maintenance tasks, and all other Data. This action is not reversible.
				</DialogDescription>
				<form>
					<DialogBody>
						<div className="">
							<Alert
								variant="destructive"
								className="bg-red-300/75 px-3 py-2 mb-4 font-semibold text-sm rounded-lg"
							>
								<AlertTitle>
									<span className="text-red-600">Warning: </span>
									<span className="">
										This action is not reversible. Please be certain.
									</span>
								</AlertTitle>
							</Alert>
							<Field className="items-center">
								<Label htmlFor="verifyDelete" className="">
									<span className="">To verify, type </span>
									<span className="font-extrabold dark:text-white">
										{USER_INPUT}
									</span>{" "}
									below:
								</Label>
								<Input
									type="text"
									id="verifyDelete"
									name="verifyDelete"
									className="mt-2"
									pattern={`\\s*${USER_INPUT}\\s*`}
									title={`Validate the input by typing '${USER_INPUT}' exactly as shown.`}
									required={true}
									aria-required="true"
									aria-invalid={deleteInput !== USER_INPUT}
									autoCapitalize="off"
									autoComplete="off"
									autoCorrect="off"
									onChange={(e) => {
										setDeleteInput(e.target.value);
									}}
								/>
							</Field>
						</div>
					</DialogBody>
					<DialogActions>
						<Button type="button" outline onClick={() => onClose()}>
							Cancel
						</Button>
						<Button type="submit" color="red" onClick={handleDeleteProperty}>
							Delete
						</Button>
					</DialogActions>
				</form>
			</Dialog>
		</>
	);
}
