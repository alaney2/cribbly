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
      <div className="p-6 md:p-8 content-container">
      {children}
      </div>
    </>
  )
}