"use client"

import {
  DropdownItem,
  DropdownLabel,
} from '@/components/catalyst/dropdown'
import {
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/16/solid'
import { signOut } from '@/utils/supabase/sign-out'

export function SignOutDropdown() {
  return (
    <DropdownItem onClick={async () => {
      await signOut()
    }}>
      <ArrowRightStartOnRectangleIcon />
      <DropdownLabel>Sign out</DropdownLabel>
    </DropdownItem>
  )
}
