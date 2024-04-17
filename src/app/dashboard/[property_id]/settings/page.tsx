
import { RentCard } from '@/components/PropertySettings/RentCard'
import { DeleteCard } from '@/components/PropertySettings/DeleteCard'

export default function CurrentPropertySettings({ params } : { params: { property_id: string } }) {


  return (
    <>
      <div className="justify-center flex" >
        <main className="flex-auto lg:px-4 lg:py-4 max-w-2xl w-full space-y-4 sm:space-y-8">

          <RentCard />
          <DeleteCard propertyId={params.property_id}/>

        </main>
      </div>
    </>
  )
}