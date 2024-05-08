import { TenantsTable } from "@/components/Tenant/TenantsTable"
import { BentoStats } from '@/components/Dashboard/BentoStats'
import { PropertyStats } from '@/components/Dashboard/PropertyStats'
import { Button } from '@/components/catalyst/button'

export default function TenantsPage({ params } : { params: { property_id: string } }) {

  return (
    <>
      <div className="p-6 md:p-8 mb-8 lg:mb-0">
        <div className=''>
          <TenantsTable propertyId={params.property_id}/>
        </div>
      </div>
    </>
  )
}