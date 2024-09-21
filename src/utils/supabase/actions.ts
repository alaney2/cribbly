"use server";
import { createClient } from "@/utils/supabase/server";
import { generateId } from "@/lib/utils";
import { calculateRentDates } from "@/utils/helpers";
import { redirect } from "next/navigation";

export async function deleteInvite(token: string) {
	const supabase = createClient();
	const { error } = await supabase
		.from("property_invites")
		.delete()
		.eq("token", token);
	if (error) {
		throw new Error("Error deleting invite");
	}
}

export async function getUser() {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	return user;
}

export async function updateFullName(formData: FormData) {
	const user = await getUser();
	if (!user) return;
	const supabase = createClient();
	const name = String(formData.get("name"));
	if (!name) return;
	const { error } = await supabase
		.from("users")
		.update({ full_name: name })
		.eq("id", user.id);

	if (error) {
		console.error(error);
	}
}

export async function getNameAndEmail() {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return;
	const { data, error } = await supabase
		.from("users")
		.select("full_name, email")
		.eq("id", user.id)
		.single();
	if (error) {
		console.error(error);
		throw new Error("Error fetching full name");
	}
	return data;
}

export async function editFee(formData: FormData) {
	const supabase = createClient();
	const feeType = String(formData.get("feeType"));
	const fee_type: "one-time" | "recurring" | undefined =
		feeType === "one-time" || feeType === "recurring" ? feeType : undefined;
	const fee_id = String(formData.get("feeId"));
	const fee_name = String(formData.get("feeName"));
	const fee_cost = String(formData.get("feeCost"));
	const { error } = await supabase
		.from("property_fees")
		.update({
			fee_name,
			fee_type,
			fee_cost: Number(Number.parseFloat(fee_cost).toFixed(2)),
		})
		.eq("id", fee_id);
	if (error) {
		console.error(error);
		throw new Error();
	}
}

export async function deleteFee(feeId: string) {
	const supabase = createClient();
	// const fee_type = String(formData.get('feeType'))
	// const fee_id = String(formData.get('feeId'))
	// const fee_name = String(formData.get('feeName'))
	// const fee_cost = String(formData.get('feeCost'))
	const { error } = await supabase
		.from("property_fees")
		.delete()
		.eq("id", feeId);
	if (error) {
		console.error(error);
		throw new Error();
	}
}

export async function addFee(formData: FormData, propertyId: string) {
	const supabase = createClient();
	const feeType = String(formData.get("feeType"));
	const fee_type: "one-time" | "recurring" | undefined =
		feeType === "one-time" || feeType === "recurring" ? feeType : undefined;
	const fee_name = String(formData.get("feeName"));
	const fee_cost = String(formData.get("feeAmount"));
	const { data, error } = await supabase
		.from("property_fees")
		.insert([
			{
				id: generateId(),
				property_id: propertyId,
				fee_name,
				fee_type,
				fee_cost: Number(Number.parseFloat(fee_cost).toFixed(2)),
			},
		])
		.select()
		.single();
	if (error) {
		console.error(error);
		throw new Error();
	}
	return data;
}

export async function addPropertyFees(formData: FormData) {
	const propertyId = formData.get("propertyId");
	if (!propertyId) return;
	const securityDepositSwitch = formData.get("securityDepositSwitch");
	const dateFrom = new Date(String(formData.get("dateFrom")));
	const dateTo = new Date(String(formData.get("dateTo")));

	const rent_id = String(formData.get("rent_id"));
	const rentInfo = calculateRentDates(dateFrom, dateTo);
	const monthsOfRent = rentInfo.monthsOfRent;
	if (dateFrom >= dateTo) {
		throw new Error("Invalid date range");
	}
	const rentDates = rentInfo.rentDates;
	// console.log(rentDates)
	const supabase = createClient();
	for (const pair of formData.entries()) {
		if (pair[0] === "rentAmount") {
			const { error } = await supabase.from("property_rents").upsert(
				{
					id: rent_id ? rent_id : generateId(),
					property_id: propertyId.toString(),
					rent_price: Number(Number.parseFloat(pair[1].toString()).toFixed(2)),
					rent_start: dateFrom,
					rent_end: dateTo,
					months_left: monthsOfRent,
				},
				{
					onConflict: "property_id",
					ignoreDuplicates: false,
				},
			);
			if (error) {
				console.error(error);
				return {
					message: "Error adding rent amount",
				};
			}
			continue;
		}
		if (
			pair[0] === "depositAmount" &&
			securityDepositSwitch === "on" &&
			Number.parseFloat(pair[1].toString()).toFixed(2) !== "0.00"
		) {
			const { error } = await supabase
				.from("property_security_deposits")
				.upsert(
					{
						id: generateId(),
						property_id: propertyId.toString(),
						deposit_amount: Number(
							Number.parseFloat(pair[1].toString()).toFixed(2),
						),
						status: "unpaid",
					},
					{
						onConflict: "property_id",
						ignoreDuplicates: false,
					},
				);
			if (error) {
				console.error(error);
				return {
					message: "Error adding security deposit",
				};
			}
		}
	}
	return {
		message: "Success!",
	};
}

