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
import {
	Field,
	FieldGroup,
	Fieldset,
	Legend,
	Label,
} from "@/components/catalyst/fieldset";
import { Input } from "@/components/catalyst/input";
import { Button } from "@/components/catalyst/button";
import type { Fee } from "@/components/PropertySettings/RentCard";
import {
	Field as HeadlessField,
	Fieldset as HeadlessFieldset,
	Label as HeadlessLabel,
	Legend as HeadlessLegend,
	RadioGroup as HeadlessRadioGroup,
} from "@headlessui/react";
import { Radio, RadioField, RadioGroup } from "@/components/catalyst/radio";
import { editFee, deleteFee } from "@/utils/supabase/actions";

type EditFeeDialogProps = {
	isOpen: boolean;
	onClose: () => void;
	// dialogBody: React.ReactNode;
	// dialogActions: React.ReactNode;
	fee: Fee;
	fees: Fee[];
	setFees: (fees: Fee[]) => void;
	setCurrentProperty?: (property: any) => void;
};

export function EditFeeDialog({
	isOpen,
	onClose,
	// dialogBody,
	// dialogActions,
	fee,
	fees,
	setFees,
	setCurrentProperty,
}: EditFeeDialogProps) {
	const isMobile = useMediaQuery("(max-width: 640px)");
	const [isMounted, setIsMounted] = useState(false);
	const [currentFee, setCurrentFee] = useState<Fee>(fee);

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
								<Subheading level={1}>Edit Fee</Subheading>
							</Drawer.Title>
							<Drawer.Description
								asChild
								className="leading-6 mt-2 text-gray-600"
							>
								<Text>
									Add a one-time or recurring fee for the tenant, billed at the
									start of next month. Enter a negative amount to apply a
									discount.
								</Text>
							</Drawer.Description>
							<form
								action={async (formData) => {
									await editFee(formData);
									setFees(
										fees.map((f) => (f.id === currentFee.id ? currentFee : f)),
									);
									setCurrentProperty?.((prevProperty: any) => ({
										...prevProperty,
										property_fees: prevProperty.property_fees.map((f: Fee) =>
											f.id === currentFee.id ? currentFee : f,
										),
									}));
									// setIsOpen(false);
									onClose();
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
												value={currentFee.fee_type}
												className="mt-1 flex items-center gap-x-3"
												onChange={(feeType: "one-time" | "recurring") =>
													setCurrentFee({ ...currentFee, fee_type: feeType })
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

										{/* </HeadlessFieldset> */}
									</div>

									<div className="mt-6">
										<Field>
											<Label htmlFor="feeName">Fee Name</Label>
											<Input
												id="feeName"
												name="feeName"
												value={currentFee.fee_name}
												onChange={(e) =>
													setCurrentFee({
														...currentFee,
														fee_name: e.target.value,
													})
												}
												placeholder=""
												autoComplete="off"
												required
											/>
										</Field>
									</div>
									<div className="mt-2">
										<Field>
											<Label htmlFor="feeCost">Fee Amount</Label>
											<Input
												id="feeCost"
												name="feeCost"
												type="number"
												value={
													currentFee.fee_cost === 0 ? "" : currentFee.fee_cost
												}
												onChange={(e) =>
													setCurrentFee({
														...currentFee,
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
									<input
										name="feeId"
										value={currentFee.id}
										readOnly
										className="hidden"
									/>
								</DialogBody>
								<DialogActions className="flex w-full items-center justify-between">
									<Button
										// variant="destructive"
										color="red"
										// size="sm"
										onClick={async () => {
											await deleteFee(currentFee.id);
											setFees(fees.filter((f) => f.id !== currentFee.id));
											setCurrentProperty?.((prevProperty: any) => ({
												...prevProperty,
												property_fees: prevProperty.property_fees.filter(
													(f: Fee) => f.id !== currentFee.id,
												),
											}));
											// setIsOpen(false);
											onClose();
										}}
									>
										Delete
									</Button>
									<Button type="submit" color="blue">
										Confirm
									</Button>
								</DialogActions>
							</form>
							{/* <div className="flex flex-col mt-8 space-y-2"> */}
							{/* {dialogActions} */}
							{/* </div> */}
						</div>
					</Drawer.Content>
				</Drawer.Portal>
			</Drawer.Root>
		);
	}
	return (
		<>
			<Dialog open={isOpen} onClose={onClose}>
				<DialogTitle>Edit Fee</DialogTitle>
				<DialogDescription>
					Add a one-time or recurring fee for the tenant, billed at the start of
					next month. Enter a negative amount to apply a discount.
				</DialogDescription>
				<form
					action={async (formData) => {
						await editFee(formData);
						setFees(fees.map((f) => (f.id === currentFee.id ? currentFee : f)));
						setCurrentProperty?.((prevProperty: any) => ({
							...prevProperty,
							property_fees: prevProperty.property_fees.map((f: Fee) =>
								f.id === currentFee.id ? currentFee : f,
							),
						}));
						// setIsOpen(false);
						onClose();
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
									value={currentFee.fee_type}
									className="mt-1 flex items-center gap-x-3"
									onChange={(feeType: "one-time" | "recurring") =>
										setCurrentFee({ ...currentFee, fee_type: feeType })
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

							{/* </HeadlessFieldset> */}
						</div>

						<div className="mt-6">
							<Field>
								<Label htmlFor="feeName">Fee Name</Label>
								<Input
									id="feeName"
									name="feeName"
									value={currentFee.fee_name}
									onChange={(e) =>
										setCurrentFee({ ...currentFee, fee_name: e.target.value })
									}
									placeholder=""
									autoComplete="off"
									required
								/>
							</Field>
						</div>
						<div className="mt-2">
							<Field>
								<Label htmlFor="feeCost">Fee Amount</Label>
								<Input
									id="feeCost"
									name="feeCost"
									type="number"
									value={currentFee.fee_cost === 0 ? "" : currentFee.fee_cost}
									onChange={(e) =>
										setCurrentFee({
											...currentFee,
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
						<input
							name="feeId"
							value={currentFee.id}
							readOnly
							className="hidden"
						/>
					</DialogBody>
					<DialogActions className="flex w-full items-center justify-between">
						<Button
							// variant="destructive"
							color="red"
							// size="sm"
							onClick={async () => {
								await deleteFee(currentFee.id);
								setFees(fees.filter((f) => f.id !== currentFee.id));
								setCurrentProperty?.((prevProperty: any) => ({
									...prevProperty,
									property_fees: prevProperty.property_fees.filter(
										(f: Fee) => f.id !== currentFee.id,
									),
								}));
								// setIsOpen(false);
								onClose();
							}}
						>
							Delete
						</Button>
						<Button type="submit" color="blue">
							Confirm
						</Button>
					</DialogActions>
				</form>
			</Dialog>
		</>
	);
}
