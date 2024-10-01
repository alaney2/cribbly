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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/catalyst/table";
import { calculateRentDates } from "@/utils/helpers";
import { format } from "date-fns";

type BillingScheduleDialogProps = {
	isOpen: boolean;
	onClose: () => void;
	startDate: Date;
	endDate: Date;
	rentAmount: number;
	hasSecurityDeposit: boolean;
	securityDepositFee: number;
};

export function BillingScheduleDialog({
	isOpen,
	onClose,
	startDate,
	endDate,
	rentAmount,
	hasSecurityDeposit,
	securityDepositFee,
}: BillingScheduleDialogProps) {
	const isMobile = useMediaQuery("(max-width: 640px)");
	const [isMounted, setIsMounted] = useState(false);
	const { rentDates, totalRent } = calculateRentDates(
		startDate,
		endDate,
		rentAmount,
	);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	const renderTableContent = () => (
		<Table bleed>
			<TableHead>
				<TableRow>
					<TableHeader>Date</TableHeader>
					<TableHeader className="text-right">Amount</TableHeader>
				</TableRow>
			</TableHead>
			<TableBody>
				{rentDates.map((rentDate, index) => (
					<TableRow key={String(rentDate.date)}>
						<TableCell>{format(rentDate.date, "MM/dd/yyyy")}</TableCell>
						<TableCell className="text-right text-zinc-500">
							$
							{rentDate.amount +
								(index === 0 && hasSecurityDeposit
									? Number(securityDepositFee) || 0
									: 0)}{" "}
							{index === 0 &&
								hasSecurityDeposit &&
								securityDepositFee &&
								"(incl. security deposit)"}
						</TableCell>
					</TableRow>
				))}
				<TableRow>
					<TableCell className="font-bold">Total charged</TableCell>
					<TableCell className="text-right font-bold">${totalRent}</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	);

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
								<Subheading level={1}>Billing Schedule</Subheading>
							</Drawer.Title>
							<Drawer.Description
								asChild
								className="leading-6 mt-2 text-gray-600"
							>
								<Text>
									The following table outlines the billing schedule, indicating
									the specific dates when the corresponding amounts will be
									charged to the tenant(s).
								</Text>
							</Drawer.Description>
							<form>
								<DialogBody>{renderTableContent()}</DialogBody>
								<DialogActions className="flex w-full items-center justify-between">
									<Button type="button" outline onClick={() => onClose()}>
										Close
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
				<DialogTitle>Billing Schedule</DialogTitle>
				<DialogDescription>
					The following table outlines the billing schedule, indicating the
					specific dates when the corresponding amounts will be charged to the
					tenant(s). Prorated amounts are included if the lease starts or ends
					in the middle of the month.
				</DialogDescription>
				<form>
					<DialogBody>{renderTableContent()}</DialogBody>
					<DialogActions className="flex w-full items-center justify-between">
						<Button
							type="button"
							outline
							onClick={() => {
								onClose();
							}}
						>
							Close
						</Button>
					</DialogActions>
				</form>
			</Dialog>
		</>
	);
}
