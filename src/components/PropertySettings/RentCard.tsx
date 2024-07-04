"use client"
import * as React from "react"

import { Button } from "@/components/catalyst/button"
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Input, InputGroup } from "@/components/catalyst/input"
import { Field, Label } from '@/components/catalyst/fieldset'
import * as Headless from '@headlessui/react'
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
// import { generateId } from "@/lib/utils"
import { addPropertyFees } from '@/utils/supabase/actions'
import "react-datepicker/dist/react-datepicker.css";
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { format, addYears, subDays, addDays } from "date-fns"
import { cn } from "@/lib/utils"
import { ScheduleDialog } from '@/components/PropertySettings/ScheduleDialog'
import { toast } from 'sonner';
import useSWR from 'swr';
import { createClient } from '@/utils/supabase/client';
import { IconCurrencyDollar } from '@tabler/icons-react';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline'

const fetcher = async (propertyId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('property_rents')
    .select('*')
    .eq('property_id', propertyId)
  if (error) {
    throw error;
  }
  return data;
};

const sd_fetcher = async (propertyId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('property_security_deposits')
    .select('*')
    .eq('property_id', propertyId)
  if (error) {
    throw error;
  }
  return data;
};

const fees_fetcher = async (propertyId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('property_fees')
    .select('*')
    .eq('property_id', propertyId)
  if (error) {
    throw error;
  }
  return data;
};

export interface Fee {
  id: string
  property_id?: string
  fee_type: "one-time" | "recurring"
  fee_name: string
  fee_cost: number | undefined
  months_left?: number;
  created_at?: Date;
}

type RentCardProps = {
  propertyId: string
  setPropertyId?: (propertyId: string) => void
  freeMonthsLeft?: number
  buttonOnClick?: () => void
}

const CRIBBLY_FEE = 10

