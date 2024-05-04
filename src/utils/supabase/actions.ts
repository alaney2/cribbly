"use server"
import { createClient } from '@/utils/supabase/server';
import { generateId } from '@/lib/utils';
import { calculateRentDates } from '@/utils/helpers'
import { redirect } from 'next/navigation'

export async function deleteInvite(token: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from('property_invites')
    .delete()
    .eq('token', token);
  if (error) {
    throw new Error('Error deleting invite');
  }
}

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

export async function editFee(formData: FormData) {
  const supabase = createClient();
  const feeType = String(formData.get('feeType'));
  const fee_type: "one-time" | "recurring" | undefined = feeType === "one-time" || feeType === "recurring" ? feeType : undefined;
  const fee_id = String(formData.get('feeId'))
  const fee_name = String(formData.get('feeName'))
  const fee_cost = String(formData.get('feeCost'))
  const { error } = await supabase.from('property_fees')
    .update({
      fee_name,
      fee_type,
      fee_cost: Number(parseFloat(fee_cost).toFixed(2))
    })
    .eq('id', fee_id)
  if (error) {
    console.error(error)
    throw new Error()
  }
}

export async function deleteFee(feeId: string) {
  const supabase = createClient();
  // const fee_type = String(formData.get('feeType'))
  // const fee_id = String(formData.get('feeId'))
  // const fee_name = String(formData.get('feeName'))
  // const fee_cost = String(formData.get('feeCost'))
  const { error } = await supabase.from('property_fees')
    .delete()
    .eq('id', feeId)
  if (error) {
    console.error(error)
    throw new Error()
  }
}

export async function addPropertyFees(formData: FormData) {
  const propertyId = formData.get('propertyId')
  if (!propertyId) return;
  const securityDepositSwitch = formData.get('securityDepositSwitch')
  let startDate = new Date(String(formData.get('startDate')))
  let endDate = new Date(String(formData.get('endDate')))
  const rent_id = String(formData.get('rent_id'))
  const rentInfo = calculateRentDates(startDate, endDate);
  const monthsOfRent = rentInfo.monthsOfRent;
  const rentDates = rentInfo.rentDates;
  const supabase = createClient();
  for (const pair of formData.entries()) {
    console.log(pair)
    if (pair[0] === 'rentAmount') {
      const { error } = await supabase.from('property_rents')
        .upsert(
          {
            id: rent_id ? rent_id : generateId(),
            property_id: propertyId.toString(),
            rent_price: Number(parseFloat(pair[1].toString()).toFixed(2)),
            rent_start: startDate,
            rent_end: endDate,
            months_left: monthsOfRent,
          }, {
            onConflict: 'property_id',
            ignoreDuplicates: false,
          }
        );
      if (error) {
        console.error(error);
        return {
          message: 'Error adding rent amount'
        }
      }
      continue;
    }
    if (pair[0] === 'depositAmount' && securityDepositSwitch === 'on') {
      const { error } = await supabase.from('property_security_deposits')
        .upsert(
          {
            id: generateId(),
            property_id: propertyId.toString(),
            deposit_amount: Number(parseFloat(pair[1].toString()).toFixed(2)),
            status: 'unpaid',
          }, {
            onConflict: 'property_id',
            ignoreDuplicates: false,
          }
        );
      if (error) {
        console.error(error);
        return {
          message: 'Error adding security deposit'
        }
      }
      continue;
    }
    if (pair[0].startsWith('fee')) {
      const fee = JSON.parse(pair[1].toString())
      const { error } = await supabase.from('property_fees')
        .upsert(
          {
            id: fee.id ? fee.id : generateId(),
            property_id: propertyId.toString(),
            fee_name: fee.fee_name,
            fee_type: fee.fee_type,
            fee_cost: Number(parseFloat(fee.fee_cost).toFixed(2)),
            months_left: fee.fee_type === 'recurring' ? monthsOfRent : 1,
            start_date: startDate,
            end_date: endDate,
          }, {
            onConflict: 'id, property_id, fee_name, fee_type, fee_cost, start_date, end_date',
            ignoreDuplicates: false,
          }
        );
      if (error) {
        console.error(error);
        return {
          message: 'Error adding fee'
        }
      }
    }
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

  const { data, error } = await supabase.from('properties').upsert(
    {
      user_id: user.id,
      street_address,
      zip,
      apt,
      city,
      state,
      country
    }, {
      onConflict: 'user_id, street_address, zip, apt, city, state, country',
      ignoreDuplicates: false,
    })
    .select()
    .single()

  if (error) {
    console.error(error);
    throw new Error('Unable to add property')
  }

  return data;
}

export async function setWelcomeScreen(value: boolean) {
  const user = await getUser();
  if (!user) return;
  const supabase = createClient();

  await supabase
    .from('users')
    .update({ welcome_screen: value })
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

  const { data, error } = await supabase.from('properties').upsert(
    {
      user_id: user.id,
      street_address,
      zip,
      apt,
      city,
      state,
      country
    }, {
      onConflict: 'user_id, street_address, zip, apt, city, state, country',
      ignoreDuplicates: false,
    })
    .select()
    .single()

  if (error) {
    console.error(error);
    throw new Error(error.message)
  }

  redirect(`/dashboard/${data.id}/settings`);
  return data
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
