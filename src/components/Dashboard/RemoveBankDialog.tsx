"use client"
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client';
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/catalyst/dialog'
import { Button } from '@/components/catalyst/button'
import { Checkbox, CheckboxField, CheckboxGroup } from '@/components/catalyst/checkbox'
import { Description, Fieldset, Field, Label, Legend } from '@/components/catalyst/fieldset'
import { useSWRConfig } from 'swr'
// import toast from 'react-hot-toast';
import { toast } from 'sonner'


type BankDialogProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  bank_details: string
  account_id: string
}

export function RemoveBankDialog({ isOpen, setIsOpen, bank_details, account_id }: BankDialogProps) {
  let [checked, setChecked] = useState(false)
  const { mutate } = useSWRConfig()

  useEffect(() => {
    setChecked(false)
  }, [isOpen])

  const handleDeleteBank = async () => {
    const supabase = createClient()
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) return
    const { error } = await supabase.from('plaid_accounts')
      .delete()
      .eq('user_id', user.id)
      .eq('account_id', account_id)

    mutate('bank_accounts_data')

    if (error) {
      console.error('Error removing account:', error)
      toast.error('Error removing account')
    }
  }

  return (
    <Dialog open={isOpen} onClose={setIsOpen}>
      <DialogTitle>Remove linked account?</DialogTitle>
      <DialogDescription className="mb-4">
        Cribbly will no longer use data from accounts you remove. If you remove a linked account that is also used as your payout account, it may cause your payouts to be paused.
      </DialogDescription>
      <DialogBody>
        <Field>
        <CheckboxField>
          <Checkbox name="remove_account" checked={checked} onChange={setChecked} />
          <Label>{bank_details}</Label>
        </CheckboxField>
        </Field>
      </DialogBody>
      <DialogActions>
        <Button plain onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
        <Button 
          color='red'
          disabled={!checked}
          onClick={async () => {
            await handleDeleteBank();
            setIsOpen(false);
          }}
        >
          Yes, remove account
        </Button>
      </DialogActions>
    </Dialog>
  )
}