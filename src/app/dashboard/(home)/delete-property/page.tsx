import { DeleteCard } from '@/components/PropertySettings/DeleteCard'

export default function CurrentPropertySettings({ params } : { params: { property_id: string } }) {

  return (
    <>
      <div className="justify-around flex h-full" >
        <main className="flex-auto lg:px-4 lg:py-4 w-full space-y-4 sm:space-y-8 flex justify-center items-center min-h-full">
          <div className="grid mb-16">
            <div className="">
              <DeleteCard propertyId={params.property_id}/>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}