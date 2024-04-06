"use client"
import { useState } from 'react'
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/catalyst/dialog'
import { Button } from '@/components/catalyst/button'
import { Checkbox, CheckboxField, CheckboxGroup } from '@/components/catalyst/checkbox'
import { Description, Fieldset, Field, Label, Legend } from '@/components/catalyst/fieldset'

export function RemoveBankDialog({ isOpen, setIsOpen, bank_details }: { isOpen: boolean, setIsOpen: (isOpen: boolean) => void; bank_details: string }) {
  let [checked, setChecked] = useState(false)

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
          // onClick={async () => {
          //   setIsOpen(false);
          // }}
        >
          Yes, remove account
        </Button>
      </DialogActions>
    </Dialog>
  )
}