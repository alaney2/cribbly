"use client"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Field as HeadlessField,
  Fieldset as HeadlessFieldset,
  Label as HeadlessLabel,
  Legend as HeadlessLegend,
  RadioGroup as HeadlessRadioGroup,
} from '@headlessui/react'
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/catalyst/switch"
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/catalyst/dialog'
import { Radio, RadioField, RadioGroup } from '@/components/catalyst/radio'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/catalyst/table'
import { EditFeeDialog } from '@/components/PropertySettings/EditFeeDialog'
import { generateId } from "@/lib/utils"
import { addPropertyFees } from '@/utils/supabase/actions'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MonthPicker from '@/components/PropertySettings/month-picker'

export interface Fee {
  id: string
  type: string
  name: string
  amount: string
}

type RentCardProps = {
  propertyId: string
  setPropertyId?: (propertyId: string) => void
  freeMonthsLeft?: number
}

export function RentCard({ propertyId, setPropertyId, freeMonthsLeft }: RentCardProps ) {

  React.useEffect(() => {
    if (typeof window !== "undefined" && setPropertyId && !propertyId) {
      setPropertyId(localStorage.getItem('propertyId') || '')
    }
  }, [propertyId, setPropertyId])

  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)
  const [rentAmount, setRentAmount] = React.useState<string>("")
  const [securityDeposit, setSecurityDeposit] = React.useState(false)
  const [securityDepositFee, setSecurityDepositFee] = React.useState<string>("")
  const [dialogFee, setDialogFee] = React.useState<Fee>({
    id: "",
    type: "one-time",
    name: "",
    amount: "",
  })
  const [fees, setFees] = React.useState<Fee[]>([])
  const [netIncome, setNetIncome] = React.useState<number>()
  const [cribblyFee, setCribblyFee] = React.useState<number>(0)
  const [isLoading, setIsLoading] = React.useState(false)
  const [editFeeOpen, setEditFeeOpen] = React.useState(false)
  const [feeEdit, setFeeEdit] = React.useState<Fee>()
  const [startDate, setStartDate] = React.useState<Date | null>(new Date());

  const handleAddFee = () => {
    const newFee = {
      id: generateId(),
      type: dialogFee.type,
      name: dialogFee.name,
      amount: dialogFee.amount,
    }
    setFees([...fees, newFee])
    setIsDialogOpen(false)
    setDialogFee({
      id: "",
      type: "one-time",
      name: "",
      amount: "",
    })
  }

  React.useEffect(() => {
    const calculateNetIncome = () => {
      setIsLoading(true)
      const rentAmountNumber = Number(rentAmount)
      const securityDepositNumber = Number(securityDepositFee)
      setTimeout(() => {
        const totalFees = fees.reduce((total, fee) => total + Number(fee.amount), 0)
        let softwareFee = 0
        if (freeMonthsLeft) {
          if (freeMonthsLeft <= 0 ) {
            if (rentAmountNumber) {
              if (rentAmountNumber >= 10) {
                softwareFee = Number(Math.min(((rentAmountNumber + totalFees) * 0.0035), 10).toFixed(2))
              }
            }
          }
        }
        setCribblyFee(softwareFee)
        const result = (rentAmountNumber || 0) + totalFees - softwareFee + (securityDeposit ? (securityDepositNumber || 0) : 0)
        setNetIncome(parseFloat(result.toFixed(2)))
        setIsLoading(false)
      }, Math.floor(Math.random() * 501) + 200)
    }
    calculateNetIncome()
  }, [securityDeposit, rentAmount, securityDepositFee, fees, freeMonthsLeft])

  return (
    <>
    <Card className="w-[350px] sm:w-[400px]">
      <MonthPicker currentMonth={new Date()} onMonthChange={(month) => {setStartDate(month)}}/>
      <form action={addPropertyFees}>
      <CardHeader>
        <CardTitle>Property setup</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 text-sm mb-4">
          Set the rent and fees to charge for this property per month. 
        </p>
        <div className="flex items-center gap-x-8 mb-3 justify-between">
          <DatePicker
            selected={startDate}
            onSelect={(date) => {setStartDate(date)}}
            onChange={(date) => {setStartDate(date)}}
            dateFormat="MMM yyyy"
            showMonthYearPicker
            showTwoColumnMonthYearPicker
            className="ring-2 text-center ring-gray-300 rounded-lg px-0 text-gray-600 font-medium w-36 sm:text-sm py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-none"
          />
          <span>to</span>
          <DatePicker
            selected={startDate}
            onSelect={(date) => {setStartDate(date)}}
            onChange={(date) => {setStartDate(date)}}
            dateFormat="MMM yyyy"
            showMonthYearPicker
            showTwoColumnMonthYearPicker
            className="ring-2 text-center ring-gray-300 rounded-lg px-0 text-gray-600 font-medium w-36 sm:text-sm py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-none"
          />
        </div>
        <div className="relative">
          <Label htmlFor="rentAmount">Rent per month</Label>
          <>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 mt-6">
              <span className="text-gray-500 font-semibold text-md ">$</span>
            </div>
            <Input
              type="number"
              id="rentAmount"
              name="rentAmount"
              placeholder="0"
              className="py-1.5 px-7 resize-none font-semibold text-md"
              autoComplete="off"
              value={rentAmount}
              onChange={(e) => setRentAmount(e.target.value)}
              step=".01"
              required
              min="0"
              pattern="^\d+(?:\.\d{1,2})?$"
            />
          </>
        </div>

        <div className="flex items-center space-x-2 justify-between mt-4">
          <Label htmlFor="securityDeposit">Security deposit</Label>
          <Switch id="securityDeposit" name="securityDepositSwitch" color="blue" checked={securityDeposit}
            onChange={() => { 
              setSecurityDeposit(!securityDeposit)
            }}
          />
        </div>
        <div className={`mt-1 overflow-hidden transition-all duration-200 ${securityDeposit ? 'max-h-40' : 'max-h-0'}`}>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 font-semibold text-md">$</span>
            </div>
            <input
              type="number"
              id="depositAmount"
              name="depositAmount"
              placeholder="0"
              className="py-1.5 px-7 resize-none font-semibold text-md max-w-xs h-10 w-full rounded-md bg-background text-base sm:text-sm transition-all ease-in-out duration-150 border focus:ring-0 focus:outline-0 "
              autoComplete="off"
              value={securityDepositFee}
              required={securityDeposit}
              onChange={(e) => setSecurityDepositFee(e.target.value)}
              step=".01"
              min="0"
              pattern="^\d+(?:\.\d{1,2})?$"
            />

          </div>
        </div>
        {fees.length > 0 && (
          <div className="mt-3">
            <Table dense={true} className="">
              <TableHead>
                <TableRow className="text-card-foreground">
                  <TableHeader className="">Fee name</TableHeader>
                  <TableHeader>Fee type</TableHeader>
                  <TableHeader className="text-right">Cost</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {fees.map((fee, index) => (
                  <>
                    <TableRow key={fee.id} className="cursor-default" 
                      onClick={() => {
                        setFeeEdit(fee)
                        setEditFeeOpen(true)
                      }}
                    >
                      <TableCell className="max-w-[140px] truncate">{fee.name}</TableCell>
                      <TableCell >{fee.type}</TableCell>
                      <TableCell className="text-right">${fee.amount}</TableCell>
                    </TableRow>
                  </>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {fees.length > 0 && fees.map((fee, index) => (
          <input key={fee.id} className="hidden" name={`fee${index}`} id={`fee${index}`} defaultValue={JSON.stringify(fee)} readOnly />
        ))}
        <input name='propertyId' defaultValue={propertyId} readOnly className="hidden" />
        <div className="mt-4 -mb-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setIsDialogOpen(true)}>Add Fee</Button>
        </div>
      </CardContent>
      
      <Separator className="mt-0" />
      <CardFooter className="flex justify-between items-center">
        <div className="text-sm flex items-center">
          <span className="font-medium mr-2">
            Net income:
          </span>
          <span>
          {isLoading ? (
            <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            `$${netIncome ? netIncome < 0 ? 0 : netIncome.toFixed(2) : 0}`
          )}
          </span>
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger 
              className="ml-3 flex items-center"
              onMouseEnter={() => {setIsPopoverOpen(true)}}
              onClick={e => {
                e.preventDefault();
              }}
            >
              <span className="ml-0 text-gray-500 cursor-default">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </span>
            </PopoverTrigger>
            <PopoverContent>
              <div className="text-sm">
                <p className="flex justify-between">
                  <span>Rent: </span>
                  <span>${Number(rentAmount) || 0}</span>
                </p>
                {
                  securityDeposit && (
                    <p className="flex justify-between">
                      <span>Security deposit: </span>
                      <span>${Number(securityDepositFee) || 0}</span>
                    </p>
                  )
                }
                {fees.map((fee, index) => (
                  <p key={index} className="flex justify-between">
                    <span>{fee.name}: </span>
                    <span>${fee.amount}</span>
                  </p>
                ))}
                <p className="flex justify-between">
                  <span>Cribbly fee: </span>
                  <span>${cribblyFee}</span>
                </p>
                <Separator className="my-2"/>
                <p className="flex justify-between">
                  <span>Net income: </span>
                  <span>${netIncome ? netIncome < 0 ? 0 : netIncome : 0}</span>
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex gap-x-3">
          <Button type="submit" size="sm">Continue</Button>
        </div>
      </CardFooter>
      </form>

    </Card>
    <Dialog open={isDialogOpen} onClose={setIsDialogOpen}>
      <DialogTitle>Add Fee</DialogTitle>
      <DialogDescription>
        Add a one-time or recurring fee for the tenant, billed at the start of next month.
      </DialogDescription>
      <form action={handleAddFee}>
      <DialogBody>

        <div className="items-center">
          <HeadlessFieldset >
            <HeadlessLegend className="text-base/6 font-medium sm:text-sm/6">
              Fee type
            </HeadlessLegend>
            <HeadlessRadioGroup name="feeType" defaultValue="one-time" className="flex gap-x-3 items-center mt-1"
              onChange={(feeType) => setDialogFee({ ...dialogFee, type: feeType})}
            >
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
            value={dialogFee.name}
            onChange={(e) => setDialogFee({ ...dialogFee, name: e.target.value })}
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
            value={dialogFee.amount}
            onChange={(e) => setDialogFee({ ...dialogFee, amount: e.target.value })}
            placeholder="Enter fee amount"
            autoComplete="off"
            required
            min="0"
            pattern="^\d+(?:\.\d{1,2})?$"
            step=".01"
          />
        </div>
      </DialogBody>
      <DialogActions >
        <Button type="button" variant="ghost" size="sm" onClick={() => setIsDialogOpen(false)}>
          Cancel
        </Button>
        <Button type="submit" size="sm" className="px-4 ml-3">
          Add
        </Button>
      </DialogActions>
      </form>
    </Dialog>
    {editFeeOpen && feeEdit && <EditFeeDialog isOpen={editFeeOpen} setIsOpen={setEditFeeOpen} fee={feeEdit} fees={fees} setFees={setFees} />}
    </>
  )
}
