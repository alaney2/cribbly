"use client"
import { createClient } from '@/utils/supabase/client';
import { redirect } from 'next/navigation';
import { Button } from '@/components/catalyst/button';
import { PlaidLinkError, PlaidLinkOnExitMetadata, PlaidLinkOptions, usePlaidLink } from 'react-plaid-link';
import { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/catalyst/dialog'
import { Field, Label } from '@/components/catalyst/fieldset'
import { Input } from '@/components/catalyst/input'
import { LockClosedIcon } from '@heroicons/react/24/outline';
import { set } from 'lodash';
import toast from 'react-hot-toast';
import { useSearchParams, usePathname } from 'next/navigation'
import useSWR from 'swr';
import { Spinner } from '@/components/FuelSpinner'

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

export function Account() {
  // console.log('user', user_data.full_name, user_data.email)
  const { data: user_data, error, isLoading } = useSWR('user_data', fetcher);
  const [linkToken, setLinkToken] = useState<string | null>(null);
  let [isBankDialogOpen, setIsBankDialogOpen] = useState(false)
  const searchParams = useSearchParams()
  const pathname = usePathname()

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
    console.log('DATA RECEIVED Link Token:', data.link_token)
    localStorage.setItem('link_token', data.link_token)
    setLinkToken(data.link_token);
  };


  const onSuccess = async (publicToken: string) => {
    // Send the public_token to your server to exchange for an access_token
    const response = await fetch('/api/plaid/set_access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicToken }),
    });
    if (!response.ok) {
      // Handle error
      console.error('Failed to exchange public token for access token');
      return;
    }
    const { error, success } = await response.json();
    localStorage.removeItem('link_token');
    if (error) {
      toast.error(error);
      return;
    }
    toast.success(success);
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
    <div className="p-6 md:p-8" style={{ height: 'calc(100vh - 48px)' }}>
      {isLoading ? (
        <Spinner />
    ) : (
      <main className="px-4 py-4 sm:px-6 lg:flex-auto lg:px-4 lg:py-4">
        <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Profile</h2>
            <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
              <div className="pt-6 sm:flex">
                <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Full name</dt>
                <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                  <div className="text-gray-900">{user_data?.full_name}</div>
                  <Button type="button" className="text-blue-500 hover:text-blue-500" plain>
                    Update
                  </Button>
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
              <li className="flex justify-between gap-x-6 py-6">
                <div className="font-medium text-gray-900">Chase</div>
                <Button type="button" plain className="hover:text-blue-500">
                  Update
                </Button>
              </li>
            </ul>
            <div className="flex border-t border-gray-100 pt-6">
              <Button type="button" plain className="text-blue-600 hover:text-blue-500"
                onClick={() => setIsBankDialogOpen(true)}
              >
                <span aria-hidden="true">+</span> Add another bank
              </Button>
            </div>
          </div>
        </div>
      </main>
    )}
      <Button type="button" color="blue" onClick={() => setIsBankDialogOpen(true)}>
        Open dialog
      </Button>
      <Button type="button" color="blue" onClick={async () => { fetch('/api/plaid/auth') }}>
        Call Auth
      </Button>
      <Button type="button" color="blue" onClick={async () => { fetch('/api/plaid/get_bank_name') }}>
        Bank name
      </Button>
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
    </div>
  );
}