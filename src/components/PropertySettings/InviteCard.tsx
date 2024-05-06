"use client"

import { Button } from "@/components/ui/button"
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from 'sonner';
import { sendInviteEmail } from '@/utils/resend/actions';
import { setWelcomeScreen, deleteInvite } from '@/utils/supabase/actions'
import { useRouter } from 'next/navigation'
import useSWR from 'swr';
import { createClient } from '@/utils/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/catalyst/table'
import { TrashIcon } from "@heroicons/react/24/outline"
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const fetcher = async (propertyId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('property_invites')
    .select('*')
    .eq('property_id', propertyId);
  if (error) {
    throw error;
  }
  return data;
};

type InviteCardProps = {
  propertyId: string
  setPropertyId?: (propertyId: string) => void
  finishWelcome?: boolean
  setFinishWelcome?: (finishWelcome: boolean) => void
}

export function InviteCard({ propertyId, setPropertyId, finishWelcome, setFinishWelcome }: InviteCardProps) {
  useEffect(() => {
    if (typeof window !== "undefined" && setPropertyId && !propertyId) {
      setPropertyId(localStorage.getItem('propertyId') || '')
    }
  }, [propertyId, setPropertyId])

  

  const { data: invites, error, isLoading, mutate } = useSWR(propertyId ? ['invitesSent', propertyId] : null, ([_, propertyId]) => fetcher(propertyId));

  useEffect(() => {
    if (invites && invites.length > 0 && setFinishWelcome && !finishWelcome) {
      setFinishWelcome(true)
    }
  }, [finishWelcome, invites, isLoading, setFinishWelcome])

  const [fadeOut, setFadeOut] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const animationClass = fadeOut ? ' animate__fadeOut' : 'animate__fadeIn';

  const handleDeleteInvite = async (token: string) => {
    try {
      await deleteInvite(token)
      mutate()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
    <Card className={`w-[350px] sm:w-[400px] animate__animated animate__faster} ${animationClass}`}>
      <CardHeader>
        <CardTitle>Invite tenants</CardTitle>
        <CardDescription className="text-gray-500 text-sm mb-4">
          Invite a tenant through email to this property
        </CardDescription>
      </CardHeader>
      <form
        action={async (formData) => {
          toast.promise(new Promise(async (resolve, reject) => {
            try {
              console.log('IM HERE')
              await sendInviteEmail(formData)
              mutate()
              setEmail('');
              setFullName('');
              resolve('Email sent!')
              // setFinishWelcome && setFinishWelcome(true)
              // const data = await addPropertyFees(formData)
              // resolve('Rent and fees added!')
              // buttonOnClick && setFadeOut(true)
              // buttonOnClick && setTimeout(buttonOnClick, 300)
            } catch (error) {
              console.error(error)
              reject(error)
            }
          }), {
            loading: 'Inviting...',
            success: 'Tenant has been invited!',
            error: 'An error occurred, please check the form and try again.'
          })
        }}
      >
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="fullName">Name (optional)</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              name="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
        </div>
        <input name='propertyId' defaultValue={propertyId} readOnly className="hidden" />
        {isLoading && !invites && (
          <div className="mt-6">
            <Skeleton count={2} />
          </div>
        )}
        {invites && invites.length > 0 && (
          <div className="mt-6">
            <h3 className="text-md font-semibold mb-2">Invites Sent</h3>
            <Table striped>
              <TableHead>
                <TableRow>
                  <TableHeader>Name</TableHeader>
                  <TableHeader>Email</TableHeader>
                  <TableHeader></TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {invites.map((invite) => (
                  <TableRow key={invite.token}>
                    <TableCell>{invite.full_name || '-'}</TableCell>
                    <TableCell>{invite.email}</TableCell>
                    <TableCell>
                      <button type="button" onClick={() => {handleDeleteInvite(invite.token)}}>
                      <TrashIcon className="size-5 text-red-600 hover:text-red-500" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <Separator className="mt-0" />

      <CardFooter className="flex justify-end">
        <Button type="submit" size="sm" className="">
          Send email
        </Button>
      </CardFooter>
      </form>
    </Card>
    {/* <Button disabled={!finishWelcome} className="mt-8" 
      onClick={async () => {
        setFadeOut(true)
        localStorage.removeItem('propertyId')
        localStorage.removeItem('fullName')
        localStorage.removeItem('email')
        await setWelcomeScreen(false)
        router.push('/dashboard')
      }}
    >Finish setup
    </Button> */}
    </>
  )
}
