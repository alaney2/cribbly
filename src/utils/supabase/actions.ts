"use server"
import { createClient } from '@/utils/supabase/server';

export async function getUser() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user;
}

export async function updateFullName(formData: FormData) {
  const user = await getUser();
  if (!user) return;
  const supabase = createClient();
  const name = String(formData.get('name'));
  if (!name) return;
  const { error } = await supabase
    .from('users')
    .update({ full_name: name })
    .eq('id', user.id);

  if (error) {
    console.error(error);
  }

}

export async function getSubscription() {
  const supabase = createClient();

  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .maybeSingle();

  return { subscription, error };
}

export async function getProducts() {
  const supabase = createClient();

  const { data: products } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    // .order('unit_amount', { referencedTable: 'prices' });

  return products;
}
