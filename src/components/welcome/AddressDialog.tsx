
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/catalyst/dialog'
import { Field, Label } from '@/components/catalyst/fieldset'
import { Input } from '@/components/catalyst/input'
import { Button } from '@/components/catalyst/button';

export function AddressDialog({ isOpen, setIsOpen } : { isOpen: boolean; setIsOpen: (isOpen: boolean) => void}) {

  return (
    <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Confirm address details</DialogTitle>
        <DialogDescription>
          Please confirm the address details for the property you are adding.
        </DialogDescription>
        <DialogBody>
          <Field>
            <Label>Country</Label>
            <Input name="amount" placeholder="$0.00" />
          </Field>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button color="blue" onClick={() => setIsOpen(false)}>Confirm</Button>
        </DialogActions>
      </Dialog>
  )
}