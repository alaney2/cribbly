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
import { Separator } from "@/components/ui/separator";
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
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/catalyst/table";
import { EditFeeDialog } from "@/components/PropertySettings/EditFeeDialog";
// import { generateId } from "@/lib/utils"
import { addPropertyFees, addFee } from "@/utils/supabase/actions";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, addYears, subDays, addDays, addWeeks } from "date-fns";
import { cn } from "@/lib/utils";
import { ScheduleDialog } from "@/components/PropertySettings/ScheduleDialog";
import { toast } from "sonner";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import type { DateRange } from "react-day-picker";
import { daysBetween } from "@/utils/helpers";
import { parseISO } from "date-fns";
import { Divider } from "@/components/catalyst/divider";

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
	setPropertyId?: (propertyId: string) => void;
	freeMonthsLeft?: number;
	buttonOnClick?: () => void;
};

export function RentCard({
	propertyId,
	propertyRent,
	securityDeposit,
	propertyFees,
	setPropertyId,
	freeMonthsLeft,
	buttonOnClick,
}: RentCardProps) {
	useEffect(() => {
		if (typeof window !== "undefined" && setPropertyId && !propertyId) {
			setPropertyId(localStorage.getItem("propertyId") || "");
		}
	}, [propertyId, setPropertyId]);

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isScheduleOpen, setIsScheduleOpen] = useState(false);
	const [rentAmount, setRentAmount] = useState<number>(
		propertyRent?.rent_price ?? 0,
	);
	const [hasSecurityDeposit, setHasSecurityDeposit] = useState(
		securityDeposit ? true : false,
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

	const [date, setDate] = React.useState<DateRange | undefined>({
		from: propertyRent
			? parseISO(propertyRent.rent_start)
			: addWeeks(new Date(), 1),
		to: propertyRent
			? parseISO(propertyRent.rent_end)
			: addDays(addYears(new Date(), 1), 6),
	});

	const [fadeOut, setFadeOut] = React.useState(false);
	const animationClass = fadeOut ? " animate__fadeOut" : "animate__fadeIn";
	const daysBetweenDates = daysBetween(date?.from ?? new Date(), new Date());

	const [initialRentAmount, setInitialRentAmount] = useState<number>(
		propertyRent?.rent_price ?? 0,
	);
	const [initialSecurityDepositFee, setInitialSecurityDepositFee] =
		useState<number>(securityDeposit ? securityDeposit.deposit_amount : 0);
	// const [initialFees, setInitialFees] = React.useState<any[]>(propertyFees ?? [])

	const [initialStartDate, setInitialStartDate] = useState<Date | undefined>(
		propertyRent ? parseISO(propertyRent.rent_start) : undefined,
	);
	const [initialEndDate, setInitialEndDate] = useState<Date | undefined>(
		propertyRent ? parseISO(propertyRent.rent_end) : undefined,
	);

	const hasChanges =
		rentAmount !== initialRentAmount ||
		securityDepositFee !== initialSecurityDepositFee ||
		(date?.from &&
			initialStartDate &&
			date.from.getTime() !== initialStartDate.getTime()) ||
		(date?.to &&
			initialEndDate &&
			date.to.getTime() !== initialEndDate.getTime());

	return (
		<>
			<Card
				className={`animate__animated animate__faster w-full ${animationClass}`}
			>
				<form
					action={async (formData) => {
						toast.promise(
							new Promise(async (resolve, reject) => {
								try {
									const data = await addPropertyFees(formData);
									if (buttonOnClick) {
										setFadeOut(true);
										setTimeout(() => {
											buttonOnClick();
											resolve("Success");
										}, 300);
									} else {
										resolve("Success");
									}
								} catch (error) {
									reject(error);
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
							Set the rent and fees to charge for this property per month. Rent
							is billed on the start date, and then the first of each month.
						</Text>
					</CardHeader>
					<CardContent>
						<div className="mb-5 flex flex-col md:flex-row md:items-center md:gap-4">
							<Headless.Field className="relative flex flex-col md:flex-row md:items-center md:gap-4">
								<Label className="mb-2 md:mb-0 md:w-40 md:flex-shrink-0">
									Start and end date
								</Label>
								<div className="flex-grow">
									<Popover>
										<PopoverTrigger asChild>
											<Button
												id="date"
												outline
												className={cn(
													"w-full",
													!date && "text-muted-foreground",
												)}
												disabled={daysBetweenDates <= 0}
											>
												<CalendarIcon className="mr-2 h-4 w-4" />
												{date?.from && format(date?.from, "LLL dd, y")} -{" "}
												{date?.to && format(date?.to, "LLL dd, y")}
												{/* {date?.from ? (
                        date.to ? (
                          <>
                          </>
                        ) : (
                          format(date.from, 'LLL dd, y')
                        )
                      ) : (
                        <span>Pick a date</span>
                      )} */}
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<div className="block sm:hidden">
												<Calendar
													initialFocus
													mode="range"
													defaultMonth={date?.from}
													selected={date}
													onSelect={setDate}
													numberOfMonths={1}
													disabled={(date) => date < new Date()}
												/>
											</div>
											<div className="hidden sm:block">
												<Calendar
													initialFocus
													mode="range"
													defaultMonth={date?.from}
													selected={date}
													onSelect={setDate}
													numberOfMonths={2}
													disabled={(date) => date < new Date()}
												/>
											</div>
										</PopoverContent>
									</Popover>
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
								value={date?.from ? format(date?.from, "MM/dd/yyyy") : ""}
								readOnly
								type="hidden"
							/>
							<input
								name="dateTo"
								required
								value={date?.to ? format(date?.to, "MM/dd/yyyy") : ""}
								readOnly
								type="hidden"
							/>
						</div>
						<div className="relative space-y-4">
							<Headless.Field className="relative flex flex-col md:flex-row md:items-center md:gap-4">
								<Label
									htmlFor="rentAmount"
									className="mb-2 md:mb-0 md:w-40 md:flex-shrink-0"
								>
									Rent per month
								</Label>
								<div className="flex-grow">
									<InputGroup className="w-full">
										<CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
										<Input
											type="number"
											id="rentAmount"
											name="rentAmount"
											placeholder="0"
											className="w-full flex-grow"
											autoComplete="off"
											value={rentAmount === 0 ? "" : rentAmount}
											onChange={(e) => {
												setRentAmount(Number(e.target.value));
											}}
											step="1"
											required
											min="0"
											pattern="^\d+(?:\.\d{1,2})?$"
											disabled={daysBetweenDates <= 0}
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
								<div className="flex-grow">
									<InputGroup className="w-full">
										<CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
										<Input
											type="number"
											id="depositAmount"
											name="depositAmount"
											placeholder="0"
											disabled={!hasSecurityDeposit || daysBetweenDates <= 0}
											className="w-full flex-grow"
											autoComplete="off"
											value={securityDepositFee === 0 ? "" : securityDepositFee}
											required={hasSecurityDeposit}
											onChange={(e) => {
												setSecurityDepositFee(Number(e.target.value));
											}}
											step="1"
											min="0"
											pattern="^\d+(?:\.\d{1,2})?$"
										/>
									</InputGroup>
								</div>
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
												key={index}
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
						{/* {fees.length > 0 &&
              fees.map((fee, index) => (
                <input
                  key={index}
                  className="hidden"
                  name={`fee${index}`}
                  id={`fee${index}`}
                  defaultValue={JSON.stringify(fee)}
                  readOnly
                />
              ))} */}
						<input
							name="propertyId"
							defaultValue={propertyId}
							readOnly
							className="hidden"
						/>
						<div className="-mb-2 mt-4 flex justify-between">
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
							<Button
								type="submit"
								color="blue"
								disabled={daysBetweenDates <= 0 || !hasChanges}
							>
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
				/>
			)}
			{date && date.to && date.from && (
				<ScheduleDialog
					isOpen={isScheduleOpen}
					setIsOpen={setIsScheduleOpen}
					startDate={date.from}
					endDate={date.to}
					rentAmount={rentAmount}
					securityDeposit={securityDeposit}
					securityDepositFee={securityDepositFee}
				/>
			)}
		</>
	);
}
