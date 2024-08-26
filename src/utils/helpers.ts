import type { Tables } from '@/types_db';

type Price = Tables<'prices'>;

export function daysBetween(first: Date, second: Date) {
  const date1 = Date.UTC(first.getFullYear(), first.getMonth(), first.getDate());
  const date2 = Date.UTC(second.getFullYear(), second.getMonth(), second.getDate());
  const ms = date1 - date2;
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  return Math.floor(ms / millisecondsPerDay);
}

export function calculateRentDates(start: Date, end: Date) {
  const rentDates = [];
  rentDates.push(start);

  let monthsDiff = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  
  // Subtract one month if the end day is before the start day
  if (end.getDate() < start.getDate()) {
    monthsDiff--;
  }

  for (let i = 1; i <= monthsDiff; i++) {
    const nextMonth = new Date(start.getFullYear(), start.getMonth() + i, 1);
    if (nextMonth < end) {
      rentDates.push(nextMonth);
    } else if (nextMonth.getTime() === end.getTime() && start.getDate() === 1) {
      rentDates.push(nextMonth)
    }
  }

  return {
    monthsOfRent: rentDates.length,
    rentDates: rentDates
  };
}

export const getInitials = (name: string) => {
  const initials = name?.match(/\b\w/g) || [];
  return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
}

export const getURL = (path: string = '') => {
  let url = 
    process?.env?.NEXT_PUBLIC_SITE_URL ||
    process?.env?.NEXT_PUBLIC_VERCEL_URL ||
    'https://www.cribbly.io';  // Fallback to your production URL

  // Trim the URL and remove trailing slash if exists
  url = url.trim().replace(/\/+$/, '');
  
  // Include `https://` when not localhost
  url = url.includes('http') ? url : `https://${url}`;
  
  // Ensure path starts without a slash to avoid double slashes in the final URL
  path = path.replace(/^\/+/, '');

  // Concatenate the URL and the path
  return path ? `${url}/${path}` : url;
};

export const postData = async ({
  url,
  data
}: {
  url: string;
  data?: { price: Price };
}) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    credentials: 'same-origin',
    body: JSON.stringify(data)
  });

  return res.json();
};

export const toDateTime = (secs: number) => {
  var t = new Date(+0); // Unix epoch start.
  t.setSeconds(secs);
  return t;
};

export const calculateTrialEndUnixTimestamp = (
  trialPeriodDays: number | null | undefined
) => {
  // Check if trialPeriodDays is null, undefined, or less than 2 days
  if (
    trialPeriodDays === null ||
    trialPeriodDays === undefined ||
    trialPeriodDays < 2
  ) {
    return undefined;
  }

  const currentDate = new Date(); // Current date and time
  const trialEnd = new Date(
    currentDate.getTime() + (trialPeriodDays + 1) * 24 * 60 * 60 * 1000
  ); // Add trial days
  return Math.floor(trialEnd.getTime() / 1000); // Convert to Unix timestamp in seconds
};

const toastKeyMap: { [key: string]: string[] } = {
  status: ['status', 'status_description'],
  error: ['error', 'error_description']
};

const getToastRedirect = (
  path: string,
  toastType: string,
  toastName: string,
  toastDescription: string = '',
  disableButton: boolean = false,
  arbitraryParams: string = ''
): string => {
  const [nameKey, descriptionKey] = toastKeyMap[toastType];

  let redirectPath = `${path}?${nameKey}=${encodeURIComponent(toastName)}`;

  if (toastDescription) {
    redirectPath += `&${descriptionKey}=${encodeURIComponent(toastDescription)}`;
  }

  if (disableButton) {
    redirectPath += `&disable_button=true`;
  }

  if (arbitraryParams) {
    redirectPath += `&${arbitraryParams}`;
  }

  return redirectPath;
};

export const getStatusRedirect = (
  path: string,
  statusName: string,
  statusDescription: string = '',
  disableButton: boolean = false,
  arbitraryParams: string = ''
) =>
  getToastRedirect(
    path,
    'status',
    statusName,
    statusDescription,
    disableButton,
    arbitraryParams
  );

export const getErrorRedirect = (
  path: string,
  errorName: string,
  errorDescription: string = '',
  disableButton: boolean = false,
  arbitraryParams: string = ''
) =>
  getToastRedirect(
    path,
    'error',
    errorName,
    errorDescription,
    disableButton,
    arbitraryParams
  );
