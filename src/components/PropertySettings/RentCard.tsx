"use client";
import React, { useState, useEffect } from "react";

import { Button } from "@/components/catalyst/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input, InputGroup } from "@/components/catalyst/input";
import { Field, Label } from "@/components/catalyst/fieldset";
import { Heading } from "@/components/catalyst/heading";
import { Strong, Text, TextLink } from "@/components/catalyst/text";
import * as Headless from "@headlessui/react";
import {
	Field as HeadlessField,
	Fieldset as HeadlessFieldset,
	Label as HeadlessLabel,
	Legend as HeadlessLegend,
	RadioGroup as HeadlessRadioGroup,
} from "@headlessui/react";
import { Switch } from "@/components/catalyst/switch";
import {
	Dialog,
	DialogActions,
	DialogBody,
	DialogDescription,
	DialogTitle,
} from "@/components/catalyst/dialog";
import { Radio, RadioField, RadioGroup } from "@/components/catalyst/radio";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/catalyst/table";
import { EditFeeDialog } from "@/components/PropertySettings/EditFeeDialog";
import { addPropertyFees, addFee } from "@/utils/supabase/actions";
import { format, addYears, subDays, addDays, addWeeks } from "date-fns";
import { ScheduleDialog } from "@/components/PropertySettings/ScheduleDialog";
import { toast } from "sonner";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { daysBetween } from "@/utils/helpers";
import { parseISO } from "date-fns";
import { Divider } from "@/components/catalyst/divider";
import { motion, AnimatePresence } from "framer-motion";
import { BankSelect } from "@/components/PropertySettings/BankSelect";

export interface Fee {
	id: string;
	property_id?: string;
	fee_type: "one-time" | "recurring";
	fee_name: string;
	fee_cost: number | undefined;
	months_left?: number;
	created_at?: Date;
}

type RentCardProps = {
	propertyId: string;
	propertyRent?: any | null;
	securityDeposit?: any | null;
	propertyFees?: any[] | null;
	setCurrentProperty?: (property: any) => void;
	setPropertyId?: (propertyId: string) => void;
	buttonOnClick?: () => void;
};

