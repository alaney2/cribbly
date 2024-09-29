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
import { Input } from "@/components/catalyst/input";
import { Field, Label } from "@/components/catalyst/fieldset";
import { Heading, Subheading } from "@/components/catalyst/heading";
import { Text } from "@/components/catalyst/text";
import {
	Field as HeadlessField,
	Fieldset as HeadlessFieldset,
	Label as HeadlessLabel,
	Legend as HeadlessLegend,
	RadioGroup as HeadlessRadioGroup,
} from "@headlessui/react";
import { Radio, RadioField, RadioGroup } from "@/components/catalyst/radio";
import { Button } from "@/components/catalyst/button";
import { toast } from "sonner";
import { addFee } from "@/utils/supabase/actions";
import type { Fee } from "@/components/PropertySettings/RentCard";

type AddFeeDialogProps = {
	isOpen: boolean;
	onClose: () => void;
	propertyId: string;
	fees: any[];
	setFees: any;
	setCurrentProperty?: (property: any) => void;
};

export function AddFeeDialog({
	isOpen,
	onClose,
	propertyId,
	fees,
	setFees,
	setCurrentProperty,
}: AddFeeDialogProps) {
	const isMobile = useMediaQuery("(max-width: 640px)");
	const [isMounted, setIsMounted] = useState(false);
	const [dialogFee, setDialogFee] = useState<Fee>({
		id: "",
		property_id: propertyId,
		fee_type: "one-time",
		fee_name: "",
		fee_cost: 0,
	});

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
								<Subheading level={1}>Add Fee</Subheading>
							</Drawer.Title>
							<Drawer.Description
								asChild
								className="leading-6 mt-2 text-gray-600"
							>
								<Text>
									Add a one-time or recurring charge for the tenant. Use a
									positive number for a fee or a negative number for a discount.
									Charges will be applied at the start of the next month.
								</Text>
							</Drawer.Description>
							<form
								action={async (formData: FormData) => {
									toast.promise(
										// biome-ignore lint/suspicious/noAsyncPromiseExecutor: <explanation>
										new Promise(async (resolve, reject) => {
											try {
												const data = await addFee(formData, propertyId);
												const newFee = {
													id: data.id,
													property_id: propertyId,
													fee_type: dialogFee.fee_type,
													fee_name: dialogFee.fee_name,
													fee_cost: dialogFee.fee_cost,
												};
												setFees([...fees, newFee]);
												onClose();
												setDialogFee({
													id: "",
													property_id: propertyId,
													fee_type: "one-time",
													fee_name: "",
													fee_cost: 0,
												});
												setCurrentProperty?.((prevProperty: any) => ({
													...prevProperty,
													property_fees: [...fees, newFee],
												}));
												resolve("Success");
											} catch (error) {
												reject(error);
											}
										}),
										{
											loading: "Adding fee...",
											success: "Fee added!",
											error: "An error occurred while adding the fee.",
										},
									);
								}}
							>
								<DialogBody>
									<div className="items-center">
										<HeadlessFieldset>
											<HeadlessLegend className="mb-3 text-base/6 font-medium sm:text-sm/6">
												Fee type
											</HeadlessLegend>
											<HeadlessRadioGroup
												name="feeType"
												defaultValue="one-time"
												className="mt-1 flex items-center gap-x-3"
												onChange={(feeType: "one-time" | "recurring") =>
													setDialogFee({ ...dialogFee, fee_type: feeType })
												}
											>
												<HeadlessRadioGroup.Option value="one-time">
													<HeadlessField className="flex items-center rounded-lg pr-6 outline outline-1 outline-gray-200">
														<Radio
															value="one-time"
															color="blue"
															className="px-3 py-2"
														/>
														<HeadlessLabel className="text-sm">
															One-time
														</HeadlessLabel>
													</HeadlessField>
												</HeadlessRadioGroup.Option>
												<HeadlessRadioGroup.Option value="recurring">
													<HeadlessField className="flex items-center rounded-lg pr-6 outline outline-1 outline-gray-200">
														<Radio
															value="recurring"
															color="blue"
															className="px-3 py-2"
														/>
														<HeadlessLabel className="text-sm">
															Recurring
														</HeadlessLabel>
													</HeadlessField>
												</HeadlessRadioGroup.Option>
											</HeadlessRadioGroup>
										</HeadlessFieldset>
									</div>
									<div className="mt-6">
										<Field>
											<Label htmlFor="feeName">Fee name</Label>
											<Input
												id="feeName"
												value={dialogFee.fee_name}
												name="feeName"
												onChange={(e) =>
													setDialogFee({
														...dialogFee,
														fee_name: e.target.value,
													})
												}
												// placeholder="Enter fee name"
												autoComplete="off"
												required
											/>
										</Field>
									</div>
									<div className="mt-6">
										<Field>
											<Label htmlFor="feeAmount ">Fee amount</Label>
											<Input
												id="feeAmount"
												type="number"
												value={dialogFee.fee_cost || ""}
												name="feeAmount"
												onChange={(e) =>
													setDialogFee({
														...dialogFee,
														fee_cost: Number(e.target.value),
													})
												}
												placeholder="0"
												autoComplete="off"
												required
												// min="0"
												pattern="^\d+(?:\.\d{1,2})?$"
												step=".01"
											/>
										</Field>
									</div>
								</DialogBody>
								<DialogActions>
									<Button
										type="button"
										outline
										onClick={() => {
											onClose();
										}}
									>
										Cancel
									</Button>
									<Button type="submit" color="blue" className="">
										Add
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
				<DialogTitle>Add Fee</DialogTitle>
				<DialogDescription>
					Add a one-time or recurring charge for the tenant. Use a positive
					number for a fee or a negative number for a discount. Charges will be
					applied at the start of the next month.
				</DialogDescription>
				<form
					action={async (formData: FormData) => {
						toast.promise(
							// biome-ignore lint/suspicious/noAsyncPromiseExecutor: <explanation>
							new Promise(async (resolve, reject) => {
								try {
									const data = await addFee(formData, propertyId);
									const newFee = {
										id: data.id,
										property_id: propertyId,
										fee_type: dialogFee.fee_type,
										fee_name: dialogFee.fee_name,
										fee_cost: dialogFee.fee_cost,
									};
									setFees([...fees, newFee]);
									onClose();
									setDialogFee({
										id: "",
										property_id: propertyId,
										fee_type: "one-time",
										fee_name: "",
										fee_cost: 0,
									});
									setCurrentProperty?.((prevProperty: any) => ({
										...prevProperty,
										property_fees: [...fees, newFee],
									}));
									resolve("Success");
								} catch (error) {
									reject(error);
								}
							}),
							{
								loading: "Adding fee...",
								success: "Fee added!",
								error: "An error occurred while adding the fee.",
							},
						);
					}}
				>
					<DialogBody>
						<div className="items-center">
							<HeadlessFieldset>
								<HeadlessLegend className="mb-3 text-base/6 font-medium sm:text-sm/6">
									Fee type
								</HeadlessLegend>
								<HeadlessRadioGroup
									name="feeType"
									defaultValue="one-time"
									className="mt-1 flex items-center gap-x-3"
									onChange={(feeType: "one-time" | "recurring") =>
										setDialogFee({ ...dialogFee, fee_type: feeType })
									}
								>
									<HeadlessRadioGroup.Option value="one-time">
										<HeadlessField className="flex items-center rounded-lg pr-6 outline outline-1 outline-gray-200">
											<Radio
												value="one-time"
												color="blue"
												className="px-3 py-2"
											/>
											<HeadlessLabel className="text-sm">
												One-time
											</HeadlessLabel>
										</HeadlessField>
									</HeadlessRadioGroup.Option>
									<HeadlessRadioGroup.Option value="recurring">
										<HeadlessField className="flex items-center rounded-lg pr-6 outline outline-1 outline-gray-200">
											<Radio
												value="recurring"
												color="blue"
												className="px-3 py-2"
											/>
											<HeadlessLabel className="text-sm">
												Recurring
											</HeadlessLabel>
										</HeadlessField>
									</HeadlessRadioGroup.Option>
								</HeadlessRadioGroup>
							</HeadlessFieldset>
						</div>
						<div className="mt-6">
							<Field>
								<Label htmlFor="feeName">Fee name</Label>
								<Input
									id="feeName"
									value={dialogFee.fee_name}
									name="feeName"
									onChange={(e) =>
										setDialogFee({ ...dialogFee, fee_name: e.target.value })
									}
									// placeholder="Enter fee name"
									autoComplete="off"
									required
								/>
							</Field>
						</div>
						<div className="mt-6">
							<Field>
								<Label htmlFor="feeAmount ">Fee amount</Label>
								<Input
									id="feeAmount"
									type="number"
									value={dialogFee.fee_cost || ""}
									name="feeAmount"
									onChange={(e) =>
										setDialogFee({
											...dialogFee,
											fee_cost: Number(e.target.value),
										})
									}
									placeholder="0"
									autoComplete="off"
									required
									// min="0"
									pattern="^\d+(?:\.\d{1,2})?$"
									step=".01"
								/>
							</Field>
						</div>
					</DialogBody>
					<DialogActions>
						<Button type="button" outline onClick={() => onClose()}>
							Cancel
						</Button>
						<Button type="submit" color="blue" className="">
							Add
						</Button>
					</DialogActions>
				</form>
			</Dialog>
		</>
	);
}
