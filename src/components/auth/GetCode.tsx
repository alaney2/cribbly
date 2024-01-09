"use client"
import { useSearchParams } from 'next/navigation'

export function GetCode() {
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  
  console.log(code);
  return code;
}