import type { Tables } from "@/types_db";
import { differenceInDays, getDaysInMonth } from "date-fns";

type Price = Tables<"prices">;

export function daysBetween(first: Date, second: Date) {
	const date1 = Date.UTC(
		first.getFullYear(),
		first.getMonth(),
		first.getDate(),
	);
	const date2 = Date.UTC(
		second.getFullYear(),
		second.getMonth(),
		second.getDate(),
	);
	const ms = date1 - date2;
	const millisecondsPerDay = 1000 * 60 * 60 * 24;
	return Math.floor(ms / millisecondsPerDay);
}

export function calculateProratedRent(
	rentAmount: number,
	periodStart: Date,
	periodEnd: Date,
) {
	const daysInPeriod = differenceInDays(periodEnd, periodStart) + 1;
	const daysInMonth = getDaysInMonth(periodStart);
	const proratedAmount = Math.ceil((rentAmount * daysInPeriod) / daysInMonth);
	return proratedAmount;
}

export function calculateRentDates(start: Date, end: Date, rentAmount: number) {
	const rentDates = [];
	let totalRent = 0;
	let currentDate = new Date(start);

	while (currentDate <= end) {
		const rentPeriodStart = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth(),
			1,
		);
		const rentPeriodEnd = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth() + 1,
			0,
		);

		let amountDue = rentAmount;
		if (start > rentPeriodStart) {
			// Lease starts after the rent period start date
			rentPeriodStart.setTime(start.getTime());
			amountDue = calculateProratedRent(
				rentAmount,
				rentPeriodStart,
				rentPeriodEnd,
			);
		}
		if (end < rentPeriodEnd) {
			// Lease ends before the rent period end date
			rentPeriodEnd.setTime(end.getTime());
			amountDue = calculateProratedRent(
				rentAmount,
				rentPeriodStart,
				rentPeriodEnd,
			);
		}

		rentDates.push({
			date: new Date(rentPeriodStart),
			amount: amountDue,
		});

		totalRent += amountDue;
		currentDate = new Date(
			rentPeriodEnd.getFullYear(),
			rentPeriodEnd.getMonth() + 1,
			1,
		);
	}

	return {
		monthsOfRent: rentDates.length,
		rentDates: rentDates,
		totalRent: totalRent,
	};
}

export const getInitials = (name: string) => {
	const initials = name?.match(/\b\w/g) || [];
	return ((initials.shift() || "") + (initials.pop() || "")).toUpperCase();
};

export const getURL = (path = "") => {
	let url =
		process?.env?.NEXT_PUBLIC_SITE_URL ||
		process?.env?.NEXT_PUBLIC_VERCEL_URL ||
		"https://www.cribbly.io"; // Fallback to your production URL

	// Trim the URL and remove trailing slash if exists
	url = url.trim().replace(/\/+$/, "");

	// Include `https://` when not localhost
	url = url.includes("http") ? url : `https://${url}`;

	// Ensure path starts without a slash to avoid double slashes in the final URL
	const replacedPath = path.replace(/^\/+/, "");

	// Concatenate the URL and the replacedPath
	return replacedPath ? `${url}/${replacedPath}` : url;
};

export const postData = async ({
	url,
	data,
}: {
	url: string;
	data?: { price: Price };
}) => {
	const res = await fetch(url, {
		method: "POST",
		headers: new Headers({ "Content-Type": "application/json" }),
		credentials: "same-origin",
		body: JSON.stringify(data),
	});

	return res.json();
};

export const toDateTime = (secs: number) => {
	const t = new Date(+0); // Unix epoch start.
	t.setSeconds(secs);
	return t;
};

export const calculateTrialEndUnixTimestamp = (
	trialPeriodDays: number | null | undefined,
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
		currentDate.getTime() + (trialPeriodDays + 1) * 24 * 60 * 60 * 1000,
	); // Add trial days
	return Math.floor(trialEnd.getTime() / 1000); // Convert to Unix timestamp in seconds
};

const toastKeyMap: { [key: string]: string[] } = {
	status: ["status", "status_description"],
	error: ["error", "error_description"],
};

const getToastRedirect = (
	path: string,
	toastType: string,
	toastName: string,
	toastDescription = "",
	disableButton = false,
	arbitraryParams = "",
): string => {
	const [nameKey, descriptionKey] = toastKeyMap[toastType];

	let redirectPath = `${path}?${nameKey}=${encodeURIComponent(toastName)}`;

	if (toastDescription) {
		redirectPath += `&${descriptionKey}=${encodeURIComponent(toastDescription)}`;
	}

	if (disableButton) {
		redirectPath += "&disable_button=true";
	}

	if (arbitraryParams) {
		redirectPath += `&${arbitraryParams}`;
	}

	return redirectPath;
};

export const getStatusRedirect = (
	path: string,
	statusName: string,
	statusDescription = "",
	disableButton = false,
	arbitraryParams = "",
) =>
	getToastRedirect(
		path,
		"status",
		statusName,
		statusDescription,
		disableButton,
		arbitraryParams,
	);

export const getErrorRedirect = (
	path: string,
	errorName: string,
	errorDescription = "",
	disableButton = false,
	arbitraryParams = "",
) =>
	getToastRedirect(
		path,
		"error",
		errorName,
		errorDescription,
		disableButton,
		arbitraryParams,
	);
