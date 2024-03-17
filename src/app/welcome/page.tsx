import WelcomeLayout from "@/components/welcome/WelcomeLayout";
import { getUser, getSubscription, getProducts } from '@/utils/supabase/actions';

export default async function WelcomePage() {
  const user = await getUser();
  const { subscription, error } = await getSubscription();
  if (error) {
    console.log(error);
  }
  const products = await getProducts();

  return (
    <WelcomeLayout user={user} subscription={subscription} products={products} />
  );
}