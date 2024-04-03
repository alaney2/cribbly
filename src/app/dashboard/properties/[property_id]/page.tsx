import '@/styles/auth.css'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function CurrentProperty({ params } : { params: { property_id: string } }) {
  const supabase = createClient()
  let { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/sign-in')
  }
  // Check if the user contains the property with property_id in supabase
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('user_id', user.id)
    .eq('id', params.property_id)
    .single()
    
  if (error) {
    redirect('/sign-in')
  }

  return (
    <>
      <div className="p-6 md:p-8" style={{ height: 'calc(100vh - 48px)' }}>
        {params.property_id}
      </div>
    </>
  )
}