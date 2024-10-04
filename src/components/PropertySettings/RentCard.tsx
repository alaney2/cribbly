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
import { Switch } from "@/components/catalyst/switch";
import { EditFeeDialog } from "@/components/dialogs/EditFeeDialog";
import { addPropertyFees, addFee, getLease } from "@/utils/supabase/actions";
import { format, addYears, subDays, addDays, addWeeks } from "date-fns";
import { BillingScheduleDialog } from "@/components/dialogs/BillingScheduleDialog";
import { AddFeeDialog } from "@/components/dialogs/AddFeeDialog";
import { toast } from "sonner";
import { daysBetween } from "@/utils/helpers";
import { parseISO } from "date-fns";
import { Divider } from "@/components/catalyst/divider";
import { motion, AnimatePresence } from "framer-motion";
import { BankSelect } from "@/components/PropertySettings/BankSelect";
import useSWR, { mutate } from "swr";
import { createClient } from "@/utils/supabase/client";
import { Skeleton } from "@/components/catalyst/skeleton";

export interface Fee {
	id: string;
	property_id?: string;
	fee_type: "one-time" | "recurring";
	fee_name: string;
	fee_cost: number | undefined;
	months_left?: number;
	created_at?: Date;
}

// type Lease = {
// 	sd_status: string;
// 	sd_amount: number;
// 	rent_amount: number;
// 	start_date: string;
// 	end_date: string;
// };

type RentCardProps = {
	propertyId: string;
	// lease?: Lease | null;
	// userId: string;
	setCurrentProperty?: (property: any) => void;
	setPropertyId?: (propertyId: string) => void;
	buttonOnClick?: () => void;
	// plaidAccounts: any[] | undefined;
};

const fetchLease = async (propertyId: string) => {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("leases")
		.select("*")
		.eq("property_id", propertyId)
		.single();
	if (error) throw error;
	return data;
};

