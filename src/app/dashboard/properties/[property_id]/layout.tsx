import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function PropertyLayout({ params } : { params: { property_id: string } }) {
  const supabase = createClient()
  const { data, error } = await supabase.from('properties').select()
  .eq('id', params.property_id)

  if (error) {
    redirect('/dashboard')
  }
}