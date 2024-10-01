// 'use client'
// import {
//   Dialog,
//   DialogActions,
//   DialogBody,
//   DialogDescription,
//   DialogTitle,
// } from '@/components/catalyst/dialog'
// import { Button } from '@/components/catalyst/button'
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/catalyst/table'
// import { useState } from 'react'
// import { calculateRentDates } from '@/utils/helpers'
// import { format, addYears, subDays, addDays } from 'date-fns'

// type ScheduleDialogProps = {
//   isOpen: boolean
//   setIsOpen: (isOpen: boolean) => void
//   startDate: Date
//   endDate: Date
//   rentAmount: number
//   securityDeposit: boolean
//   securityDepositFee: number
// }
// export function ScheduleDialog({
//   isOpen,
//   setIsOpen,
//   startDate,
//   endDate,
//   rentAmount,
//   securityDeposit,
//   securityDepositFee,
// }: ScheduleDialogProps) {
//   const rentInfo = calculateRentDates(startDate, endDate)
//   const monthsOfRent = rentInfo.monthsOfRent
//   const rentDates = rentInfo.rentDates
//   return (
//     <>
//       <Dialog open={isOpen} onClose={setIsOpen}>
//         <DialogTitle>Billing Schedule</DialogTitle>
//         <DialogDescription>
//           The following table outlines the billing schedule, indicating the
//           specific dates when the corresponding amounts will be charged to the
//           tenant(s).
//         </DialogDescription>
//         <DialogDescription className="font-medium">
//           {monthsOfRent} months total
//         </DialogDescription>
//         <form>
//           <DialogBody>
//             <Table bleed>
//               <TableHead>
//                 <TableRow>
//                   <TableHeader>Date</TableHeader>
//                   <TableHeader className="text-right">Amount due</TableHeader>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {rentDates.map((date, index) => (
//                   <TableRow key={String(date)}>
//                     <TableCell className="">
//                       {format(date, 'MM/dd/yyyy')}
//                     </TableCell>
//                     <TableCell className="text-right text-zinc-500">
//                       $
//                       {Number(rentAmount) +
//                         (index === 0 && securityDeposit
//                           ? Number(securityDepositFee)
//                           : 0)}{' '}
//                       {index === 0 &&
//                         securityDeposit &&
//                         '(incl. security deposit)'}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </DialogBody>
//           <DialogActions className="flex w-full items-center justify-between">
//             <Button type="button" outline onClick={() => setIsOpen(false)}>
//               Close
//             </Button>
//           </DialogActions>
//         </form>
//       </Dialog>
//     </>
//   )
// }
