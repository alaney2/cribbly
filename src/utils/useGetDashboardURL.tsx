"use client"
import { useMemo } from 'react'
import { usePathname } from 'next/navigation'

export function useGetDashboardURL() {
  const pathname = usePathname()
  
  return useMemo(() => {
    const match = pathname.match(/\/dashboard\/([^/]+)/)
    const propertyId = match ? match[1] : ''
    
    return (href: string = '') => {
      let url = `/dashboard/${propertyId}`
      if (href !== '') {
        url += `/${href}`
      }
      return url
    }
  }, [pathname])
}