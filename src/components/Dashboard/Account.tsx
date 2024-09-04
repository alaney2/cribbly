"use client";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/catalyst/button";
import type {
	PlaidLinkError,
	PlaidLinkOnExitMetadata,
	PlaidLinkOptions,
} from "react-plaid-link";
import { usePlaidLink } from "react-plaid-link";
import { useState, useEffect } from "react";
import {
	Dialog,
	DialogActions,
	DialogBody,
	DialogDescription,
	DialogTitle,
} from "@/components/catalyst/dialog";
import { LockClosedIcon, StarIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { useSearchParams, usePathname } from "next/navigation";
import { RemoveBankDialog } from "@/components/Dashboard/RemoveBankDialog";
import "react-loading-skeleton/dist/skeleton.css";
import { Input } from "@/components/catalyst/input";
import { Divider } from "@/components/catalyst/divider";

export type PlaidAccount = {
	account_id: string;
	name: string;
	mask: string;
	use_for_payouts: boolean;
	user_id: string;
	account_number: string;
	routing_number: string;
	item_id: string;
	access_token: string;
	created_at: string;
	updated_at: string;
};

type AccountProps = {
	fullName: string;
	email: string;
	plaidAccounts: PlaidAccount[];
};

export function Account({ fullName, email, plaidAccounts }: AccountProps) {
	const [linkToken, setLinkToken] = useState<string | null>(null);
	const [isBankDialogOpen, setIsBankDialogOpen] = useState(false);
	const [isRemoveBankDialogOpen, setIsRemoveBankDialogOpen] = useState(false);
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const [editedName, setEditedName] = useState(fullName);
	const [bankDetails, setBankDetails] = useState("");
	const [accountId, setAccountId] = useState("");
	const [bankAccounts, setBankAccounts] =
		useState<PlaidAccount[]>(plaidAccounts);

	const handleSaveName = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) => {
		e.preventDefault();
		const supabase = createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			return;
		}
		if (editedName.trim() === "") {
			return;
		}
		const { error } = await supabase
			.from("users")
			.update({ full_name: editedName })
			.eq("id", user.id);

		if (error) {
			console.error(error);
			toast.error(error.message);
		}
	};

	const handleCancelEditName = () => {
		setEditedName(fullName);
	};

	const setPrimaryAccount = async (accountId: string) => {
		const supabase = createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			return;
		}

		// First, set all accounts to not be primary
		await supabase
			.from("plaid_accounts")
			.update({ use_for_payouts: false })
			.eq("user_id", user.id);

		// Then, set the selected account as primary
		const { error } = await supabase
			.from("plaid_accounts")
			.update({ use_for_payouts: true })
			.eq("account_id", accountId);

		if (error) {
			console.error(error);
			toast.error("Failed to set primary account");
		} else {
			const updatedAccounts = bankAccounts.map((account) => {
				if (account.account_id === accountId) {
					return { ...account, use_for_payouts: true };
				}
				return { ...account, use_for_payouts: false };
			});
			setBankAccounts(updatedAccounts);
			toast.success("Primary account updated");
		}
	};

	const generateToken = async () => {
		if (searchParams.has("oauth_state_id")) {
			const link_token = localStorage.getItem("link_token");
			if (!link_token) {
				console.error("Link token not found");
				return;
			}
			setLinkToken(link_token);
			return;
		}
		const response = await fetch("/api/plaid/create_link_token", {
			method: "POST",
		});
		if (!response.ok) {
			console.error("Failed to create link token");
			return;
		}
		const data = await response.json();
		localStorage.setItem("link_token", data.link_token);
		setLinkToken(data.link_token);
	};

	const onSuccess = async (publicToken: string) => {
		toast.promise(
			async () => {
				// Send the public_token to server to exchange for an access_token
				const response = await fetch("/api/plaid/set_access_token", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ publicToken }),
				});
				if (!response.ok) {
					// Handle error
					console.error("Failed to exchange public token for access token");
					throw new Error("Failed to exchange public token for access token");
				}
				const { success, accountId } = await response.json();

				localStorage.removeItem("link_token");
				setLinkToken(null);

				const supabase = createClient();
				const {
					data: { user },
				} = await supabase.auth.getUser();

				if (!user) {
					return;
				}

				const { data: existingAccounts } = await supabase
					.from("plaid_accounts")
					.select("*")
					.eq("user_id", user.id)
					.order("use_for_payouts", { ascending: false });

				setBankAccounts(existingAccounts || []);

				if (existingAccounts && existingAccounts.length === 1) {
					// This is the first account, set it as primary
					await setPrimaryAccount(accountId);
				}

				return success;
			},
			{
				loading: "Linking bank account...",
				success: (success) => success,
				error: (error) => error,
			},
		);
	};

	const config: PlaidLinkOptions = {
		token: linkToken,
		onSuccess,
		onExit: (
			error: PlaidLinkError | null,
			metadata: PlaidLinkOnExitMetadata,
		) => {
			localStorage.removeItem("link_token");
			setLinkToken(null);
			if (error) {
				toast.error("Bank account linking failed");
			}
		},
	};

	if (searchParams.has("oauth_state_id")) {
		config.receivedRedirectUri = pathname;
	}

	const { open, ready } = usePlaidLink(config);

	useEffect(() => {
		if (linkToken && ready) {
			open();
		}
	}, [linkToken, ready, open]);

	return (
		<div className="relative justify-center flex">
			<main className="px-4 py-4 sm:px-6 flex-auto lg:px-4 lg:py-4 max-w-7xl">
				<div className="w-full space-y-16 sm:space-y-20">
					<div>
						<h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-neutral-200">
							Profile
						</h2>
						<Divider className="my-6" />
						<dl className="mt-6 space-y-6 text-sm leading-6">
							<div className="pt-6 sm:flex">
								<dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6 dark:text-neutral-300">
									Full name
								</dt>
								<dd className="flex-auto">
									<>
										<form className="mt-1.5 sm:mt-0 justify-between gap-x-6 sm:items-center">
											<Input
												type="text"
												value={editedName}
												name="name"
												id="name"
												onChange={(e) => setEditedName(e.target.value)}
												className="w-full rounded-lg text-base sm:text-sm"
											/>
											<div className="flex gap-x-2 justify-end my-4">
												<Button
													type="button"
													outline
													onClick={handleCancelEditName}
													className="text-sm"
													disabled={editedName === fullName}
												>
													Cancel
												</Button>
												<Button
													type="submit"
													color="blue"
													onClick={handleSaveName}
													className="text-sm"
													disabled={editedName === fullName}
												>
													Save
												</Button>
											</div>
										</form>
									</>
								</dd>
							</div>
							<div className="pt-6 sm:flex">
								<dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6 dark:text-neutral-300">
									Email address
								</dt>
								<dd className="mt-1 flex sm:mt-0 sm:flex-auto">
									<Input
										className="disabled cursor-default pointer-events-none"
										placeholder={email}
									/>
								</dd>
							</div>
						</dl>
					</div>

					<div>
						<h2 className="text-base font-semibold leading-7 text-gray-900">
							Bank accounts
						</h2>
						<p className="mt-1 text-sm leading-6 text-gray-500 dark:text-neutral-200">
							Connect bank accounts to your account
						</p>
						{/* <Divider className="mt-6" /> */}
						<ul className="mt-6 text-sm leading-6">
							{bankAccounts?.map((bank_account) => (
								<li key={bank_account.account_id} className="">
									<Divider key={bank_account.account_id} />
									<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-y-2 md:gap-x-6 py-6">
										<div className="font-medium text-gray-700 dark:text-neutral-300 flex items-center">
											{bank_account.name} ••••{bank_account.mask}
											{bank_account.use_for_payouts && (
												<StarIcon
													className="h-5 w-5 text-yellow-400 ml-2"
													aria-hidden="true"
												/>
											)}
										</div>
										<div className="flex justify-between md:justify-end items-center space-x-4">
											{!bank_account.use_for_payouts && (
												<button
													type="button"
													className="text-sm md:px-2 font-semibold text-blue-600 hover:text-blue-500"
													onClick={() =>
														setPrimaryAccount(bank_account.account_id)
													}
												>
													Set as primary
												</button>
											)}
											{!bank_account.use_for_payouts && (
												<button
													type="button"
													className="md:px-2 font-semibold text-red-600 hover:text-red-500"
													onClick={() => {
														setBankDetails(
															`${bank_account.name} ••••${bank_account.mask}`,
														);
														setAccountId(bank_account.account_id);
														setIsRemoveBankDialogOpen(true);
													}}
												>
													Remove{" "}
													<span className="hidden sm:inline">account</span>
												</button>
											)}
										</div>
									</div>
								</li>
							))}
						</ul>
						<RemoveBankDialog
							isOpen={isRemoveBankDialogOpen}
							setIsOpen={setIsRemoveBankDialogOpen}
							bank_details={bankDetails}
							account_id={accountId}
							bankAccounts={bankAccounts}
							setBankAccounts={setBankAccounts}
						/>
						<Divider />
						<div className="flex pt-6">
							<Button
								type="button"
								plain
								className="text-blue-600 hover:text-blue-500"
								onClick={() => setIsBankDialogOpen(true)}
							>
								<span aria-hidden="true">+</span> Add an account
							</Button>
						</div>
					</div>
				</div>
				<Dialog open={isBankDialogOpen} onClose={setIsBankDialogOpen}>
					<div className="flex items-center gap-x-4 mb-4">
						<LockClosedIcon className="w-6 text-gray-500" />
						<DialogTitle className="text-xl font-semibold">
							Link Bank Account
						</DialogTitle>
					</div>
					<DialogDescription className="mb-4">
						In order to verify your bank account information, you will be
						redirected to our third-party partner, Plaid.
					</DialogDescription>
					<DialogDescription>
						The transfer of your data is encrypted end-to-end and your
						credentials will never be made accessible to Cribbly.
					</DialogDescription>
					<DialogActions>
						<Button plain onClick={() => setIsBankDialogOpen(false)}>
							Cancel
						</Button>
						<Button
							color="blue"
							onClick={async () => {
								await generateToken();
								setIsBankDialogOpen(false);
							}}
						>
							Continue
						</Button>
					</DialogActions>
				</Dialog>
			</main>
		</div>
	);
}
