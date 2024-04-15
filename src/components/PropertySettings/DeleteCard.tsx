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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
  const [buttonClicked, setButtonClicked] = React.useState(false)

  const handleDeleteProperty = async () => {
    setButtonClicked(true)
    if (deleteInput !== 'delete my property') return;
    await deleteProperty(propertyId)
    router.push('/dashboard')
  }
  return (
    <Card className="ring-1 ring-red-500/25">
      <CardHeader>
        <CardTitle>Delete property</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">
          Permanently remove your property and all of its contents from the Cribbly platform. This action is not reversible — please continue with caution.
        </p>
      </CardContent>
      <CardFooter className="flex justify-end bg-red-500/25">
        <Dialog onOpenChange={() => {setButtonClicked(false)}}>
          <DialogTrigger asChild>
            <Button variant="destructive" className="">Delete property</Button>
          </DialogTrigger>
          <DialogContent className="">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold mb-2">Delete property</DialogTitle>
            </DialogHeader>
            <div className="">
              <div className="mb-4 font-medium">
                This property will be deleted, along with its Settings, Tenants, Maintenance tasks, and all other Data.
              </div>
              <Alert variant="destructive" className="bg-red-300/75 px-3 py-2 mb-4 font-semibold text-sm">
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
                {buttonClicked && deleteInput !== 'delete my property' && (
                  <div className="mt-1 text-sm text-red-400 font-medium">
                    Please match the requested format
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" variant="destructive" onClick={handleDeleteProperty}>Continue</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}
