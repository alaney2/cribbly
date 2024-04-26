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
import InviteUserEmail from '@/components/PropertySettings/InviteUserEmail';
import { Resend } from 'resend';
import { sendInviteEmail } from '@/utils/resend/actions';

type InviteCardProps = {
  propertyId: string
  setPropertyId?: (propertyId: string) => void
}

export function InviteCard({ propertyId, setPropertyId }: InviteCardProps) {
  useEffect(() => {
    if (typeof window !== "undefined" && setPropertyId && !propertyId) {
      setPropertyId(localStorage.getItem('propertyId') || '')
    }
  }, [propertyId, setPropertyId])

  const [fadeOut, setFadeOut] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const animationClass = fadeOut ? ' animate__fadeOut' : 'animate__fadeIn';
  // const resend = new Resend('re_GMbJz3MW_K175ScDJdkrMMWNanGZWB8PH')

  return (
    <>
    <Card className={`w-[350px] sm:w-[400px] animate__animated animate__faster ${animationClass}`}>
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
              console.log('Email awaiting')
              // await resend.emails.send({
              //   from: 'alanyao.training@gmail.com',
              //   to: 'alanyao2002@gmail.com',
              //   subject: 'Your Invite to Cribbly',
              //   react: <InviteUserEmail />,
              // });
              await sendInviteEmail(formData)
              console.log('Email sent!')
              setEmail('');
              setFullName('');
              resolve('Email sent!')
              // const data = await addPropertyFees(formData)
              // resolve('Rent and fees added!')
              // buttonOnClick && setFadeOut(true)
              // buttonOnClick && setTimeout(buttonOnClick, 300)
            } catch (error) {
              console.error(error)
              reject(error)
            }
          }), {
            loading: 'Adding...',
            success: 'Rent and fees added!',
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
      </CardContent>
      <Separator className="mt-0" />

      <CardFooter className="flex justify-end">
        {/* <div className="flex justify-end items-end gap-x-3"> */}
        <Button type="submit" size="sm" className="">
          Send email
        </Button>
        {/* </div> */}
      </CardFooter>
      </form>
    </Card>
    </>
  )
}