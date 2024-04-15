
import { RentCard } from '@/components/PropertySettings/RentCard'
import { DeleteCard } from '@/components/PropertySettings/DeleteCard'

export default function CurrentPropertySettings({ params } : { params: { property_id: string } }) {

  

  return (
    <>
      <div className="p-6 md:p-8 justify-center flex" >
        <main className="px-4 py-4 sm:px-6 flex-auto lg:px-4 lg:py-4 max-w-5xl w-full space-y-16 sm:space-y-20">

          <RentCard />
          <DeleteCard propertyId={params.property_id}/>
          <div className='mr-8'>
            {params.property_id}
          </div>
        </main>
      </div>
    </>
  )
}