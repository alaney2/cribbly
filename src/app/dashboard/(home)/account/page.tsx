"use client"
import { createClient } from '@/utils/supabase/server';
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
import { useSearchParams } from 'next/navigation'

export default function DashboardAccount() {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  let [isBankDialogOpen, setIsBankDialogOpen] = useState(false)
  const searchParams = useSearchParams()

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

  if (window && window.location.search.includes('oauth_state_id')) {
    config.receivedRedirectUri = window.location.href;
  }

  const { open, ready } = usePlaidLink(config);

  useEffect(() => {
    if (linkToken && ready) {
      open();
    }
  }, [linkToken, ready, open]);

  return (
    <div className="p-6 md:p-8" style={{ height: 'calc(100vh - 48px)' }}>
      <div>Account details</div>
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