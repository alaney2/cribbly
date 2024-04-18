"use client"
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/catalyst/dialog'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
// type Fee = {
//   type: string
//   name: string
//   amount: number
// }

type EditFeeDialogProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  fee: Fee
}
export function EditFeeDialog({ isOpen, setIsOpen, fee }: EditFeeDialogProps) {
  const [currentFee, setCurrentFee] = useState<Fee>(fee)

  const handleSaveFee = () => {
    console.log(currentFee)
    setIsOpen(false)
  }

  return (
    <>
      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Edit fee</DialogTitle>
        {/* <DialogDescription>
          Edit the fee for this property.
        </DialogDescription> */}
        <DialogBody>
        <div className="items-center">
          <HeadlessFieldset >
            <HeadlessLegend className="text-base/6 font-medium sm:text-sm/6">
              Fee type
            </HeadlessLegend>
            <HeadlessRadioGroup name="feeType" defaultValue={fee.type} className="flex gap-x-3 items-center mt-1" onChange={(e) => setCurrentFee({ ...currentFee, type: e})}>
              <HeadlessRadioGroup.Option value="one-time" >
                <HeadlessField className="outline outline-1 pr-6 outline-gray-200 rounded-lg flex items-center">
                  <Radio value="one-time" color="blue" className="px-3 py-2" />
                  <HeadlessLabel className="text-sm">One-time</HeadlessLabel>
                </HeadlessField>
              </HeadlessRadioGroup.Option>
              <HeadlessRadioGroup.Option value="recurring" >
                <HeadlessField className="outline outline-1 pr-6 outline-gray-200 rounded-lg flex items-center">
                  <Radio value="recurring" color="blue" className="px-3 py-2" />
                  <HeadlessLabel className="text-sm">Recurring</HeadlessLabel>
                </HeadlessField>
              </HeadlessRadioGroup.Option>
            </HeadlessRadioGroup>
          </HeadlessFieldset>
        </div>
        <div className="mt-2">
          <Label htmlFor="feeName">Fee Name</Label>
          <Input
            id="feeName"
            value={currentFee.name}
            onChange={(e) => setCurrentFee({ ...currentFee, name: e.target.value })}
            placeholder="Enter fee name"
            autoComplete="off"
            required
          />
        </div>
        <div className="mt-2">
          <Label htmlFor="feeAmount">Fee Amount</Label>
          <Input
            id="feeAmount"
            type="number"
            value={currentFee.amount}
            onChange={(e) => {
              setCurrentFee({ ...currentFee, amount: Number(parseFloat(e.target.value).toFixed(2)) }
            )}}
            placeholder="Enter fee amount"
            autoComplete="off"
            required
            min="0"
          />
        </div>
        </DialogBody>
        <DialogActions>
          <Button variant="ghost" type="button" onClick={() => {setIsOpen(false)}}>Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}