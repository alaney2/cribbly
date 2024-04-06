import '@/styles/auth.css'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function PropertyLayout({ params, children } : { params: { property_id: string };  children: React.ReactNode }) {
  const supabase = createClient()
  const { data, error } = await supabase.from('properties').select()
    .eq('id', params.property_id)

  if (error) {
    redirect('/dashboard')
  }

  return (
    <>
      <div className="content-container">
      {children}
      </div>
    </>
  )
}