"use server"
import { createClient } from '@/utils/supabase/server';
import { generateId } from '@/lib/utils';
import { calculateRentDates } from '@/utils/helpers'

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

// export async function calculateRentDates(startDate: string, endDate: string) {
//   const start = new Date(startDate);
//   const end = new Date(endDate);
//   const rentDates = [];
//   rentDates.push(start)

//   let monthsDiff = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
//   if (start.getDay() !== 1) {
//     monthsDiff -= 1;
//   }

//   for (let i = 1; i <= monthsDiff; i++) {
//     const nextMonth = new Date(start.getFullYear(), start.getMonth() + i, 1);
//     if (nextMonth.getTime() < end.getTime()) {
//       rentDates.push(nextMonth);
//     }
//   }

//   return {
//     monthsOfRent: monthsDiff + 1,
//     rentDates: rentDates
//   };
// }


export async function addPropertyFees(formData: FormData) {
  const propertyId = formData.get('propertyId')
  if (!propertyId) return;
  const securityDepositSwitch = formData.get('securityDepositSwitch')
  let startDate = new Date(String(formData.get('startDate')))
  let endDate = new Date(String(formData.get('endDate')))
  // console.log(new Date(startDate), new Date(endDate))
  const rentInfo = calculateRentDates(startDate, endDate);
  const monthsOfRent = rentInfo.monthsOfRent;
  const rentDates = rentInfo.rentDates;
  console.log(monthsOfRent, rentDates)
  const supabase = createClient();

  for (const pair of formData.entries()) {
    // if (pair[0] === 'propertyId' || pair[0] === 'securityDepositSwitch' || pair[0].startsWith('$')) continue;

    if (pair[0] === 'rentAmount') {

      const { error } = await supabase.from('property_rents')
        .insert(
          {
            id: generateId(),
            property_id: propertyId.toString(),
            rent_price: Number(parseFloat(pair[1].toString()).toFixed(2)),
            rent_start: new Date(startDate),
            rent_end: new Date(new Date(endDate)),
            months_left: 12,
          }
        );
      if (error) 
        return {
          message: 'Error adding rent amount'
        }
      continue;
    }
    if (pair[0] === 'depositAmount' && securityDepositSwitch === 'on') {
      const { error } = await supabase.from('property_security_deposits')
        .insert(
          {
            id: generateId(),
            property_id: propertyId.toString(),
            deposit_amount: Number(parseFloat(pair[1].toString()).toFixed(2)),
            status: 'unpaid',
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
        .insert(
          {
            id: generateId(),
            property_id: propertyId.toString(),
            fee_name: fee.name,
            fee_type: fee.type,
            fee_cost: Number(parseFloat(fee.amount).toFixed(2)),
            months_left: fee.fee_type === 'recurring' ? 12 : 1,
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

  const { data, error } = await supabase.from('properties').insert(
    {
      user_id: user.id,
      street_address,
      zip,
      apt,
      city,
      state,
      country
    })
    .select()
    .single()

  if (error) {
    console.error(error);
  }

  return data;

  // update supabase user table with welcome_screen = true
  // await supabase
  //   .from('users')
  //   .update({ welcome_screen: false })
  //   .eq('id', user.id);
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
