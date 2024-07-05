"use client"
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/catalyst/button';
import { PlaidLinkError, PlaidLinkOnExitMetadata, PlaidLinkOptions, usePlaidLink } from 'react-plaid-link';
import { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/catalyst/dialog'
import { LockClosedIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner'
import { useSearchParams, usePathname } from 'next/navigation'
import useSWR, { useSWRConfig } from 'swr';
import { Spinner } from '@/components/Spinners/FuelSpinner'
import { RemoveBankDialog } from '@/components/Dashboard/RemoveBankDialog'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Input } from '@/components/ui/input'
import { Button as ShadButton } from '@/components/ui/button'

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
    return
  }
  const { data, error } = await supabase.from('plaid_accounts')
    .select()
    .eq('user_id', user?.id)

  if (error) {
    throw error;
  }
  return data
}

export function Account() {
  const { mutate } = useSWRConfig()
  const { data: user_data, error, isLoading } = useSWR('user_data', fetcher);
  const { data: bank_data, error: bankError, isLoading: bankIsLoading} = useSWR('bank_accounts_data', bankFetcher)
  const [linkToken, setLinkToken] = useState<string | null>(null);
  let [isBankDialogOpen, setIsBankDialogOpen] = useState(false)
  let [isRemoveBankDialogOpen, setIsRemoveBankDialogOpen] = useState(false)

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
    toast.promise(
      async () => {
      // Send the public_token to server to exchange for an access_token
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
          throw new Error('Failed to exchange public token for access token');
        }
        const { error, success } = await response.json();
        localStorage.removeItem('link_token');
        setLinkToken(null);
        if (error) {
          throw new Error(error);
        } else {
          return success;
        }
      },
      {
        loading: 'Linking bank account...',
        success: (success) => success,
        error: (error) => error,
      }
    )
  };

  const config: PlaidLinkOptions = {
    token: linkToken,
    onSuccess,
    onExit: (error: PlaidLinkError | null, metadata: PlaidLinkOnExitMetadata) => {
      localStorage.removeItem('link_token');
      setLinkToken(null);
      if (error) {
        toast.error('Bank account linking failed');
      }
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
    <div className="p-6 md:p-8 relative justify-center flex">
      <main className="px-4 py-4 sm:px-6 flex-auto lg:px-4 lg:py-4 max-w-7xl">
        <div className="w-full space-y-16 sm:space-y-20">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Profile</h2>
            <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
              <div className="pt-6 sm:flex">
                <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Full name</dt>
                <dd className="flex-auto">
                {isLoading ? (
                  <div className="flex justify-between">
                    <Skeleton height={18} width={140} />
                  </div>
                ) :
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
                        <Button type="button" outline onClick={handleCancelEditName} className="text-sm" disabled={editedName === user_data?.full_name}>
                          Cancel
                        </Button>
                        <Button type="submit" color="blue" onClick={handleSaveName} className="text-sm" disabled={editedName === user_data?.full_name}>
                          Save
                        </Button>
                      </div>
                    </form>
                  </>
                }
                </dd>
              </div>
              <div className="pt-6 sm:flex">
                <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                  Email address
                </dt>
                <dd className="mt-1 flex sm:mt-0 sm:flex-auto">
                {isLoading ? (
                  <div className="flex justify-between">
                    <Skeleton height={18} width={220} />
                  </div>
                ) :
                  <Input className="text-gray-900 bg-gray-50 cursor-default pointer-events-none" placeholder={user_data?.email} />
                }
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Bank accounts</h2>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              Connect bank accounts to your account.
            </p>
            <ul role="list" className="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
              {bankIsLoading ? (
                <li className="gap-y-12 py-7">
                  <Skeleton height={20} width={200} className="" />
                </li>
              ) :
              bank_data?.map((bank_account) => 
                <li key={bank_account.account_id} className="flex justify-between md:gap-x-6 py-6">
                  <div className="font-medium text-gray-700">
                    {bank_account.name} ••••{bank_account.mask}
                  </div>
                  <button type="button" className="px-2 font-semibold text-red-600 hover:text-red-500" 
                    onClick={() => {
                      setBankDetails(`${bank_account.name} ••••${bank_account.mask}`)
                      setAccountId(bank_account.account_id)
                      setIsRemoveBankDialogOpen(true)}
                    }
                  >
                    Remove <span className="hidden sm:inline"> account</span>
                  </button>
                </li>
              )}
            </ul> 
            <RemoveBankDialog isOpen={isRemoveBankDialogOpen} setIsOpen={setIsRemoveBankDialogOpen} bank_details={bankDetails} account_id={accountId} />
            <div className="flex border-t border-gray-100 pt-6">
              <Button type="button" plain className="text-blue-600 hover:text-blue-500"
                onClick={() => setIsBankDialogOpen(true)}
              >
                <span aria-hidden="true">+</span> Add an account
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
