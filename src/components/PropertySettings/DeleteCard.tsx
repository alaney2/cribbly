"use client"
import * as React from "react"
import { deleteProperty } from '@/utils/supabase/actions'
import { Heading } from '@/components/catalyst/heading'
import { Strong, Text, TextLink } from '@/components/catalyst/text'
import { Button } from "@/components/catalyst/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/catalyst/input"
import { Field, Label } from "@/components/catalyst/fieldset"
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/catalyst/dialog'
import { useRouter } from 'next/navigation'
import { Separator } from "@/components/ui/separator"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { useSWRConfig } from "swr"
import { toast } from 'sonner'

export function DeleteCard({ propertyId }: { propertyId: string }) {
  const router = useRouter()
  const [deleteInput, setDeleteInput] = React.useState('')
  let [isOpen, setIsOpen] = React.useState(false)
  const { mutate } = useSWRConfig()
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDeleteProperty = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (deleteInput !== 'delete my property') return;
    setIsDeleting(true)
    const toastId = toast.loading('Deleting property...')
    try {
      // toast.loading('Deleting property...')
      await deleteProperty(propertyId)
      mutate('properties')
      toast.success('Property has been deleted', {
        id: toastId,
        duration: 5000
      });
      router.push('/dashboard')
    } catch (error) {
      toast.error('Error deleting property', {
        id: toastId,
      });
      console.error(error)
    } finally {
      setIsDeleting(false)
      setIsOpen(false)
    }
  }
  return (
    <>
    <Card className="w-full border border-red-500/25">
      <CardHeader>
        {/* <CardTitle> */}
          <Heading>
            Delete property
          </Heading>
        {/* </CardTitle> */}
      </CardHeader>
      <CardContent>
        <Text >
          Permanently remove your property and all of its contents from the Cribbly platform. This action is irreversible.
        </Text>
      </CardContent>
      <CardFooter className="flex justify-end ">
        <Button type="button" color="red" onClick={() => setIsOpen(true)}>Delete property</Button>
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
            <Alert variant="destructive" className="bg-red-300/75 px-3 py-2 mb-4 font-semibold text-sm rounded-lg">
              <AlertTitle><span className="text-gray-50">Warning: </span>This action is not reversible. Please be certain.</AlertTitle>
            </Alert>
            <Field className="items-center">
              <Label htmlFor="verifyDelete" className="">
                To verify, type <span className="font-bold">delete my property</span> below:
              </Label>
              <Input
                type="text"
                id="verifyDelete"
                name="verifyDelete"
                className="mt-2"
                pattern="\s*delete my property\s*"
                title="Validate the input by typing 'delete my property' exactly as shown."
                required={true}
                aria-required="true"
                aria-invalid={deleteInput !== 'delete my property'}
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                onChange={(e) => { setDeleteInput(e.target.value) }}
              />
            </Field>
          </div>
        </DialogBody>
        <DialogActions>
          <Button type="button" outline>Cancel</Button>
          <Button type="submit" color="red" onClick={handleDeleteProperty}>Delete</Button>
        </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
