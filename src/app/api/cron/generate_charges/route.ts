import type { NextRequest } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/admin";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
	const authHeader = request.headers.get("authorization");

	if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
		return new Response("Unauthorized", {
			status: 401,
		});
	}

	await generateMonthlyRentPeriods();

	return Response.json({ success: true });
}

async function generateMonthlyRentPeriods() {
	try {
		const currentDate = new Date();
		const currentDateString = currentDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD
		const currentMonth = currentDate.getMonth(); // 0-11
		const currentYear = currentDate.getFullYear();
		const { data: activeLeases, error } = await supabaseAdmin
			.from("leases")
			.select("*")
			.eq("status", "active")
			.lte("start_date", currentDateString)
			.gte("end_date", currentDateString);

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
