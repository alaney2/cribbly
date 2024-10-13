"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/catalyst/button";
import {
	setPrimaryAccount,
	getPlaidAccounts,
	setBankForProperty,
} from "@/utils/supabase/actions";
import { PlaidLinkButton } from "@/components/PlaidLinkButton";
import { Select } from "@/components/catalyst/select";
import { LinkConfirmDialog } from "@/components/dialogs/LinkConfirmDialog";
import useSWR, { mutate } from "swr";
import { createClient } from "@/utils/supabase/client";
import { Skeleton } from "@/components/catalyst/skeleton";
import { TellerConnectButton } from "@/components/teller/TellerConnectButton";
import { useCurrentProperty } from "@/contexts/CurrentPropertyContext";

type BankSelectProps = {
	setIsBankSelected?: (isBankSelected: boolean) => void;
};

const fetchBankAccounts = async () => {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return;
	const { data, error } = await supabase
		.from("bank_accounts")
		.select("*")
		.eq("user_id", user.id);
	if (error) throw error;
	return data;
};

const fetchPropertyBankAccount = async (propertyId: string) => {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("properties")
		.select("account_id")
		.eq("id", propertyId)
		.single();
	if (error) throw error;
	return data?.account_id;
};

export function BankSelect({ setIsBankSelected }: BankSelectProps) {
	const {
		data: bankAccounts,
		error: bankAccountsError,
		isLoading,
		mutate,
	} = useSWR(["bankAccounts"], () => fetchBankAccounts());
	const { currentPropertyId } = useCurrentProperty();

	const { data: propertyBankAccountId, isLoading: isSelectedLoading } = useSWR(
		["propertyBankAccount", currentPropertyId],
		() => fetchPropertyBankAccount(currentPropertyId),
	);

	const [selectedBank, setSelectedBank] = useState<any | null>(null);

	const [isLinkConfirmDialogOpen, setIsLinkConfirmDialogOpen] = useState(false);

	const handlePlaidSuccess = async (newAccounts: any[]) => {
		const newAccount = newAccounts[0];
		setSelectedBank(newAccount);
		if (currentPropertyId) {
			await setBankForProperty(currentPropertyId, newAccount.account_id);
		}
		mutate();
	};

	const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
		const value = event.target.value;
		if (value === "add_bank") {
			setIsLinkConfirmDialogOpen(true);
			return;
		}
		const selected = bankAccounts?.find((bank) => bank.account_id === value);
		console.log("selected", selected);
		setSelectedBank(selected);
		if (selected && currentPropertyId) {
			await setBankForProperty(currentPropertyId, selected.account_id);
		}
		mutate();
	};

	const handlePlaidLinkClick = () => {
		setIsLinkConfirmDialogOpen(false);
	};

	useEffect(() => {
		if (bankAccounts && propertyBankAccountId) {
			const matchingBank = bankAccounts.find(
				(bank) => bank.account_id === propertyBankAccountId,
			);
			if (matchingBank) {
				setSelectedBank(matchingBank);
			}
		}
	}, [bankAccounts, propertyBankAccountId]);

	return (
		<>
			{isLoading || isSelectedLoading ? (
				<Skeleton input={true} />
			) : (
				<Select
					name="bank-select"
					value={selectedBank?.account_id || ""}
					onChange={handleChange}
				>
					<option value="" disabled>
						Select a bank&hellip;
					</option>
					{bankAccounts?.map((bank) => (
						<option key={bank.account_id} value={bank.account_id}>
							{bank.institution_name} {bank.name} •••• {bank.last_four}
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
						{/* <PlaidLinkButton
							onSuccess={handlePlaidSuccess}
							onClick={handlePlaidLinkClick}
						>
							<Button color="blue">Continue</Button>
						</PlaidLinkButton> */}
						<TellerConnectButton
							onSuccess={handlePlaidSuccess}
							onClick={handlePlaidLinkClick}
						>
							<Button color="blue">Continue</Button>
						</TellerConnectButton>
					</>
				}
			/>
		</>
	);
}
