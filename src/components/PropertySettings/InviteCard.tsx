"use client"

import { Button } from "@/components/ui/button"
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function InviteCard() {
  const [fadeOut, setFadeOut] = useState(false);
  const animationClass = fadeOut ? ' animate__fadeOut' : 'animate__fadeIn';

  return (
    <>
    <Card className={`w-[350px] sm:w-[400px] animate__animated animate__faster ${animationClass}`}>
      <CardHeader>
        <CardTitle>Invite tenants</CardTitle>
      </CardHeader>
      <CardContent>

      </CardContent>
      <Separator className="mt-0" />

      <CardFooter className="flex items-center">
        <div className="flex gap-x-3">
          <Button type="submit" size="sm">Continue</Button>
        </div>
      </CardFooter>
    </Card>
    </>
  )
}