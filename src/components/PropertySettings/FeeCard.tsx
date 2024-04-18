import * as React from "react"

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
import { Separator } from "@/components/ui/separator"

export function FeeCard() {
  return (
    <Card className="w-[350px] sm:w-[650px]">
      <CardHeader>
        <CardTitle>Fees</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 text-sm mb-6">
          Set the total amount
        </p>
        <form>
          <div className="relative">
            {/* <Label htmlFor="name">Name</Label> */}
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 font-semibold text-md ">$</span>
            </div>
            <Input
              type="number"
              id="rentAmount" 
              placeholder="0"
              className="py-1.5 pl-7 pr-12 resize-none font-semibold text-md max-w-xs"
            />
          </div>
            
        </form>
      </CardContent>
      <Separator className="mt-1" />
      <CardFooter className="flex justify-end gap-x-3">
        <Button variant="outline" size="sm">Cancel</Button>
        <Button size="sm">Save</Button>
      </CardFooter>
    </Card>
  )
}