export function RentCard({
	propertyId,
	// userId,
	// lease: initialLease,
	setCurrentProperty,
	buttonOnClick,
	// plaidAccounts,
}: RentCardProps) {
	const {
		data: lease,
		error: leaseError,
		isLoading,
	} = useSWR(["lease", propertyId], () => fetchLease(propertyId));

	useEffect(() => {
		if (lease) {
			setRentAmount(lease.rent_amount ?? 0);
			setHasSecurityDeposit(lease.sd_status !== "none");
			setSecurityDepositFee(
				lease.sd_status !== "none" ? lease.sd_amount ?? 0 : 0,
			);
			setStartDate(format(parseISO(lease.start_date), "yyyy-MM-dd"));
			setEndDate(format(parseISO(lease.end_date), "yyyy-MM-dd"));

			setInitialRentAmount(lease.rent_amount ?? 0);
			setInitialSecurityDepositFee(
				lease.sd_status !== "none" ? lease.sd_amount ?? 0 : 0,
			);
			setInitialStartDate(format(parseISO(lease.start_date), "yyyy-MM-dd"));
			setInitialEndDate(format(parseISO(lease.end_date), "yyyy-MM-dd"));
			setLeaseExists(true);
		}
	}, [lease]);

	const [leaseExists, setLeaseExists] = useState(
		lease !== null && lease !== undefined,
	);

	const [isScheduleOpen, setIsScheduleOpen] = useState(false);
	const [rentAmount, setRentAmount] = useState<number>(lease?.rent_amount ?? 0);
	const [hasSecurityDeposit, setHasSecurityDeposit] = useState(
		lease ? lease?.sd_status !== "none" : false,
	);
	const [securityDepositFee, setSecurityDepositFee] = useState<number>(
		hasSecurityDeposit ? lease?.sd_amount ?? 0 : 0,
	);
	// const [fees, setFees] = React.useState<any[]>(propertyFees ?? []);
	// const [editFeeOpen, setEditFeeOpen] = React.useState(false);
	// const [feeEdit, setFeeEdit] = React.useState<Fee>();

	const defaultStartDate = addDays(new Date(), 1);
	const defaultEndDate = addYears(new Date(), 1);

	const [startDate, setStartDate] = useState<string>(
		lease
			? format(parseISO(lease.start_date), "yyyy-MM-dd")
			: format(defaultStartDate, "yyyy-MM-dd"),
	);
	const [endDate, setEndDate] = useState<string>(
		lease
			? format(parseISO(lease.end_date), "yyyy-MM-dd")
			: format(defaultEndDate, "yyyy-MM-dd"),
	);

	const [fadeOut, setFadeOut] = React.useState(false);
	const animationClass = fadeOut ? " animate__fadeOut" : "animate__fadeIn";

	const [initialRentAmount, setInitialRentAmount] = useState<number>(
		lease?.rent_amount ?? 0,
	);
	const [initialSecurityDepositFee, setInitialSecurityDepositFee] =
		useState<number>(hasSecurityDeposit ? lease?.sd_amount ?? 0 : 0);

	const [initialStartDate, setInitialStartDate] = useState<string>(
		lease ? format(parseISO(lease.start_date), "yyyy-MM-dd") : "",
	);
	const [initialEndDate, setInitialEndDate] = useState<string>(
		lease ? format(parseISO(lease.end_date), "yyyy-MM-dd") : "",
	);

	const [isButtonClicked, setIsButtonClicked] = useState(false);

	const hasChanges =
		(rentAmount !== initialRentAmount ||
			securityDepositFee !== initialSecurityDepositFee ||
			startDate !== initialStartDate ||
			endDate !== initialEndDate) &&
		rentAmount !== 0;

	const daysBetweenDates = daysBetween(parseISO(startDate), new Date());

	return (
		<>
			<Card className={` animate__faster w-full ${animationClass}`}>
				<form
					action={async (formData) => {
						setIsButtonClicked(true);
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
									mutate("lease");
								} catch (error) {
									setIsButtonClicked(false);
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
								loading: "Creating...",
								success: "Lease created",
								error:
									"An error occurred, please check the form and try again.",
							},
						);
					}}
				>
					<CardHeader>
						<Heading>Lease Details</Heading>
						<Text className="">
							Charges are billed on the start date, and then the first of each
							month. After the lease starts, this information cannot be changed.
						</Text>
					</CardHeader>
					<CardContent>
						<div className="relative space-y-4">
							<Headless.Field className="relative flex flex-col md:flex-row md:items-center md:gap-4">
								<Label className="mb-2 md:mb-0 md:w-40 md:flex-shrink-0">
									Lease start and end
								</Label>
								<div className="flex flex-grow flex-row gap-1 sm:gap-2 w-full md:flex-1">
									{isLoading ? (
										<>
											<Skeleton input={true} className="w-full" />
											<span className="hidden sm:flex text-gray-700 items-center justify-center select-none">
												-
											</span>
											<Skeleton input={true} className="w-full" />
										</>
									) : (
										<>
											<Input
												type="date"
												id="startDate"
												name="startDate"
												value={startDate}
												placeholder="MM/DD/YYYY"
												onChange={(e) => setStartDate(e.target.value)}
												min={format(new Date(), "yyyy-MM-dd")}
												required
												disabled={leaseExists || daysBetweenDates <= 0}
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
												disabled={leaseExists || daysBetweenDates <= 0}
											/>
										</>
									)}
								</div>
							</Headless.Field>

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
										{isLoading ? (
											<Skeleton input={true} className="" />
										) : (
											<>
												<span className="text-zinc-500 dark:text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 select-none pointer-events-none z-20">
													$
												</span>
												<Input
													id="rentAmount"
													name="rentAmount"
													placeholder="0"
													className="w-full flex-grow"
													autoComplete="off"
													value={rentAmount === 0 ? "" : rentAmount}
													onChange={(e) => {
														const value = e.target.value;
														const cleanedValue = value.replace(/[^0-9.]/g, "");
														const numericValue =
															Number.parseFloat(cleanedValue);
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
													disabled={leaseExists || daysBetweenDates <= 0}
												/>
											</>
										)}
									</InputGroup>
								</div>
							</Headless.Field>

							<Headless.Field className="relative flex flex-col md:flex-row md:items-center md:gap-4">
								<div className="mb-2 flex items-center justify-between md:mb-0 md:w-40 md:flex-shrink-0">
									<Label htmlFor="securityDeposit">Security deposit</Label>
									{isLoading ? (
										<Skeleton className="h-6 sm:h-7 w-10 sm:w-8" />
									) : (
										<Switch
											id="securityDeposit"
											name="securityDepositSwitch"
											color="blue"
											checked={hasSecurityDeposit}
											onChange={() => {
												setHasSecurityDeposit(!hasSecurityDeposit);
											}}
											disabled={leaseExists || daysBetweenDates <= 0}
										/>
									)}
								</div>
								{/* <AnimatePresence>
									{hasSecurityDeposit && (
										<motion.div
											className="flex-grow"
											initial={{ opacity: 0, height: 0 }}
											animate={{ opacity: 1, height: "auto" }}
											exit={{ opacity: 0, height: 0 }}
											transition={{ duration: 0.25 }}
										> */}
								<div className="flex-grow">
									<InputGroup className="w-full relative">
										{isLoading ? (
											<Skeleton input={true} className="" />
										) : (
											<>
												<span className="text-zinc-500 dark:text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 select-none pointer-events-none z-20">
													$
												</span>
												<Input
													inputMode="numeric"
													id="depositAmount"
													name="depositAmount"
													placeholder="0"
													disabled={
														!hasSecurityDeposit ||
														leaseExists ||
														daysBetweenDates <= 0
													}
													className="w-full flex-grow"
													autoComplete="off"
													value={
														securityDepositFee === 0 ? "" : securityDepositFee
													}
													required={hasSecurityDeposit}
													onChange={(e) => {
														const value = e.target.value;
														const cleanedValue = value.replace(/[^0-9.]/g, "");
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
											</>
										)}
									</InputGroup>
								</div>
								{/* </motion.div>
									)}
								</AnimatePresence> */}
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
						{/* {fees.length > 0 && (
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
						)} */}
						<input
							name="propertyId"
							defaultValue={propertyId}
							readOnly
							className="hidden"
						/>
						<div className="-mb-1 mt-6 flex justify-between">
							{/* <Button
								type="button"
								color="blue"
								onClick={() => setIsDialogOpen(true)}
							>
								Add Fee
							</Button> */}
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
								disabled={!hasChanges || leaseExists || isButtonClicked}
								// onClick={(e: React.MouseEvent) => {
								// 	e.preventDefault();
								// 	setIsButtonClicked(true);
								// }}
							>
								{isButtonClicked ? "Creating..." : "Create Lease"}
							</Button>
						</div>
					</CardFooter>
				</form>
			</Card>
			{/* <AddFeeDialog
				isOpen={isDialogOpen}
				onClose={() => setIsDialogOpen(false)}
				// fee={dialogFee}
				propertyId={propertyId}
				fees={fees}
				setFees={setFees}
				setCurrentProperty={setCurrentProperty}
			/> */}
			{/* {feeEdit && (
				<EditFeeDialog
					isOpen={editFeeOpen}
					onClose={() => setEditFeeOpen(false)}
					fee={feeEdit}
					fees={fees}
					setFees={setFees}
					setCurrentProperty={setCurrentProperty}
				/>
			)} */}
			{startDate && endDate && isScheduleOpen && (
				<BillingScheduleDialog
					isOpen={isScheduleOpen}
					onClose={() => setIsScheduleOpen(false)}
					startDate={parseISO(startDate)}
					endDate={parseISO(endDate)}
					rentAmount={rentAmount}
					hasSecurityDeposit={hasSecurityDeposit}
					securityDepositFee={securityDepositFee}
				/>
			)}
		</>
	);
}
