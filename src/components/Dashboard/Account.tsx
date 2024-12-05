"use client";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/catalyst/button";
import { useState, useEffect } from "react";
import { StarIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { RemoveBankDialog } from "@/components/Dashboard/RemoveBankDialog";
import { Input } from "@/components/catalyst/input";
import { Divider } from "@/components/catalyst/divider";
import { PlaidLinkButton } from "@/components/PlaidLinkButton";
import { LinkConfirmDialog } from "@/components/dialogs/LinkConfirmDialog";
import { TellerConnectButton } from "../teller/TellerConnectButton";
import useSWR from "swr";
import { Text, Strong } from "@/components/catalyst/text";

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
};

const userFetcher = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not found");

  const { data, error } = await supabase
    .from("users")
    .select("full_name, email")
    .eq("id", user.id)
    .single();

  if (error) throw error;
  return data;
};

const fetcher = async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not found");

  const { data, error } = await supabase
    .from("bank_accounts")
    .select("*")
    .eq("user_id", user.id);

  if (error) throw error;
  return data;
};

export function Account() {
  const {
    data: userData,
    error: userError,
    mutate: userMutate,
  } = useSWR("user", userFetcher);
  const [isRemoveBankDialogOpen, setIsRemoveBankDialogOpen] = useState(false);
  // const [editedName, setEditedName] = useState(fullName);
  // const [savedName, setSavedName] = useState(fullName);
  const [editedName, setEditedName] = useState("");
  const [savedName, setSavedName] = useState("");

  const [bankDetails, setBankDetails] = useState("");
  const [accountId, setAccountId] = useState("");
  const [isLinkConfirmDialogOpen, setIsLinkConfirmDialogOpen] = useState(false);
  const [isSaveButtonEnabled, setIsSaveButtonEnabled] = useState(false);

  useEffect(() => {
    if (userData) {
      setEditedName(userData.full_name);
      setSavedName(userData.full_name);
    }
  }, [userData]);

  useEffect(() => {
    setIsSaveButtonEnabled(
      editedName.trim() !== savedName && editedName.trim() !== ""
    );
  }, [editedName, savedName]);

  const {
    data: bankAccounts,
    error,
    mutate,
  } = useSWR("bank_accounts", fetcher);

  const handleSaveName = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const loading = toast.loading("Saving...");
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
    toast.dismiss(loading);
    toast.success("Name saved");
    setSavedName(editedName.trim());
    setIsSaveButtonEnabled(false);
  };

  const handleCancelEditName = () => {
    setEditedName(savedName);
    setIsSaveButtonEnabled(false);
  };

  const handlePlaidSuccess = (newAccounts: PlaidAccount[]) => {
    setIsLinkConfirmDialogOpen(false);
    mutate();
  };

  const handleTellerSuccess = (newAccounts: any[]) => {
    setIsLinkConfirmDialogOpen(false);
    mutate();
    console.log("newAccounts", newAccounts);
  };

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
                          disabled={!isSaveButtonEnabled}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          color="blue"
                          onClick={handleSaveName}
                          className="text-sm"
                          disabled={!isSaveButtonEnabled}
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
                    placeholder={userData?.email}
                  />
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-neutral-200">
              Bank accounts
            </p>

            <ul className="mt-6 text-sm leading-6">
              {bankAccounts?.map((bank_account) => (
                <li key={bank_account.account_id} className="">
                  <Divider key={bank_account.account_id} />
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-y-2 md:gap-x-6 py-6">
                    <Text>
                      {bank_account.institution_name} - {bank_account.name}
                      <span className="ml-2">
                        <Strong>•••• {bank_account.last_four}</Strong>
                      </span>
                    </Text>
                    <div className="flex justify-between md:justify-end items-center space-x-4">
                      <button
                        type="button"
                        className="md:px-2 font-semibold text-red-600 hover:text-red-500"
                        onClick={() => {
                          setBankDetails(
                            `${bank_account.institution_name} ${bank_account.name} ••••${bank_account.last_four}`
                          );
                          setAccountId(bank_account.account_id);
                          setIsRemoveBankDialogOpen(true);
                        }}
                      >
                        Remove <span className="hidden sm:inline">account</span>
                      </button>
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
              mutate={mutate}
            />
            <Divider />
            <div className="flex pt-6">
              <Button
                type="button"
                plain
                className="text-blue-600 hover:text-blue-500"
                onClick={() => setIsLinkConfirmDialogOpen(true)}
              >
                <span aria-hidden="true">+</span> Add an account
              </Button>
              <LinkConfirmDialog
                isOpen={isLinkConfirmDialogOpen}
                setIsOpen={setIsLinkConfirmDialogOpen}
                dialogActions={
                  <>
                    <Button
                      plain
                      onClick={() => setIsLinkConfirmDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    {/* <PlaidLinkButton
											onSuccess={(newAccounts) => {
												handlePlaidSuccess(newAccounts);
												setIsLinkConfirmDialogOpen(false);
											}}
											onClick={() => {
												setIsLinkConfirmDialogOpen(false);
											}}
										>
											<Button color="blue">Continue</Button>
										</PlaidLinkButton> */}
                    <TellerConnectButton
                      onSuccess={handleTellerSuccess}
                      onClick={() => {
                        setIsLinkConfirmDialogOpen(false);
                      }}
                    >
                      <Button color="blue">Continue</Button>
                    </TellerConnectButton>
                  </>
                }
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
