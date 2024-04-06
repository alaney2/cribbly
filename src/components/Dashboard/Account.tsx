"use client"
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/catalyst/button';
import { PlaidLinkError, PlaidLinkOnExitMetadata, PlaidLinkOptions, usePlaidLink } from 'react-plaid-link';
import { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/catalyst/dialog'
import { LockClosedIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useSearchParams, usePathname } from 'next/navigation'
import useSWR, { useSWRConfig } from 'swr';
import { Spinner } from '@/components/FuelSpinner'
import { RemoveBankDialog } from '@/components/Dashboard/RemoveBankDialog'

const fetcher = async () => {
  const supabase = createClient();
  let { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    toast.error("User not found")
  }
  const { data, error } = await supabase.from('users')
    .select()
    .eq('id', user!.id)
    .single()

  if (error) {
    throw error;
  }
  return data;
};

const bankFetcher = async () => {
  const supabase = createClient();
  let { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    toast.error("User not found")
  }
  const { data, error } = await supabase.from('plaid_accounts')
    .select()
    .eq('user_id', user?.id)

  if (error) {
    throw error;
  }
  console.log(data)
  return data
}

export function Account() {
  const { mutate } = useSWRConfig()
  const { data: user_data, error, isLoading } = useSWR('user_data', fetcher);
  const { data: bank_data, error: bankError, isLoading: bankIsLoading} = useSWR('bank_accounts_data', bankFetcher)
  const [linkToken, setLinkToken] = useState<string | null>(null);
  let [isBankDialogOpen, setIsBankDialogOpen] = useState(false)
  let [isRemoveBankDialogOpen, setIsRemoveBankDialogOpen] = useState(false)
  const [isBankDetailsLoading, setIsBankDetailsLoading] = useState(false);

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(user_data?.full_name || '');
  const [bankDetails, setBankDetails] = useState('')
  const [accountId, setAccountId] = useState('')

  useEffect(() => {
    setEditedName(user_data?.full_name || '')
  }, [isLoading, user_data])

  if (error) toast.error(error)
  if (bankError) toast.error(bankError)

  const handleEditName = () => {
    setIsEditingName(true);
    setEditedName(user_data?.full_name || '');
  };

  const handleSaveName = async (e: any) => {
    e.preventDefault()
    const supabase = createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) {
      return
    }
    if (editedName.trim() === '') {
      return
    }
    const { error } = await supabase
      .from('users')
      .update({ full_name: editedName })
      .eq('id', user.id);

    mutate('user_data')

    if (error) {
      console.error(error);
      toast.error(error.message)
    }
    setIsEditingName(false);
  };

  const handleCancelEditName = () => { 
    setIsEditingName(false);
    setEditedName(user_data?.full_name || '');
  };

  const generateToken = async () => {
    if (searchParams.has('oauth_state_id')) {
      const link_token = localStorage.getItem('link_token')
      if (!link_token) {
        console.error('Link token not found');
        return;
      }
      setLinkToken(link_token);
      return;
    } 
    const response = await fetch('/api/plaid/create_link_token', {
      method: 'POST',
    });
    if (!response.ok) {
      console.error('Failed to create link token');
      return;
    }
    const data = await response.json();
    localStorage.setItem('link_token', data.link_token)
    setLinkToken(data.link_token);
  };


  const onSuccess = async (publicToken: string) => {
    setIsBankDetailsLoading(true);
    // Send the public_token to your server to exchange for an access_token
    const response = await fetch('/api/plaid/set_access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicToken }),
    });
    mutate('bank_accounts_data')
    if (!response.ok) {
      // Handle error
      console.error('Failed to exchange public token for access token');
      setIsBankDetailsLoading(false);
      return;
    }
    const { error, success } = await response.json();
    localStorage.removeItem('link_token');
    setIsBankDetailsLoading(false);
    if (error) {
      toast.error(error);
    } else {
      toast.success(success);
    }
  };

  const config: PlaidLinkOptions = {
    token: linkToken,
    onSuccess,
    onExit: (error: PlaidLinkError | null, metadata: PlaidLinkOnExitMetadata) => {
      if (error) {
        toast.error('Bank account linking failed');
      }
      localStorage.removeItem('link_token');
    },
  };

  if (searchParams.has('oauth_state_id')) {
    config.receivedRedirectUri = pathname
  }

  const { open, ready } = usePlaidLink(config);

  useEffect(() => {
    if (linkToken && ready) {
      open();
    }
  }, [linkToken, ready, open]);

  return (
    <div className="p-6 md:p-8 content-container">
      {(isLoading || bankIsLoading) ? (
        <Spinner />
    ) : (
      <main className="px-4 py-4 sm:px-6 lg:flex-auto lg:px-4 lg:py-4">
        <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Profile</h2>
            <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
              <div className="pt-6 sm:flex h-20 sm:h-14 sm:items-center">
                <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Full name</dt>
                <dd className="flex-auto">
                {isEditingName ? (
                  <>
                    <form className="mt-1.5 sm:mt-0 h-14 flex justify-between gap-x-6 sm:items-center">
                      <input
                        type="text"
                        value={editedName}
                        name="name"
                        id="name"
                        onChange={(e) => setEditedName(e.target.value)}
                        className="w-full rounded-lg h-2/3 text-base md:text-sm p-0 sm:-ml-3 px-3 ring-inset ring-1 ring-gray-300 border-none shadow-sm focus:ring-2 focus:ring-blue-500/90"
                      />
                      <div className="flex gap-x-2">
                        <button type="submit" onClick={handleSaveName} className="font-semibold text-gray-100 bg-blue-600 hover:bg-blue-500 h-2/3 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                          Save
                        </button>
                        <button type="button" onClick={handleCancelEditName} className="font-semibold text-gray-700 px-2 py-1 sm:py-1.5 h-2/3 hover:bg-gray-100 rounded-lg">
                          Cancel
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <>
                    <div className="mt-1.5 sm:mt-0 flex justify-between gap-x-6 sm:items-center">
                      <div className="text-gray-900">{editedName}</div>
                      <button type="button" className="font-semibold text-blue-600 hover:text-blue-500 px-2" onClick={handleEditName}>
                        Update
                      </button>
                    </div>
                  </>
                )}
                </dd>
              </div>
              <div className="pt-6 sm:flex">
                <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                  Email address</dt>
                <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                  <div className="text-gray-900">{user_data?.email}</div>
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Bank accounts</h2>
            <p className="mt-1 text-sm leading-6 text-gray-500">Connect bank accounts to your account.</p>

            <ul role="list" className="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
              {isBankDetailsLoading ? (
                <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded-md max-w-72 min-w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded-md max-w-60 min-w-40"></div>
              </div>
              ): null}
              
              {bank_data?.map((bank_account) => 
                <li key={bank_account.account_id} className="flex justify-between gap-x-6 py-6">
                  <div className="font-medium text-gray-700">
                    {bank_account.name} ••••{bank_account.mask}
                  </div>
                  <button type="button" className="px-2 font-semibold text-red-600 hover:text-red-500" 
                  onClick={() => {
                    setBankDetails(`${bank_account.name} ••••${bank_account.mask}`)
                    setAccountId(bank_account.account_id)
                    setIsRemoveBankDialogOpen(true)}
                  }>
                    Remove account
                  </button>
                </li>
              )}
              
            </ul> 
            <RemoveBankDialog isOpen={isRemoveBankDialogOpen} setIsOpen={setIsRemoveBankDialogOpen} bank_details={bankDetails} account_id={accountId} />
            <div className="flex border-t border-gray-100 pt-6">
              <Button type="button" plain className="text-blue-600 hover:text-blue-500"
                onClick={() => setIsBankDialogOpen(true)}
              >
                <span aria-hidden="true">+</span> Add another bank
              </Button>
            </div>
          </div>
        </div>
        {/* <Button type="button" color="blue" onClick={async () => { fetch('/api/plaid/get_bank_name') }}>
          Bank name
        </Button> */}
        <Dialog open={isBankDialogOpen} onClose={setIsBankDialogOpen}>
          <div className="flex items-center gap-x-4 mb-4">
            <LockClosedIcon className="w-6 text-gray-500" />
            <DialogTitle className="text-xl font-semibold">Link Bank Account</DialogTitle>
          </div>
          <DialogDescription className="mb-4">
            In order to verify your bank account information, you will be redirected to our third-party partner, Plaid.
          </DialogDescription>
          <DialogDescription>
            The transfer of your data is encrypted end-to-end and your credentials will never be made accessible to Cribbly.
          </DialogDescription>
          <DialogActions>
            <Button plain onClick={() => setIsBankDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              color='blue'
              onClick={async () => {
                if (!linkToken) {
                  await generateToken();
                }
                setIsBankDialogOpen(false);
              }}
            >
              Continue
            </Button>
          </DialogActions>
        </Dialog>
      </main>
    )}
    </div>
  );
}
