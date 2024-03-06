
import Pricing from '@/components/welcome/Pricing'

export default async function PricingPage({ user, subscription, products }: { user: any, subscription: any, products: any }) {

    return (
      <>
        <Pricing products={products ?? []} subscription={subscription} user={user} />
      </>
    )

}