"use client";
import { useState } from "react";
import {
	Listbox,
	ListboxLabel,
	ListboxOption,
} from "@/components/catalyst/listbox";
import { setPrimaryAccount } from "@/utils/supabase/actions";
import { PlaidLinkButton } from "@/components/PlaidLinkButton";

export function BankSelect({ plaidAccounts }: { plaidAccounts: any[] | null }) {
	const [banks, setBanks] = useState<any[]>(plaidAccounts || []);
	const [selectedBank, setSelectedBank] = useState<any | null>(
		banks.filter((bank) => bank.use_for_payouts)[0] || null,
	);

	const handlePlaidSuccess = (newAccounts: any[]) => {
		setBanks(newAccounts);
		if (newAccounts.length > 0) {
			const primaryAccount =
				newAccounts.find((account) => account.use_for_payouts) ||
				newAccounts[0];
			setSelectedBank(primaryAccount);
			setPrimaryAccount(primaryAccount.account_id);
		}
	};

	return (
		<>
			<Listbox
				name="bank-select"
				value={selectedBank?.name}
				placeholder="Select bank..."
				onChange={(value) => {
					if (value === "Add bank") {
						return;
					}
					const selected = banks.find((bank) => bank.name === value);
					setSelectedBank(selected);
					setPrimaryAccount(selected.account_id);
				}}
			>
				{banks.map((bank) => (
					<ListboxOption key={bank.account_id} value={bank.name}>
						<ListboxLabel>{bank.name}</ListboxLabel>
					</ListboxOption>
				))}
				<ListboxOption value="Add bank" className="">
					<PlaidLinkButton onSuccess={handlePlaidSuccess}>
						<ListboxLabel className="mr-2 font-medium">Add bank +</ListboxLabel>
					</PlaidLinkButton>
				</ListboxOption>
			</Listbox>
		</>
	);
}
