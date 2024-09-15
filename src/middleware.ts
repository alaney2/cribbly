import { NextResponse, type NextRequest } from "next/server";
import { createClient, updateSession } from "@/utils/supabase/middleware";
import { updateCurrentProperty } from "./utils/supabase/actions";

export async function middleware(request: NextRequest) {
	const url = request.nextUrl.clone();

	const { supabase, response } = createClient(request);
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();
	const { pathname } = request.nextUrl;
	// if (user) {
	// 	const { data: show_welcome_data } = await supabase
	// 		.from("users")
	// 		.select("welcome_screen")
	// 		.eq("id", user?.id)
	// 		.single();

	// 	const welcome_screen = show_welcome_data?.welcome_screen;

	// 	if (welcome_screen === true && pathname !== "/welcome") {
	// 		return NextResponse.redirect(new URL("/welcome", request.url));
	// 	}
	// 	if (!welcome_screen && pathname === "/welcome") {
	// 		return NextResponse.redirect(new URL("/dashboard", request.url));
	// 	}

	// 	if (!welcome_screen) {
	// 		const unavailableRoutes = [
	// 			"/sign-in",
	// 			"/get-started",
	// 			"/welcome",
	// 			"/invite",
	// 		];
	// 		// Can't sign in or sign up if already logged in
	// 		if (
	// 			pathname === "/" ||
	// 			unavailableRoutes.some((path) => url.pathname.startsWith(path))
	// 		) {
	// 			return NextResponse.redirect(new URL("/dashboard", request.url));
	// 		}
	// 		const { data: propertyData, error } = await supabase
	// 			.from("properties")
	// 			.select()
	// 			.eq("user_id", user.id);
	// 		if (!propertyData || propertyData.length === 0) {
	// 			return NextResponse.next();
	// 		}
	// 		// if (user.user_metadata.currentPropertyId) {
	// 		// 	const propertyIds = propertyData.map((property) => property.id);
	// 		// 	if (!propertyIds.includes(user.user_metadata.currentPropertyId)) {
	// 		// 		await updateCurrentProperty(propertyData[0].id);
	// 		// 	}
	// 		// }
	// 		return NextResponse.next();
	// 	}
	// } else {
	// 	// No user is signed in
	// 	const pathsWithoutAuth = [
	// 		"/sign-in",
	// 		"/get-started",
	// 		"/invite",
	// 		"/privacy",
	// 		"/terms",
	// 		"/security",
	// 	];
	// 	// Redirect to login if not authenticated
	// 	if (
	// 		pathname !== "/" &&
	// 		!pathsWithoutAuth.some((path) => pathname.startsWith(path))
	// 	) {
	// 		return NextResponse.redirect(new URL("/", request.url));
	// 	}
	// }
	return response;
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - /auth (auth routes)
		 * - /api (api routes)
		 * - favicon.ico (favicon file)
		 * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
		 * - others
		 */
		{
			source:
				"/((?!_next/static|_next/image|privacy|images|terms|auth|api|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|\\.well-known).*)",
			missing: [
				{ type: "header", key: "next-router-prefetch" },
				{ type: "header", key: "purpose", value: "prefetch" },
			],
		},
	],
};
