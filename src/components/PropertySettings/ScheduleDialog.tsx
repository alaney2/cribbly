"use client"
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/catalyst/dialog'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/catalyst/table'
import { useState } from 'react'
import { calculateRentDates } from '@/utils/helpers'
import { format, addYears, subDays, addDays } from "date-fns"


type ScheduleDialogProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  startDate: Date
  endDate: Date
}
export function ScheduleDialog({ isOpen, setIsOpen, startDate, endDate }: ScheduleDialogProps) {
  const rentInfo = calculateRentDates(startDate, endDate);
  const monthsOfRent = rentInfo.monthsOfRent;
  const rentDates = rentInfo.rentDates;
  return (
    <>
      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Billing Schedule</DialogTitle>
        <DialogDescription>
          The following table outlines the billing schedule, indicating the specific dates when the corresponding amounts will be charged to the tenant(s). 
        </DialogDescription>
        <DialogDescription className="font-medium">
          {monthsOfRent} months total
        </DialogDescription>
        <form>
        <DialogBody>
          <Table bleed>
            <TableHead>
              <TableRow>
                <TableHeader>Date</TableHeader>
                <TableHeader className="text-center">Amount due</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {rentDates.map((date) => (
                <TableRow key={date}>
                  <TableCell className="">{format(date, "MM/dd/yyyy")}</TableCell>
                  <TableCell className="text-zinc-500 text-center">{1}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogBody>
        {/* <DialogActions className="flex justify-between items-center w-full">
          <Button variant="destructive" size="sm" 
            
          >
            Delete
          </Button>
          <Button type="submit" size="sm" 
          >
            Save
          </Button>
        </DialogActions> */}
        </form>
      </Dialog>
    </>
  )
}