"use client"
import { ChevronDown, Slash } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePathname } from 'next/navigation'
import { Fragment } from "react"
export function HomeBreadcrumbs() {
  const pathname = usePathname()
  let segments = pathname.split('/').filter(segment => segment !== '')
  segments = segments.slice(1)
  console.log(segments)
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbSeparator className="mr-3">
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        {segments.map((segment, index) => (
          <>
            <BreadcrumbSeparator>
              <Slash />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${segments.slice(0, index + 1).join('/')}`}>
                {segment.charAt(0).toUpperCase() + segment.slice(1)}
              </BreadcrumbLink>
            </BreadcrumbItem>          
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
