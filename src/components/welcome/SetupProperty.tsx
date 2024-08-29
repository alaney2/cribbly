'use client'
import { RentCard } from '@/components/PropertySettings/RentCard'
import { FeeCard } from '@/components/PropertySettings/FeeCard'
import { getUser } from '@/utils/supabase/actions'
import { createClient } from '@/utils/supabase/client'
import useSWR from 'swr'

type SetupPropertyProps = {
  propertyId: string
  setPropertyId: (propertyId: string) => void
  buttonOnClick: () => void
}

const fetcher = async () => {
  const supabase = createClient()
  const user = await getUser()
  if (!user) return 0
  const { data, error } = await supabase
    .from('users')
    .select('free_months')
    .eq('id', user.id)
    .single()
  if (error) {
    console.error(error)
    return 0
  }
  return data?.free_months || 0
}

export function SetupProperty({
  propertyId,
  setPropertyId,
  buttonOnClick,
}: SetupPropertyProps) {
  // const [fadeOut, setFadeOut] = useState(false);

  // const animationClass = fadeOut ? 'animate__animated animate__fadeOut animate__faster' : '';
  const { data, error, isLoading } = useSWR('freeMonthsLeft', fetcher)

  return (
    <>
      <div
        className={`relative flex h-full flex-col items-center justify-center gap-y-4 px-2 pt-8 sm:pt-4`}
      >
        <RentCard
          propertyId={propertyId}
          setPropertyId={setPropertyId}
          freeMonthsLeft={data}
          buttonOnClick={buttonOnClick}
        />
        {/* <FeeCard /> */}
      </div>
    </>
  )
}