export async function addPropertyNew(formData: FormData) {
	const user = await getUser();
	if (!user) throw new Error("User not found");
	const supabase = createClient();
	const street_address = String(formData.get("street"));
	const zip = String(formData.get("zip"));
	const apt = String(formData.get("apt"));
	const city = String(formData.get("city"));
	const state = String(formData.get("state"));
	const country = String(formData.get("country"));
	const { data: currentProperty, error: currentPropertyError } = await supabase
		.from("properties")
		.select("*")
		.eq("user_id", user.id)
		.single();
	if (currentProperty) {
		await supabase.from("properties").delete().eq("id", currentProperty.id);
	}

	if (!street_address || !zip || !city || !state || !country)
		throw new Error("Missing required fields");
	const { data, error } = await supabase
		.from("properties")
		.upsert(
			{
				user_id: user.id,
				street_address,
				zip,
				apt,
				city,
				state,
				country,
			},
			{
				onConflict: "user_id, street_address, zip, apt, city, state, country",
				ignoreDuplicates: false,
			},
		)
		.select()
		.single();

	if (error) {
		console.error(error);
		throw new Error("Unable to add property");
	}
	return data;
}

export async function addPropertyFromWelcome(formData: FormData) {
	const user = await getUser();
	if (!user) return;
	const supabase = createClient();
	const street_address = String(formData.get("street_address_hidden"));
	const zip = String(formData.get("zip_hidden"));
	const apt = String(formData.get("apt"));
	const city = String(formData.get("city_hidden"));
	const state = String(formData.get("state_hidden"));
	const country = String(formData.get("country_hidden"));

	if (!street_address || !zip || !city || !state || !country) return;
	// Check if the property already exists
	const { data: properties } = await supabase
		.from("properties")
		.select("id")
		.eq("user_id", user.id)
		.eq("street_address", street_address)
		.eq("zip", zip)
		.eq("apt", apt)
		.eq("city", city)
		.eq("state", state)
		.eq("country", country);

	if (properties && properties.length > 0) {
		return {
			message: "Property already exists",
		};
	}

	const { data, error } = await supabase
		.from("properties")
		.upsert(
			{
				user_id: user.id,
				street_address,
				zip,
				apt,
				city,
				state,
				country,
			},
			{
				onConflict: "user_id, street_address, zip, apt, city, state, country",
				ignoreDuplicates: false,
			},
		)
		.select()
		.single();

	if (error) {
		console.error(error);
		throw new Error("Unable to add property");
	}

	return data;
}

export async function setWelcomeScreen(value: boolean) {
	const user = await getUser();
	if (!user) return;
	const supabase = createClient();

	await supabase
		.from("users")
		.update({ welcome_screen: value })
		.eq("id", user.id);
}

export async function addProperty(formData: FormData) {
	const user = await getUser();
	if (!user) return;
	const supabase = createClient();
	const street_address = String(formData.get("street_address_hidden"));
	const zip = String(formData.get("zip_hidden"));
	const apt = String(formData.get("apt"));
	const city = String(formData.get("city_hidden"));
	const state = String(formData.get("state_hidden"));
	const country = String(formData.get("country_hidden"));

	if (!street_address || !zip || !city || !state || !country) return;

	const { data, error } = await supabase
		.from("properties")
		.upsert(
			{
				user_id: user.id,
				street_address,
				zip,
				apt,
				city,
				state,
				country,
			},
			{
				onConflict: "user_id, street_address, zip, apt, city, state, country",
				ignoreDuplicates: false,
			},
		)
		.select()
		.single();

	if (error) {
		console.error(error);
		throw new Error(error.message);
	}

	redirect(`/dashboard/${data.id}/settings`);
}

export async function deleteProperty(currentPropertyId: string) {
	const user = await getUser();
	if (!user) return;
	const supabase = createClient();

	const { error: rentError } = await supabase
		.from("property_rents")
		.delete()
		.eq("property_id", currentPropertyId)
		.select();
	const { error } = await supabase
		.from("properties")
		.delete()
		.eq("id", currentPropertyId)
		.select();
	await supabase
		.from("property_security_deposits")
		.delete()
		.eq("property_id", currentPropertyId)
		.select();
	await supabase
		.from("property_fees")
		.delete()
		.eq("property_id", currentPropertyId)
		.select();
	await supabase
		.from("property_invites")
		.delete()
		.eq("property_id", currentPropertyId)
		.select();

	if (rentError) {
		console.error(rentError);
		throw new Error("Error deleting rents");
	}
	if (error) {
		console.error(error);
		throw new Error("Error deleting property");
	}
}

