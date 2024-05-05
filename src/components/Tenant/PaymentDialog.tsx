import { Button } from '@/components/ui/button'
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/catalyst/dialog'
import { Field, Label } from '@/components/catalyst/fieldset'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/catalyst/table'


type PaymentDialogProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  rentAmount: number
}

export function PaymentDialog({ isOpen, setIsOpen, rentAmount }: PaymentDialogProps) {
  return (
    <>
      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Review and submit your payment</DialogTitle>
        <DialogDescription>
          By submitting this payment, you agree to the fees listed and accept the Terms and Conditions.
        </DialogDescription>
        <DialogBody>
          {/* <Field>
            <Label>Rent amount</Label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <Input name="amount" disabled placeholder="$0.00" defaultValue={rentAmount} readOnly
                className="py-1.5 pl-6 pr-12 resize-none"
              />
            </div>
          </Field> */}
          <Table bleed dense>
            <TableHead>
              <TableRow>
                <TableHeader>Name</TableHeader>
                {/* <TableHeader>Email</TableHeader> */}
                <TableHeader className="text-right">Amount</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Rent amount</TableCell>
                <TableCell className="text-zinc-500 text-right">${rentAmount}</TableCell>
              </TableRow>
              {/* {users.map((user) => (
                <TableRow key={user.handle}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="text-zinc-500">{user.access}</TableCell>
                </TableRow>
              ))} */}
            </TableBody>
          </Table>
        </DialogBody>
        <DialogActions>
          <Button size="sm" variant="ghost" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={() => setIsOpen(false)}>Submit payment</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}