export function RentCard({
	propertyId,
	propertyRent,
	securityDeposit,
	propertyFees,
	setCurrentProperty,
	buttonOnClick,
}: RentCardProps) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isScheduleOpen, setIsScheduleOpen] = useState(false);
	const [rentAmount, setRentAmount] = useState<number>(
		propertyRent?.rent_price ?? 0,
	);
	const [hasSecurityDeposit, setHasSecurityDeposit] = useState(
		!!securityDeposit,
	);
	const [securityDepositFee, setSecurityDepositFee] = useState<number>(
		securityDeposit ? securityDeposit.deposit_amount : 0,
	);
	const [dialogFee, setDialogFee] = useState<Fee>({
		id: "",
		property_id: propertyId,
		fee_type: "one-time",
		fee_name: "",
		fee_cost: 0,
	});
	const [fees, setFees] = React.useState<any[]>(propertyFees ?? []);
	const [editFeeOpen, setEditFeeOpen] = React.useState(false);
	const [feeEdit, setFeeEdit] = React.useState<Fee>();

	const defaultStartDate = addDays(new Date(), 1);
	const defaultEndDate = addYears(new Date(), 1);

	const [startDate, setStartDate] = useState<string>(
		propertyRent
			? format(parseISO(propertyRent.rent_start), "yyyy-MM-dd")
			: format(defaultStartDate, "yyyy-MM-dd"),
	);
	const [endDate, setEndDate] = useState<string>(
		propertyRent
			? format(parseISO(propertyRent.rent_end), "yyyy-MM-dd")
			: format(defaultEndDate, "yyyy-MM-dd"),
	);

	const [fadeOut, setFadeOut] = React.useState(false);
	const animationClass = fadeOut ? " animate__fadeOut" : "animate__fadeIn";

	const [initialRentAmount, setInitialRentAmount] = useState<number>(
		propertyRent?.rent_price ?? 0,
	);
	const [initialSecurityDepositFee, setInitialSecurityDepositFee] =
		useState<number>(securityDeposit ? securityDeposit.deposit_amount : 0);

	const [initialStartDate, setInitialStartDate] = useState<string>(
		propertyRent ? format(parseISO(propertyRent.rent_start), "yyyy-MM-dd") : "",
	);
	const [initialEndDate, setInitialEndDate] = useState<string>(
		propertyRent ? format(parseISO(propertyRent.rent_end), "yyyy-MM-dd") : "",
	);

	const hasChanges =
		rentAmount !== initialRentAmount ||
		securityDepositFee !== initialSecurityDepositFee ||
		startDate !== initialStartDate ||
		endDate !== initialEndDate;

	const daysBetweenDates = daysBetween(parseISO(startDate), new Date());

	return (
		<>
			<Card
				className={`animate__animated animate__faster w-full ${animationClass}`}
			>
				<form
					action={async (formData) => {
						toast.promise(
							// biome-ignore lint/suspicious/noAsyncPromiseExecutor: <explanation>
							new Promise(async (resolve, reject) => {
								try {
									const data = await addPropertyFees(formData);
									if (buttonOnClick) {
										setFadeOut(true);
										resolve("Success");
										setTimeout(() => {
											buttonOnClick();
										}, 300);
									} else {
										resolve("Success");
									}
								} catch (error) {
									reject(error);
								} finally {
									setInitialRentAmount(rentAmount);
									setInitialSecurityDepositFee(securityDepositFee);
									setInitialStartDate(startDate);
									setInitialEndDate(endDate);
									setCurrentProperty?.((prevProperty: any) => ({
										...prevProperty,
										property_rent: {
											...prevProperty.property_rent,
											rent_price: rentAmount,
											rent_start: startDate,
											rent_end: endDate,
										},
										property_security_deposits:
											hasSecurityDeposit && securityDepositFee !== 0
												? {
														...prevProperty.property_security_deposits,
														deposit_amount: securityDepositFee,
													}
												: prevProperty.property_security_deposits,
									}));
								}
							}),
							{
								loading: "Adding...",
								success: "Rental setup updated",
								error:
									"An error occurred, please check the form and try again.",
							},
						);
					}}
				>
					<CardHeader>
						<Heading>Property setup</Heading>
						<Text className="">
							Rent and any fees are billed on the start date, and then the first
							of each month.
						</Text>
					</CardHeader>
					<CardContent>
						<div className="relative space-y-4">
							<Headless.Field className="relative flex flex-col md:flex-row md:items-center md:gap-4">
								<Label className="mb-2 md:mb-0 md:w-40 md:flex-shrink-0">
									Lease start and end
								</Label>
								<div className="flex flex-grow flex-row gap-1 sm:gap-2 w-full md:flex-1">
									<Input
										type="date"
										id="startDate"
										name="startDate"
										value={startDate}
										placeholder="MM/DD/YYYY"
										onChange={(e) => setStartDate(e.target.value)}
										min={format(new Date(), "yyyy-MM-dd")}
										required
									/>
									<span className="hidden sm:flex text-gray-700 items-center justify-center select-none">
										-
									</span>
									<Input
										type="date"
										id="endDate"
										name="endDate"
										placeholder="MM/DD/YYYY"
										value={endDate > startDate ? endDate : ""}
										onChange={(e) => setEndDate(e.target.value)}
										min={startDate}
										required
									/>
								</div>
							</Headless.Field>

							<input
								name="rent_id"
								required
								value={propertyRent?.id ?? ""}
								readOnly
								type="hidden"
							/>
							<input
								name="dateFrom"
								required
								value={startDate ? startDate : ""}
								readOnly
								type="hidden"
							/>
							<input
								name="dateTo"
								required
								value={endDate ? endDate : ""}
								readOnly
								type="hidden"
							/>
							<Headless.Field className="relative flex flex-col md:flex-row md:items-center md:gap-4">
								<Label
									htmlFor="rentAmount"
									className="mb-2 md:mb-0 md:w-40 md:flex-shrink-0"
								>
									Rent per month
								</Label>
								<div className="flex-grow">
									<InputGroup className="w-full relative">
										{/* <CurrencyDollarIcon className="h-5 w-5 text-gray-400" /> */}
										<span className="text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 select-none">
											$
										</span>
										<Input
											// type="number"
											id="rentAmount"
											name="rentAmount"
											placeholder="0"
											className="w-full flex-grow"
											autoComplete="off"
											value={rentAmount === 0 ? "" : rentAmount}
											onChange={(e) => {
												const value = e.target.value;
												const cleanedValue = value.replace(/[^0-9.]/g, "");
												const numericValue = Number.parseFloat(cleanedValue);
												if (!Number.isNaN(numericValue)) {
													setRentAmount(numericValue);
												} else if (value === "") {
													setRentAmount(0);
												}
											}}
											inputMode="numeric"
											step="1"
											required
											min="0"
											pattern="^\d+(?:\.\d{1,2})?$"
											// disabled={daysBetweenDates <= 0}
										/>
									</InputGroup>
								</div>
							</Headless.Field>

							<Headless.Field className="relative flex flex-col md:flex-row md:items-center md:gap-4">
								<div className="mb-2 flex items-center justify-between md:mb-0 md:w-40 md:flex-shrink-0">
									<Label htmlFor="securityDeposit">Security deposit</Label>
									<Switch
										id="securityDeposit"
										name="securityDepositSwitch"
										color="blue"
										checked={hasSecurityDeposit}
										onChange={() => {
											setHasSecurityDeposit(!hasSecurityDeposit);
										}}
									/>
								</div>
								<AnimatePresence>
									{hasSecurityDeposit && (
										<motion.div
											className="flex-grow"
											initial={{ opacity: 0, height: 0 }}
											animate={{ opacity: 1, height: "auto" }}
											exit={{ opacity: 0, height: 0 }}
											transition={{ duration: 0.25 }}
										>
											<div className="flex-grow">
												<InputGroup className="w-full">
													<span className="text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 select-none">
														$
													</span>
													<Input
														// type="number"
														inputMode="numeric"
														id="depositAmount"
														name="depositAmount"
														placeholder="0"
														disabled={!hasSecurityDeposit}
														className="w-full flex-grow"
														autoComplete="off"
														value={
															securityDepositFee === 0 ? "" : securityDepositFee
														}
														required={hasSecurityDeposit}
														onChange={(e) => {
															const value = e.target.value;
															const cleanedValue = value.replace(
																/[^0-9.]/g,
																"",
															);
															const numericValue =
																Number.parseFloat(cleanedValue);
															if (!Number.isNaN(numericValue)) {
																setSecurityDepositFee(numericValue);
															} else if (value === "") {
																setSecurityDepositFee(0);
															}
														}}
														step="1"
														min="0"
														pattern="^\d+(?:\.\d{1,2})?$"
													/>
												</InputGroup>
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</Headless.Field>
							<Headless.Field className="relative flex flex-col md:flex-row md:items-center md:gap-4">
								<Label
									htmlFor="rentAmount"
									className="mb-2 md:mb-0 md:w-40 md:flex-shrink-0"
								>
									Bank account
								</Label>
								<BankSelect />
							</Headless.Field>
						</div>
						{fees.length > 0 && (
							<div className="mt-3">
								<Table dense={true} className="">
									<TableHead>
										<TableRow className="text-card-foreground">
											<TableHeader className="">Fee name</TableHeader>
											<TableHeader>Fee type</TableHeader>
											<TableHeader className="text-right">Cost</TableHeader>
										</TableRow>
									</TableHead>
									<TableBody>
										{fees.map((fee, index) => (
											<TableRow
												key={fee.id}
												className="cursor-default"
												onClick={() => {
													setFeeEdit(fee);
													setEditFeeOpen(true);
												}}
											>
												<TableCell className="max-w-[140px] truncate">
													{fee.fee_name}
												</TableCell>
												<TableCell>{fee.fee_type}</TableCell>
												<TableCell className="text-right">
													${fee.fee_cost}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						)}
						<input
							name="propertyId"
							defaultValue={propertyId}
							readOnly
							className="hidden"
						/>
						<div className="-mb-1 mt-6 flex justify-between">
							<Button
								type="button"
								color="blue"
								onClick={() => setIsDialogOpen(true)}
							>
								Add Fee
							</Button>
							<Button
								type="button"
								outline
								onClick={() => setIsScheduleOpen(true)}
							>
								Billing Schedule
							</Button>
						</div>
					</CardContent>

					<Divider />
					<CardFooter className="flex items-center justify-end">
						<div className="flex gap-x-3">
							{/* <Button color="white">Edit</Button> */}
							<Button type="submit" color="blue" disabled={!hasChanges}>
								Save
							</Button>
						</div>
					</CardFooter>
				</form>
			</Card>
			<Dialog open={isDialogOpen} onClose={setIsDialogOpen}>
				<DialogTitle>Add Fee</DialogTitle>
				<DialogDescription>
					Add a one-time or recurring fee for the tenant, billed at the start of
					next month. Enter a negative amount to apply a discount.
				</DialogDescription>
				<form
					action={async (formData) => {
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
									setIsDialogOpen(false);
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
						<Button
							type="button"
							outline
							onClick={() => setIsDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button type="submit" color="blue" className="">
							Add
						</Button>
					</DialogActions>
				</form>
			</Dialog>
			{editFeeOpen && feeEdit && (
				<EditFeeDialog
					isOpen={editFeeOpen}
					setIsOpen={setEditFeeOpen}
					fee={feeEdit}
					fees={fees}
					setFees={setFees}
					setCurrentProperty={setCurrentProperty}
				/>
			)}
			{startDate && endDate && (
				<ScheduleDialog
					isOpen={isScheduleOpen}
					setIsOpen={setIsScheduleOpen}
					startDate={parseISO(startDate)}
					endDate={parseISO(endDate)}
					rentAmount={rentAmount}
					securityDeposit={securityDeposit}
					securityDepositFee={securityDepositFee}
				/>
			)}
		</>
	);
}
