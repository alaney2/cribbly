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

export default async function DocumentsPage() {
	return (
		<>
			<DocumentsClient />
		</>
	);
}