export async function getSubscription() {
	const supabase = createClient();

	const { data: subscription, error } = await supabase
		.from("subscriptions")
		.select("*, prices(*, products(*))")
		.in("status", ["trialing", "active"])
		.maybeSingle();

	return { subscription, error };
}

export async function getProducts() {
	const supabase = createClient();

	const { data: products } = await supabase
		.from("products")
		.select("*, prices(*)")
		.eq("active", true)
		.eq("prices.active", true)
		.order("metadata->index");
	// .order('unit_amount', { referencedTable: 'prices' });

	return products;
}

export async function removeTenant(tenantId: { tenantId: string }) {
	const supabase = createClient();
}

// Function to update current property
export async function updateCurrentProperty(propertyId: string) {
	const supabase = createClient();
	// const { data: { user }, error: userError } = await supabase.auth.getUser()
	// if (!user || userError) {
	//   console.error('Error fetching user:', userError)
	//   // Handle the error appropriately
	// }
	const { error: updateError } = await supabase.auth.updateUser({
		data: { currentPropertyId: propertyId },
	});
	if (updateError) {
		console.error("Error updating current property:", updateError);
		throw new Error("Error updating current property");
	}
	return "Success";
}

export async function getCurrentProperty(): Promise<string> {
	const supabase = createClient();
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();
	if (!user || userError) {
		console.error("Error fetching user:", userError);
		throw new Error("Error fetching user");
	}
	const currentPropertyId = user.user_metadata.currentPropertyId;
	return currentPropertyId;
}

export async function getTasks() {
	const supabase = createClient();
	const currentPropertyId = await getCurrentProperty();
	const { data, error } = await supabase
		.from("maintenance")
		.select("*")
		.order("created_at", { ascending: false })
		.eq("property_id", currentPropertyId);
	if (error) {
		console.error("Error fetching tasks:", error);
		throw new Error("Error fetching tasks");
	}
	return data;
}

export async function deleteTask(id: string) {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("maintenance")
		.delete()
		.eq("id", id);

	if (error) {
		throw new Error("Delete unsuccessful");
	}
}

export async function createTask(formData: FormData) {
	const id = formData.get("id");
	const title = formData.get("title");
	const description = formData.get("description");
	const priority = formData.get("priority");
	const status = formData.get("status");
	const notify = formData.get("notify") === "on";
	const supabase = createClient();
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();
	if (!user || userError) {
		console.error("Error fetching user:", userError);
		throw new Error("Error fetching user");
	}
	const currentPropertyId = user.user_metadata.currentPropertyId;

	if (id === "0") {
		const { data, error } = await supabase
			.from("maintenance")
			.insert({
				title,
				description,
				priority,
				status,
				notify,
				user_id: user.id,
				property_id: currentPropertyId,
			})
			.select()
			.single();
		if (error) {
			console.error("Error creating task:", error);
			throw new Error("Error creating task");
		}
		return data;
	}

	const updateData: any = {
		updated_at: new Date(),
	};

	if (title) updateData.title = title;
	if (description) updateData.description = description;
	if (priority) updateData.priority = priority;
	if (status) updateData.status = status;
	if (formData.has("notify")) updateData.notify = notify;

	const { data, error } = await supabase
		.from("maintenance")
		.update(updateData)
		.eq("id", id)
		.select()
		.single();

	if (error) {
		console.error("Error creating task:", error);
		throw new Error("Error creating task");
	}
	return data;
}

export async function getVerificationInfo() {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return;

	const { data: verificationData, error: verificationError } = await supabase
		.from("verification_info")
		.select("*")
		.eq("user_id", user.id)
		.single();

	if (verificationError) {
		// console.error("Error fetching verification info:", verificationError);
		return null;
	}

	return verificationData;
}

export async function getPlaidAccounts() {
	const supabase = createClient();
	const user = await getUser();
	if (!user) return;
	const { data: plaidAccounts, error: plaidAccountsError } = await supabase
		.from("plaid_accounts")
		.select()
		.eq("user_id", user.id)
		.order("use_for_payouts", { ascending: false });

	return plaidAccounts || [];
}

export async function setPrimaryAccount(accountId: string) {
	const supabase = createClient();
	const user = await getUser();
	if (!user) return;

	// First, set all accounts to not be primary
	await supabase
		.from("plaid_accounts")
		.update({ use_for_payouts: false })
		.eq("user_id", user.id);

	// Then, set the selected account as primary
	const { error } = await supabase
		.from("plaid_accounts")
		.update({ use_for_payouts: true })
		.eq("account_id", accountId);
}
