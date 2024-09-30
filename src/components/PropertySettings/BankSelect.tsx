"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/catalyst/button";
import { setPrimaryAccount, getPlaidAccounts } from "@/utils/supabase/actions";
import { PlaidLinkButton } from "@/components/PlaidLinkButton";
import { Select } from "@/components/catalyst/select";
import { LinkConfirmDialog } from "@/components/dialogs/LinkConfirmDialog";
import useSWR from "swr";

type BankSelectProps = {
	plaidAccounts: any[] | null;
	setIsBankSelected?: (isBankSelected: boolean) => void;
};

export function BankSelect({
	plaidAccounts,
	setIsBankSelected,
}: BankSelectProps) {
	const { data: banks, mutate } = useSWR("plaidAccounts", getPlaidAccounts, {
		fallbackData: plaidAccounts || [],
	});
	const [selectedBank, setSelectedBank] = useState<any | null>(null);

	const [isLinkConfirmDialogOpen, setIsLinkConfirmDialogOpen] = useState(false);

	useEffect(() => {
		if (banks) {
			const primaryBank =
				banks.find((bank) => bank.use_for_payouts) || banks[0];
			setSelectedBank(primaryBank);
		}
	}, [banks]);

	const handlePlaidSuccess = (newAccounts: any[]) => {
		mutate();
		setSelectedBank(newAccounts[0]);
	};

	const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const value = event.target.value;
		if (value === "add_bank") {
			setIsLinkConfirmDialogOpen(true);
			event.target.value = "";
			return;
		}
		const selected = banks?.find((bank) => bank.name === value);
		setIsBankSelected?.(true);
		setSelectedBank(selected);
		setPrimaryAccount(selected.account_id);
	};

	useEffect(() => {
		setIsBankSelected?.(!!selectedBank);
	}, [selectedBank, setIsBankSelected]);

	const handlePlaidLinkClick = () => {
		setIsLinkConfirmDialogOpen(false);
	};

	return (
		<>
			<Select
				name="bank-select"
				defaultValue=""
				value={selectedBank?.name || ""}
				onChange={handleChange}
			>
				<option value="" disabled>
					Select a bank&hellip;
				</option>
				{banks?.map((bank) => (
					<option key={bank.account_id} value={bank.name}>
						{bank.name}
					</option>
				))}
				<option value="add_bank">Add bank +</option>
			</Select>

			<LinkConfirmDialog
				isOpen={isLinkConfirmDialogOpen}
				setIsOpen={setIsLinkConfirmDialogOpen}
				dialogActions={
					<>
						<Button plain onClick={() => setIsLinkConfirmDialogOpen(false)}>
							Cancel
						</Button>
						<PlaidLinkButton
							onSuccess={handlePlaidSuccess}
							onClick={handlePlaidLinkClick}
						>
							<Button color="blue">Continue</Button>
						</PlaidLinkButton>
					</>
				}
			/>
		</>
	);
}
