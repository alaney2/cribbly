"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/catalyst/button";
import { setPrimaryAccount } from "@/utils/supabase/actions";
import { PlaidLinkButton } from "@/components/PlaidLinkButton";
import { Select } from "@/components/catalyst/select";
import { LinkConfirmDialog } from "@/components/dialogs/LinkConfirmDialog";

type BankSelectProps = {
	plaidAccounts: any[] | null;
	setIsBankSelected?: (isBankSelected: boolean) => void;
	setIsDialogOpen?: (isDialogOpen: boolean) => void;
};

export function BankSelect({
	plaidAccounts,
	setIsBankSelected,
	setIsDialogOpen,
}: BankSelectProps) {
	const [banks, setBanks] = useState<any[]>(plaidAccounts || []);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedBank, setSelectedBank] = useState<any | null>(
		banks.filter((bank) => bank.use_for_payouts)[0] || null,
	);
	const [isLinkConfirmDialogOpen, setIsLinkConfirmDialogOpen] = useState(false);
	const [buttonDisabled, setButtonDisabled] = useState(false);

	useEffect(() => {
		if (plaidAccounts) {
			setBanks(plaidAccounts);
		}
		setIsLoading(false);
	}, [plaidAccounts]);

	const handlePlaidSuccess = (newAccounts: any[]) => {
		setBanks(newAccounts);
		if (newAccounts.length > 0) {
			const primaryAccount =
				newAccounts.find((account) => account.use_for_payouts) ||
				newAccounts[0];
			setSelectedBank(primaryAccount);
			setIsBankSelected?.(true);
			setPrimaryAccount(primaryAccount.account_id);
			setIsLinkConfirmDialogOpen(false);
		}
	};

	const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const value = event.target.value;
		if (value === "add_bank") {
			setIsLinkConfirmDialogOpen(true);
			event.target.value = "";
			return;
		}
		const selected = banks.find((bank) => bank.name === value);
		setIsBankSelected?.(true);
		setSelectedBank(selected);
		setPrimaryAccount(selected.account_id);
	};

	useEffect(() => {
		setIsBankSelected?.(!!selectedBank);
	}, [selectedBank, setIsBankSelected]);

	const handlePlaidLinkClick = () => {};

	return (
		<>
			{!isLoading && (
				<Select
					name="bank-select"
					defaultValue=""
					value={selectedBank?.name || ""}
					onChange={handleChange}
				>
					<option value="" disabled>
						Select a bank&hellip;
					</option>
					{banks.map((bank) => (
						<option key={bank.account_id} value={bank.name}>
							{bank.name}
						</option>
					))}
					<option value="add_bank">Add bank +</option>
				</Select>
			)}
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
							<Button color="blue" disabled={buttonDisabled}>
								Continue
							</Button>
						</PlaidLinkButton>
					</>
				}
			/>
		</>
	);
}
