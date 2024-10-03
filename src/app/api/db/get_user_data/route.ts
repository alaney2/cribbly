import { createClient } from "@/utils/supabase/server";
import { getURL } from "@/utils/helpers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return Response.redirect(getURL("/sign-in"));
	}

	const { data, error } = await supabase
		.from("users")
		.select()
		.eq("id", user?.id)
		.single();

	if (error) {
		return NextResponse.next();
	}

	return NextResponse.json(data);
}
