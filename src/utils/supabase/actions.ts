"use server";
import { createClient } from "@/utils/supabase/server";
import { generateId } from "@/lib/utils";
import { calculateRentDates } from "@/utils/helpers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";

export async function deleteInvite(token: string) {
	const supabase = createClient();
	const { error } = await supabaseAdmin
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

export async function updateName(name: string) {
	const user = await getUser();
	if (!user) return;
	const supabase = createClient();
	const { error } = await supabase
		.from("users")
		.update({ full_name: name })
		.eq("id", user.id);
	if (error) {
		console.error(error);
	}
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

export async function createLease(formData: FormData) {
	const user = await getUser();
	if (!user) {
		throw new Error("User not found");
	}
	const propertyId = formData.get("propertyId");
	if (!propertyId) {
		throw new Error("Property not found");
	}
	const securityDepositSwitch = formData.get("securityDepositSwitch");
	const dateFrom = new Date(String(formData.get("dateFrom")));
	const dateTo = new Date(String(formData.get("dateTo")));
	const rentAmount = Number.parseFloat(String(formData.get("rentAmount")));
	const depositAmount = Number.parseFloat(
		String(formData.get("depositAmount")),
	);
	// const rentInfo = calculateRentDates(dateFrom, dateTo);
	// const monthsOfRent = rentInfo.monthsOfRent;
	if (dateFrom >= dateTo) {
		throw new Error("Invalid date range");
	}
	// const rentDates = rentInfo.rentDates;
	const supabase = createClient();
	const { data: leaseData, error: leaseError } = await supabase
		.from("leases")
		.insert({
			user_id: user.id,
			property_id: propertyId,
			start_date: dateFrom,
			end_date: dateTo,
			rent_amount: rentAmount,
			sd_amount: securityDepositSwitch === "on" ? depositAmount : 0,
			sd_status: securityDepositSwitch === "on" ? "unpaid" : "none",
			status: "active",
			updated_at: new Date(),
		});

	if (leaseError) {
		console.error(leaseError);
		throw new Error("Error adding lease");
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

	const { data: propertyData, error: propertyDataError } = await supabase
		.from("properties")
		.select()
		.eq("user_id", user.id);
	if (propertyDataError) {
		console.error("Error fetching properties:", propertyDataError);
		return;
	}
	const propertyIds = propertyData.map((property) => property.id);
	if (!propertyIds.includes(user.user_metadata.currentPropertyId)) {
		await updateCurrentProperty(propertyData[0].id);
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
	// revalidatePath("/dashboard");
	return "Success";
}

export async function getCurrentProperty() {
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

export async function generateMonthlyRentPeriods() {
	try {
		// const supabase = createClient();
		const currentDate = new Date();
		const currentMonth = currentDate.getMonth(); // 0-11
		const currentYear = currentDate.getFullYear();
		const { data: activeLeases, error } = await supabaseAdmin
			.from("leases")
			.select("*")
			.eq("status", "active")
			.lte("start_date", currentDate)
			.gte("end_date", currentDate);

		if (error) {
			throw new Error("Error fetching active leases");
		}

		for (const lease of activeLeases) {
			const rentPeriodStart = new Date(
				currentYear,
				currentMonth,
				lease.rent_due_day,
			);
			const rentPeriodEnd = new Date(
				currentYear,
				currentMonth + 1,
				lease.rent_due_day - 1,
			);

			if (rentPeriodEnd > lease.endDate) {
				rentPeriodEnd.setTime(lease.endDate.getTime());
			}

			const { data: existingRentPeriods, error: existingRentPeriodsError } =
				await supabaseAdmin
					.from("rent_periods")
					.select("*")
					.eq("lease_id", lease.id)
					.eq("start_date", rentPeriodStart)
					.eq("end_date", rentPeriodEnd);

			if (
				existingRentPeriodsError ||
				!existingRentPeriods ||
				existingRentPeriods.length === 0
			) {
				const { error: insertError } = await supabaseAdmin
					.from("rent_periods")
					.insert({
						lease_id: lease.id,
						property_id: lease.property_id,
						amount_due: lease.rent_amount,
						status: "unpaid",
						start_date: rentPeriodStart,
						end_date: rentPeriodEnd,
						updated_at: new Date(),
					});

				if (insertError) {
					console.error("Error inserting rent period:", insertError);
					throw new Error("Error inserting rent period");
				}
			}
		}
	} catch (error) {
		console.error("Error generating monthly rent periods:", error);
	}
}

export async function getLease(propertyId: string) {
	const supabase = createClient();
	const { data: lease, error: leaseError } = await supabase
		.from("leases")
		.select("*")
		.eq("property_id", propertyId)
		.single();

	if (leaseError) {
		return;
		// console.error("Error fetching lease:", leaseError);
		// throw new Error("Error fetching lease");
	}

	return lease;
}

export async function getTenants(leaseId: string) {
	const { data, error } = await supabaseAdmin
		.from("tenants")
		.select(`
      user_id,
      users (
        full_name,
        email
      )
    `)
		.eq("lease_id", leaseId);
	if (error) throw error;
	return data;
}

export async function getPreviousTenants(propertyId: string, leaseId: string) {
	const { data, error } = await supabaseAdmin
		.from("tenants")
		.select("*, users!inner(*)")
		.eq("property_id", propertyId)
		.neq("lease_id", leaseId);

	if (error) throw error;
	return data;
}

export async function deleteLease(leaseId: string) {
	const supabase = createClient();
	const { error } = await supabase.from("leases").delete().eq("id", leaseId);

	if (error) {
		console.error("Error deleting lease:", error);
		throw new Error("Failed to delete lease");
	}

	// Revalidate the dashboard path to reflect the changes
	revalidatePath("/dashboard/leases");
}
