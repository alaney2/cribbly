import { NextResponse } from 'next/server';
import { Configuration, PlaidApi, Products, PlaidEnvironments } from 'plaid';
import { createClient } from '@/utils/supabase/server'
import { getURL } from '@/utils/helpers';

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';
const PLAID_PRODUCTS = (process.env.PLAID_PRODUCTS || Products.Transactions).split(',');
const PLAID_COUNTRY_CODES = (process.env.PLAID_COUNTRY_CODES || 'US').split(',');
const PLAID_REDIRECT_URI = process.env.PLAID_REDIRECT_URI || '';

// We store the access_token in memory - in production, store it in a secure
// persistent data store
let ACCESS_TOKEN = null;
let PUBLIC_TOKEN = null;
let ITEM_ID = null;
let ACCOUNT_ID = null;

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

export async function POST(request: Request) {
  const json = await request.json();
  const PUBLIC_TOKEN = json.publicToken;

  try {
    const exchangeTokenResponse = await client.itemPublicTokenExchange({
      public_token: PUBLIC_TOKEN,
    });
    // Store in supabase
    ACCESS_TOKEN = exchangeTokenResponse.data.access_token;
    ITEM_ID = exchangeTokenResponse.data.item_id;

    const supabase = createClient()

    const { data: {user} } = await supabase.auth.getUser()

    if (!user) {
      return Response.redirect(getURL('/sign-in'))
    }

    const authResponse = await client.authGet({
      access_token: ACCESS_TOKEN,
    });

    const { accounts, item, numbers: { ach } } = authResponse.data;

    if (!item.available_products.includes(Products.Transfer)) {
      return NextResponse.json({
        error: 'This institution does not have transfer capabilities',
      })
    }

    let accountId = null;

    for (let i = 0; i < accounts.length; i++) {
      const { account_id, name, mask, official_name, type, subtype } = accounts[i]
      const { account, routing, wire_routing } = ach[i]

      const { error } = await supabase.from('plaid_accounts').insert([
        {
          account_id,
          user_id: user.id,
          access_token: ACCESS_TOKEN,
          item_id: ITEM_ID,
          account_number: account,
          routing_number: routing,
          wire_routing: wire_routing,
          mask: mask,
          name: name,
        }
      ])

      if (error) {
        return NextResponse.json({
          error: error,
        })
      }

      accountId = account_id
    }
  
    return NextResponse.json({
      success: 'Bank linked successfully',
      accountId: accountId,
    });

  } catch (error) {
    return NextResponse.json({
      error: error,
    });
  }
}
