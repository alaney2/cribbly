import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server';
import { Configuration, PlaidApi, Products, PlaidEnvironments, LinkTokenCreateRequest, CountryCode, InstitutionsGetByIdRequest } from 'plaid';
import { getURL } from '@/utils/helpers';

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';
const PLAID_PRODUCTS: Products[] = (process.env.PLAID_PRODUCTS || Products.Transactions).split(',') as Products[];
const PLAID_COUNTRY_CODES: CountryCode[] = (process.env.PLAID_COUNTRY_CODES || 'US').split(',') as CountryCode[];
const PLAID_REDIRECT_URI = process.env.PLAID_REDIRECT_URI || '';

// We store the access_token in memory - in production, store it in a secure
// persistent data store
let ACCESS_TOKEN: string | null = null;
let PUBLIC_TOKEN = null;
let ITEM_ID = null;
let ACCOUNT_ID = null;
// The payment_id is only relevant for the UK/EU Payment Initiation product.
// We store the payment_id in memory - in production, store it in a secure
// persistent data store along with the Payment metadata, such as userId .
let PAYMENT_ID = null;
// The transfer_id and authorization_id are only relevant for Transfer ACH product.
// We store the transfer_id in memory - in production, store it in a secure
// persistent data store
let AUTHORIZATION_ID = null;
let TRANSFER_ID = null;

const configuration = new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
      'PLAID-SECRET': PLAID_SECRET,
      'Plaid-Version': '2020-09-14',
    },
  },
});

const client = new PlaidApi(configuration);


export async function GET(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return Response.redirect(getURL('/sign-in'))
  }

  const { data, error } = await supabase.from('plaid_item_ids')
    .select()
    .eq('user_id', user.id)

    // const access_token = data[0].access_token
  // console.log(data)
  if (!data) {
    return NextResponse.json({ connected: false })
  }

  return NextResponse.json({ connected: true })
}