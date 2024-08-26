"use server"
import { createClient } from '@/utils/supabase/server'
import { BentoStats } from '@/components/Dashboard/BentoStats'
import { redirect } from 'next/navigation'
import { PropertyStats } from '@/components/Dashboard/PropertyStats'
import { Strong, Text, TextLink } from '@/components/catalyst/text'


export default async function CurrentProperty({ params } : { params: { property_id: string } }) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/sign-in')
  let currentPropertyId = user.user_metadata.currentPropertyId
  
  const { data: propertyData, error } = await supabase.from('properties')
    .select()
    .eq('id', currentPropertyId)

  if (error || propertyData.length === 0) {
    redirect('/dashboard')
  }

  let showBankText = false;

  const { data: existingAccounts } = await supabase
    .from('plaid_accounts')
    .select('account_id, use_for_payouts')
    .eq('user_id', user.id);

  if (existingAccounts && existingAccounts.length > 0) {
    showBankText = !existingAccounts.some(account => account.use_for_payouts === true);
  }
  
  const propertyAddress = propertyData[0]?.street_address

  return (
    <>
      <div className="mb-8 lg:mb-0 content-container">
        {showBankText &&
          <Text className="bg-red-500/25 rounded-lg px-4 py-1 mb-4">
            To enable payouts, please link a primary bank account in your {' '}
            <TextLink href="/dashboard/account">account settings</TextLink>.
          </Text>
        }
        <h1 className="lg:hidden text-xl font-semibold mb-8 ml-4 tracking-tight">{propertyData[0]?.street_address}, {propertyData[0]?.city} {propertyData[0]?.state} {propertyData[0]?.apt}</h1>
        <div className="mb-4 cursor-default">
          <PropertyStats currentPropertyId={currentPropertyId} />
        </div>

        <BentoStats />
        {/* <div className="flex justify-center mt-8">
          <Button color="blue" className="">Randomize data</Button>
        </div> */}
      </div>
    </>
  )
}