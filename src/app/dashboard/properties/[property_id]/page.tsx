"use client"
import '@/styles/auth.css'
import { createClient } from '@/utils/supabase/client'
import { deleteProperty } from '@/utils/supabase/actions'
import { redirect } from 'next/navigation'

export default function CurrentProperty({ params } : { params: { property_id: string } }) {
  
  const handleDeleteProperty = async () => {
    await deleteProperty(params.property_id)
    // Redirect or perform any other action after deleting the property
    redirect('/dashboard')
  }

  return (
    <>
      <div className="p-6 md:p-8" >
        <div className='mr-8'>
          {params.property_id}
        </div>
        <button onClick={handleDeleteProperty}>
          Delete property
        </button>
      </div>
    </>
  )
}