export function RentCard({ propertyId, setPropertyId, freeMonthsLeft, buttonOnClick }: RentCardProps ) {

  React.useEffect(() => {
    if (typeof window !== "undefined" && setPropertyId && !propertyId) {
      setPropertyId(localStorage.getItem('propertyId') || '')
    }
  }, [propertyId, setPropertyId])

  const { data: property_rent, error, isLoading: isRentLoading, mutate } = useSWR(propertyId ? ['rentPrice', propertyId] : null, ([_, propertyId]) => fetcher(propertyId));
  const { data: sd_data, error: sd_error, isLoading: isSdLoading } = useSWR(propertyId ? ['securityDeposit', propertyId] : null, ([_, propertyId]) => sd_fetcher(propertyId));
  const { data: property_fees, error: fees_error, isLoading: isFeesLoading, mutate: mutateFees } = useSWR(propertyId ? ['fees', propertyId] : null, ([_, propertyId]) => fees_fetcher(propertyId));

  if (fees_error) {
    console.error(sd_error)
  }
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isScheduleOpen, setIsScheduleOpen] = React.useState(false)
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)
  const [rentAmount, setRentAmount] = React.useState<string>("")
  const [securityDeposit, setSecurityDeposit] = React.useState(false)
  const [securityDepositFee, setSecurityDepositFee] = React.useState<string>("")
  const [dialogFee, setDialogFee] = React.useState<Fee>({
    id: "",
    property_id: propertyId,
    fee_type: "one-time",
    fee_name: "",
    fee_cost: 0,
  })
  const [fees, setFees] = React.useState<Fee[]>([])
  const [netIncome, setNetIncome] = React.useState<number>(0)
  const [cribblyFee, setCribblyFee] = React.useState<number>(0)
  const [isLoading, setIsLoading] = React.useState(false)
  const [editFeeOpen, setEditFeeOpen] = React.useState(false)
  const [feeEdit, setFeeEdit] = React.useState<Fee>()
  const [startDate, setStartDate] = React.useState<Date | undefined>(addDays(new Date(), 1));
  const [endDate, setEndDate] = React.useState<Date | undefined>((addYears(new Date(), 1)));
  const [fadeOut, setFadeOut] = React.useState(false);
  const animationClass = fadeOut ? ' animate__fadeOut' : 'animate__fadeIn';

  React.useEffect(() => {
    if (property_rent && property_rent.length > 0) {
      setRentAmount(String(property_rent[0].rent_price))
      setStartDate(new Date(property_rent[0].rent_start))
      setEndDate(new Date(property_rent[0].rent_end))
    }
    if (sd_data && sd_data.length > 0) {
      setSecurityDeposit(true)
      setSecurityDepositFee(String(sd_data[0].deposit_amount))
    }
    if (property_fees && property_fees.length > 0) {
      setFees(property_fees)
    }
  }, [property_rent, sd_data, property_fees])

  const handleAddFee = async () => {
    const newFee = {
      id: '',
      property_id: propertyId,
      fee_type: dialogFee.fee_type,
      fee_name: dialogFee.fee_name,
      fee_cost: dialogFee.fee_cost,
    }
    setFees([...fees, newFee])
    setIsDialogOpen(false)
    setDialogFee({
      id: "",
      property_id: propertyId,
      fee_type: "one-time",
      fee_name: "",
      fee_cost: 0,
    })
  }

  React.useEffect(() => {
    const calculateNetIncome = () => {
      // setIsLoading(true)
      const rentAmountNumber = Number(rentAmount)
      // const securityDepositNumber = Number(securityDepositFee)
      const totalFees = fees.reduce((total, fee) => total + Number(fee.fee_cost), 0)
      let softwareFee = 0
      if (freeMonthsLeft) {
        if (freeMonthsLeft <= 0 ) {
          if (rentAmountNumber) {
            if (rentAmountNumber >= 10) {
              softwareFee = Number(CRIBBLY_FEE.toFixed(2))
            }
          }
        }
      }
      setCribblyFee(softwareFee)
      const result = (rentAmountNumber || 0) + totalFees - softwareFee
      setNetIncome(parseFloat(result.toFixed(2)))
    }
    calculateNetIncome()
  }, [securityDeposit, rentAmount, securityDepositFee, fees, freeMonthsLeft])

  return (
    <>
    <Card className={`w-full animate__animated animate__faster ${animationClass}`}>
      <form
        action={async (formData) => {
          toast.promise(new Promise(async (resolve, reject) => {
            try {
              const data = await addPropertyFees(formData)
              if (buttonOnClick) {
                setFadeOut(true);
                setTimeout(() => {
                  buttonOnClick();
                  resolve('Success');
                }, 300);
              } else {
                resolve('Success');
              }
            } catch (error) {
              reject(error)
            }
          }), {
            loading: 'Adding...',
            success: 'Rent and fees added!',
            error: 'An error occurred, please check the form and try again.'
          })
        }}
      >
      <CardHeader>
        <CardTitle>Property setup</CardTitle>
        <CardDescription className="mt-2">
        Set the rent and fees to charge for this property per month. Rent is billed on the start date, and then the first of each month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-5">
          <div className="sm:text-sm text-zinc-950 md:w-40 mb-2 md:mb-0">
            Start and end date
          </div>
          <div className="flex items-center gap-2 grow">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  outline
                  className={cn(
                    "flex-1 justify-center text-center text-sm",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="sm:mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "MM/dd/yyyy") : <span>Start date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  defaultMonth={startDate}
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
            <span className="px-0">-</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  outline
                  className={cn(
                    "flex-1 justify-center text-center text-sm",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="sm:mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "MM/dd/yyyy") : <span>End date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  defaultMonth={endDate}
                  disabled={(date) =>
                    (startDate !== undefined) ? date < startDate : date < new Date()
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
          <input name="rent_id" required value={property_rent?.[0]?.id ?? ''} readOnly type="hidden" />
          <input name="startDate" required value={startDate ? format(startDate, "MM/dd/yyyy") : ""} readOnly type="hidden" />
          <input name="endDate" required value={endDate ? format(endDate, "MM/dd/yyyy") : ""} readOnly type="hidden" />
        </div>
        <div className="relative space-y-4">
          <Headless.Field className="relative flex flex-col md:flex-row md:items-center md:gap-4">
            <Label htmlFor="rentAmount" className="mb-2 md:mb-0 md:w-40 md:flex-shrink-0">Rent per month</Label>
            <div className="flex-grow">
              <InputGroup className="w-full">
                <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                <Input
                  type="number"
                  id="rentAmount"
                  name="rentAmount"
                  placeholder="0"
                  className="w-full flex-grow"
                  autoComplete="off"
                  value={rentAmount}
                  onChange={(e) => {
                    setIsLoading(true)
                    setRentAmount(e.target.value)
                    setTimeout(() => {
                      setIsLoading(false)
                    }, Math.floor(Math.random() * 501) + 200)
                  }}
                  step="1"
                  required
                  min="0"
                  pattern="^\d+(?:\.\d{1,2})?$"
                />
              </InputGroup>
            </div>
          </Headless.Field>

          <Headless.Field className="relative flex flex-col md:flex-row md:items-center md:gap-4">
            <div className="flex justify-between items-center mb-2 md:mb-0 md:w-40 md:flex-shrink-0">
              <Label htmlFor="securityDeposit">Security deposit</Label>
              <Switch
                id="securityDeposit"
                name="securityDepositSwitch"
                color="blue"
                checked={securityDeposit}
                onChange={() => {
                  setSecurityDeposit(!securityDeposit)
                }}
              />
            </div>
            <div className="flex-grow">
              <InputGroup className="w-full">
                <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                <Input
                  type="number"
                  id="depositAmount"
                  name="depositAmount"
                  placeholder="0"
                  disabled={!securityDeposit}
                  className="w-full flex-grow"
                  autoComplete="off"
                  value={securityDepositFee}
                  required={securityDeposit}
                  onChange={(e) => {
                    setIsLoading(true)
                    setSecurityDepositFee(e.target.value)
                    setTimeout(() => {
                      setIsLoading(false)
                    }, Math.floor(Math.random() * 501) + 200)
                  }}
                  step=".01"
                  min="0"
                  pattern="^\d+(?:\.\d{1,2})?$"
                />
              </InputGroup>
            </div>
          </Headless.Field>
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
                  <TableRow key={fee.id} className="cursor-default" 
                    onClick={() => {
                      setFeeEdit(fee)
                      setEditFeeOpen(true)
                    }}
                  >
                    <TableCell className="max-w-[140px] truncate">{fee.fee_name}</TableCell>
                    <TableCell >{fee.fee_type}</TableCell>
                    <TableCell className="text-right">${fee.fee_cost}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {fees.length > 0 && fees.map((fee, index) => (
          <input key={fee.id} className="hidden" name={`fee${index}`} id={`fee${index}`} defaultValue={JSON.stringify(fee)} readOnly />
        ))}
        <input name='propertyId' defaultValue={propertyId} readOnly className="hidden" />
        <div className="mt-4 -mb-2 flex justify-between">
          <Button type="button" color="blue" onClick={() => setIsDialogOpen(true)}>Add Fee</Button>
          <Button type="button" outline onClick={() => setIsScheduleOpen(true)}>Billing Schedule</Button>
        </div>
      </CardContent>
      
      <Separator className="mt-0" />
      <CardFooter className="flex justify-between items-center">
        <div className="text-sm flex items-center">
          <span className="font-medium mr-2">
            Monthly income:
          </span>
          <span>
          {isLoading ? (
            <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            `$${netIncome ? netIncome < 0 ? 0 : netIncome : 0}`
          )}
          </span>
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger 
              className="ml-3 flex items-center"
              onMouseEnter={() => {setIsPopoverOpen(true)}}
              onMouseLeave={() => {setIsPopoverOpen(false)}}
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
                {/* {
                  securityDeposit && (
                    <p className="flex justify-between">
                      <span>Security deposit: </span>
                      <span>${Number(securityDepositFee) || 0}</span>
                    </p>
                  )
                } */}
                {fees.map((fee, index) => (
                  <p key={index} className="flex justify-between">
                    <span>{fee.fee_name}: </span>
                    <span>${fee.fee_cost}</span>
                  </p>
                ))}
                <p className="flex justify-between">
                  <span>Cribbly fee: </span>
                  {cribblyFee === 0 ? (
                    <span>
                      <s>$10</s> $0
                    </span>
                  ) : (
                    <span>${cribblyFee}</span>
                  )}
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
          <Button type="submit" color="blue" >Save</Button>
        </div>
      </CardFooter>
      </form>
    </Card>
    <Dialog open={isDialogOpen} onClose={setIsDialogOpen}>
      <DialogTitle>Add Fee</DialogTitle>
      <DialogDescription>
        Add a one-time or recurring fee for the tenant, billed at the start of next month. Enter a negative amount to apply a discount.
      </DialogDescription>
      <form action={handleAddFee}>
      <DialogBody>
        <div className="items-center">
          <HeadlessFieldset>
            <HeadlessLegend className="text-base/6 font-medium sm:text-sm/6 mb-3">
              Fee type
            </HeadlessLegend>
            <HeadlessRadioGroup name="feeType" defaultValue="one-time" className="flex gap-x-3 items-center mt-1"
              onChange={(feeType: "one-time" | "recurring") => setDialogFee({ ...dialogFee, fee_type: feeType})}
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
        <div className="mt-6">
          <Field>
            <Label htmlFor="feeName">Fee name</Label>
            <Input
              id="feeName"
              value={dialogFee.fee_name}
              onChange={(e) => setDialogFee({ ...dialogFee, fee_name: e.target.value })}
              // placeholder="Enter fee name"
              autoComplete="off"
              required
            />
          </Field>
        </div>
        <div className="mt-6">
          <Field>
            <Label htmlFor="feeAmount ">Fee amount</Label>
            <Input
              id="feeAmount"
              type="number"
              value={dialogFee.fee_cost || ''}
              onChange={(e) => setDialogFee({ ...dialogFee, fee_cost: Number(e.target.value) })}
              placeholder="0"
              autoComplete="off"
              required
              // min="0"
              pattern="^\d+(?:\.\d{1,2})?$"
              step=".01"
            />
          </Field>
        </div>
      </DialogBody>
      <DialogActions>
        <Button type="button" outline onClick={() => setIsDialogOpen(false)}>
          Cancel
        </Button>
        <Button type="submit" color="blue" className="">
          Add
        </Button>
      </DialogActions>
      </form>
    </Dialog>
    {editFeeOpen && feeEdit && <EditFeeDialog isOpen={editFeeOpen} setIsOpen={setEditFeeOpen} fee={feeEdit} fees={fees} setFees={setFees} mutateFees={mutateFees} />}
    {startDate && endDate && <ScheduleDialog isOpen={isScheduleOpen} setIsOpen={setIsScheduleOpen} startDate={startDate} endDate={endDate} netIncome={netIncome} securityDeposit={securityDeposit} securityDepositFee={securityDepositFee}/>}
    </>
  )
}
