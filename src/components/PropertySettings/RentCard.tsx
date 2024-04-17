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

export function RentCard() {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Rent amount</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 text-sm mb-4">
          Set the total amount of rent to charge for this property per month. If needed, tenants can decide to split this amount amongst themselves.
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
      <Separator />
      <CardFooter className="flex justify-end gap-x-3">
        <Button variant="outline" size="sm">Cancel</Button>
        <Button size="sm">Save</Button>
      </CardFooter>
    </Card>
  )
}
