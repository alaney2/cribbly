import { NextResponse } from 'next/server';
import { Configuration, PlaidApi, Products, PlaidEnvironments, LinkTokenCreateRequest, CountryCode } from 'plaid';

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';
const PLAID_PRODUCTS: Products[] = (process.env.PLAID_PRODUCTS || Products.Transactions).split(',') as Products[];
const PLAID_COUNTRY_CODES: CountryCode[] = (process.env.PLAID_COUNTRY_CODES || 'US').split(',') as CountryCode[];
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
  const configs: LinkTokenCreateRequest = {
    user: {
      client_user_id: 'user-id',
    },
    client_name: 'Cribbly',
    products: PLAID_PRODUCTS,
    country_codes: PLAID_COUNTRY_CODES,
    language: 'en',
    // redirect_uri: 'http://localhost:3000/dashboard',
  };

  if (PLAID_REDIRECT_URI !== '') {
    configs.redirect_uri = PLAID_REDIRECT_URI;
  }

  const createTokenResponse = await client.linkTokenCreate(configs);
  return NextResponse.json(createTokenResponse.data);
}
