'use client'
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@/components/catalyst/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Fee } from '@/components/PropertySettings/RentCard'
import {
  Field as HeadlessField,
  Fieldset as HeadlessFieldset,
  Label as HeadlessLabel,
  Legend as HeadlessLegend,
  RadioGroup as HeadlessRadioGroup,
} from '@headlessui/react'
import { Radio, RadioField, RadioGroup } from '@/components/catalyst/radio'
import { useState } from 'react'
import { editFee, deleteFee } from '@/utils/supabase/actions'
import { useSWRConfig } from 'swr'

type EditFeeDialogProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  fee: Fee
  fees: Fee[]
  setFees: (fees: Fee[]) => void
}

export function EditFeeDialog({
  isOpen,
  setIsOpen,
  fee,
  fees,
  setFees,
}: EditFeeDialogProps) {
  const [currentFee, setCurrentFee] = useState<Fee>(fee)
  const { mutate } = useSWRConfig()

  return (
    <>
      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Edit fee</DialogTitle>
        <DialogDescription>
          Add a one-time or recurring fee for the tenant, billed at the start of
          next month. Enter a negative amount to apply a discount.
        </DialogDescription>
        <form
          action={async (formData) => {
            await editFee(formData)
            setIsOpen(false)
          }}
        >
          <DialogBody>
            <div className="items-center">
              <HeadlessFieldset>
                <HeadlessLegend className="text-base/6 font-medium sm:text-sm/6">
                  Fee type
                </HeadlessLegend>
                <HeadlessRadioGroup
                  name="feeType"
                  defaultValue={fee.fee_type}
                  className="mt-1 flex items-center gap-x-3"
                  onChange={(feeType) =>
                    setCurrentFee({ ...currentFee, fee_type: feeType })
                  }
                >
                  <HeadlessRadioGroup.Option value="one-time">
                    <HeadlessField className="flex items-center rounded-lg pr-6 outline outline-1 outline-gray-200">
                      <Radio
                        value="one-time"
                        color="blue"
                        className="px-3 py-2"
                      />
                      <HeadlessLabel className="text-sm">
                        One-time
                      </HeadlessLabel>
                    </HeadlessField>
                  </HeadlessRadioGroup.Option>
                  <HeadlessRadioGroup.Option value="recurring">
                    <HeadlessField className="flex items-center rounded-lg pr-6 outline outline-1 outline-gray-200">
                      <Radio
                        value="recurring"
                        color="blue"
                        className="px-3 py-2"
                      />
                      <HeadlessLabel className="text-sm">
                        Recurring
                      </HeadlessLabel>
                    </HeadlessField>
                  </HeadlessRadioGroup.Option>
                </HeadlessRadioGroup>
              </HeadlessFieldset>
            </div>
            <div className="mt-2">
              <Label htmlFor="feeName">Fee Name</Label>
              <Input
                id="feeName"
                name="feeName"
                value={currentFee.fee_name}
                onChange={(e) =>
                  setCurrentFee({ ...currentFee, fee_name: e.target.value })
                }
                placeholder=""
                autoComplete="off"
                required
              />
            </div>
            <div className="mt-2">
              <Label htmlFor="feeCost">Fee Amount</Label>
              <Input
                id="feeCost"
                name="feeCost"
                type="number"
                value={currentFee.fee_cost === 0 ? '' : currentFee.fee_cost}
                onChange={(e) =>
                  setCurrentFee({
                    ...currentFee,
                    fee_cost: Number(e.target.value),
                  })
                }
                placeholder="0"
                autoComplete="off"
                required
                // min="0"
                pattern="^\d+(?:\.\d{1,2})?$"
                step=".01"
              />
            </div>
            <input
              name="feeId"
              value={currentFee.id}
              readOnly
              className="hidden"
            />
          </DialogBody>
          <DialogActions className="flex w-full items-center justify-between">
            <Button
              variant="destructive"
              size="sm"
              onClick={async () => {
                await deleteFee(currentFee.id)
                setFees(fees.filter((f) => f.id !== currentFee.id))
                setIsOpen(false)
              }}
            >
              Delete
            </Button>
            <Button type="submit" variant="outline" size="sm">
              Confirm
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
