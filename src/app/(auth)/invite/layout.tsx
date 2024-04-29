import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Join Your Property',
}

export default async function InviteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}