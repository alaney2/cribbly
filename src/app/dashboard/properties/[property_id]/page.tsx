"use client"
import '@/styles/auth.css'
import { deleteProperty } from '@/utils/supabase/actions'
import { useRouter } from 'next/navigation'

export default function CurrentProperty({ params } : { params: { property_id: string } }) {
  const router = useRouter()

  const handleDeleteProperty = async () => {
    await deleteProperty(params.property_id)
    router.push('/dashboard')
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