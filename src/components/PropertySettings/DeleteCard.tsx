"use client"
import * as React from "react"
import { deleteProperty } from '@/utils/supabase/actions'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/catalyst/dialog'
import { useRouter } from 'next/navigation'
import { Separator } from "@/components/ui/separator"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export function DeleteCard({ propertyId }: { propertyId: string }) {
  const router = useRouter()
  const [deleteInput, setDeleteInput] = React.useState('')
  let [isOpen, setIsOpen] = React.useState(false)

  const handleDeleteProperty = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (deleteInput !== 'delete my property') return;
    await deleteProperty(propertyId)
    router.push('/dashboard')
  }
  return (
    <>
    <Card className="w-[350px] sm:w-[400px] ring-1 ring-red-500/25">
      <CardHeader>
        <CardTitle>Delete property</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">
          Permanently remove your property and all of its contents from the Cribbly platform. This action is irreversible.
        </p>
      </CardContent>
      <CardFooter className="flex justify-end ">
        <Button size="sm" type="button" variant="destructive" className="" onClick={() => setIsOpen(true)}>Delete property</Button>
        </CardFooter>
      </Card>
      <Dialog open={isOpen} onClose={setIsOpen} >
        <DialogTitle className="">Delete property</DialogTitle>
        <DialogDescription className="font-medium">
          This property will be deleted, along with its Settings, Tenants, Maintenance tasks, and all other Data.
        </DialogDescription>
        <form>
        <DialogBody>
          <div className="">
            {/* <div className="mb-4 font-medium">
              This property will be deleted, along with its Settings, Tenants, Maintenance tasks, and all other Data.
            </div> */}
            <Alert variant="destructive" className="bg-red-300/75 px-3 py-2 mb-4 font-semibold text-sm rounded-lg">
              <AlertTitle><span className="text-gray-50">Warning: </span>This action is not reversible. Please be certain.</AlertTitle>
            </Alert>
            <div className="items-center">
              <Label htmlFor="verifyDelete" className="">
                To verify, type <span className="font-bold">delete my property</span> below:
              </Label>
              <Input
                type="text"
                id="verifyDelete"
                name="verifyDelete"
                className="mt-2"
                pattern="\s*delete my property\s*"
                required
                aria-required="true"
                aria-invalid={deleteInput !== 'delete my property'}
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                onChange={(e) => { setDeleteInput(e.target.value) }}
              />
            </div>
          </div>
        </DialogBody>
        <DialogActions>
          <Button type="button" variant="outline">Cancel</Button>
          <Button type="submit" variant="destructive" onClick={handleDeleteProperty}>Continue</Button>
        </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
