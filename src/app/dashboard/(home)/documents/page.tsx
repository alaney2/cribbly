"use server";
import { createClient } from "@/utils/supabase/server";
import { DocumentsClient } from "./DocumentsClient";
import { redirect } from "next/navigation";
import {
	fetchDocuments,
	viewDocument,
	uploadDocument,
	downloadDocument,
	deleteDocument,
} from "@/utils/r2/actions";

type Document = {
	key: string | undefined;
	name: string | undefined;
	date: Date | undefined;
};

export default async function Documents() {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) redirect("/sign-in");
	const currentPropertyId = user.user_metadata.currentPropertyId;

	let documents = await fetchDocuments(currentPropertyId);
	if (!documents) documents = [];

	return (
		<>
			<DocumentsClient propertyId={currentPropertyId} documents={documents} />
		</>
	);
}
