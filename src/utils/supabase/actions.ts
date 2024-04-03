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
  console.log('called function')
  if (!user) return;
  const supabase = createClient();
  const name = String(formData.get('name'));
  console.log(name)
  if (!name) return;
  const { error } = await supabase
    .from('users')
    .update({ full_name: name })
    .eq('id', user.id);

  if (error) {
    console.error(error);
  }
}

export async function addPropertyFromWelcome(formData: FormData) {
  const user = await getUser();
  if (!user) return;
  const supabase = createClient();
  const street_address = String(formData.get('street_address_hidden'));
  const zip = String(formData.get('zip_hidden'));
  const apt = String(formData.get('apt'));
  const city = String(formData.get('city_hidden'));
  const state = String(formData.get('state_hidden'));
  const country = String(formData.get('country_hidden'));

  if (!street_address || !zip || !city || !state || !country) return;
  // Check if the property already exists
  const { data: properties } = await supabase
    .from('properties')
    .select('id')
    .eq('user_id', user.id)
    .eq('street_address', street_address)
    .eq('zip', zip)
    .eq('apt', apt)
    .eq('city', city)
    .eq('state', state)
    .eq('country', country);
  
  if (properties && properties.length > 0) {
    return {
      message: 'Property already exists'
    }
  }

  const { error } = await supabase.from('properties').insert([
    {
      user_id: user.id,
      street_address,
      zip,
      apt,
      city,
      state,
      country
    }
  ]);

  if (error) {
    console.error(error);
  }

  // update supabase user table with welcome_screen = true
  await supabase
    .from('users')
    .update({ welcome_screen: false })
    .eq('id', user.id);
}

export async function addProperty(formData: FormData) {
  const user = await getUser();
  if (!user) return;
  const supabase = createClient();
  const street_address = String(formData.get('street_address_hidden'));
  const zip = String(formData.get('zip_hidden'));
  const apt = String(formData.get('apt'));
  const city = String(formData.get('city_hidden'));
  const state = String(formData.get('state_hidden'));
  const country = String(formData.get('country_hidden'));

  if (!street_address || !zip || !city || !state || !country) return;
  // Check if the property already exists
  const { data: properties } = await supabase
    .from('properties')
    .select('id')
    .eq('user_id', user.id)
    .eq('street_address', street_address)
    .eq('zip', zip)
    .eq('apt', apt)
    .eq('city', city)
    .eq('state', state)
    .eq('country', country);
  
  if (properties && properties.length > 0) {
    return {
      message: 'Property already exists'
    }
  }

  const { error } = await supabase.from('properties').insert([
    {
      user_id: user.id,
      street_address,
      zip,
      apt,
      city,
      state,
      country
    }
  ]);

  if (error) {
    console.error(error);
  }
}

export async function deleteProperty(propertyId: string) {
  const user = await getUser();
  if (!user) return;
  const supabase = createClient();

  const { error } = await supabase.from('properties').delete()
    .eq('id', propertyId)
  
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
