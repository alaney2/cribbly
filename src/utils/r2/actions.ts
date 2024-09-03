"use server";
import {
	S3Client,
	DeleteObjectCommand,
	type S3ClientConfig,
	ListObjectsV2Command,
	GetObjectCommand,
	PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { revalidatePath } from "next/cache";
import { getUser } from "@/utils/supabase/actions";
import { createClient } from "@/utils/supabase/server";

const R2_CLIENT = new S3Client({
	region: "auto",
	endpoint: process.env.S3_ENDPOINT,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
	},
} as S3ClientConfig);

const BUCKET_NAME = process.env.R2_BUCKET_NAME;

if (!BUCKET_NAME) {
	throw new Error("R2_BUCKET_NAME is not set in environment variables");
}

async function userHasAccessToProperty(propertyId: string) {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("properties")
		.select("id")
		.eq("id", propertyId)
		.single();
	if (error) {
		console.error("Error fetching property:", error);
		return false;
	}
	return !!data;
}

export async function fetchDocuments(propertyId: string) {
	if (!(await userHasAccessToProperty(propertyId))) {
		throw new Error("Unauthorized access to property");
	}

	const command = new ListObjectsV2Command({
		Bucket: process.env.R2_BUCKET_NAME,
		Prefix: `properties/${propertyId}/documents/`,
	});

	const response = await R2_CLIENT.send(command);
	return response?.Contents?.map((item) => ({
		key: item.Key,
		name: item.Key ? item.Key.split("/").pop() : "",
		date: item.LastModified,
	}));
}

export async function viewDocument(propertyId: string, key: string) {
	if (!(await userHasAccessToProperty(propertyId))) {
		throw new Error("Unauthorized access to property");
	}

	const command = new GetObjectCommand({
		Bucket: process.env.R2_BUCKET_NAME,
		Key: key,
		ResponseContentType: "application/pdf",
		ResponseContentDisposition: "inline", // This suggests viewing rather than downloading
	});

	return getSignedUrl(R2_CLIENT, command, { expiresIn: 3600 });
}

export async function downloadDocument(propertyId: string, key: string) {
	if (!(await userHasAccessToProperty(propertyId))) {
		throw new Error("Unauthorized access to property");
	}

	const command = new GetObjectCommand({
		Bucket: process.env.R2_BUCKET_NAME,
		Key: key,
		// ResponseContentType: 'application/pdf',
		// ResponseContentDisposition: 'inline', // This suggests viewing rather than downloading
	});

	return getSignedUrl(R2_CLIENT, command, { expiresIn: 3600 });
}

export async function uploadDocument(propertyId: string, formData: FormData) {
	if (!(await userHasAccessToProperty(propertyId))) {
		throw new Error("Unauthorized access to property");
	}

	const file = formData.get("file") as File;
	if (!file) {
		throw new Error("No file uploaded");
	}

	const buffer = await file.arrayBuffer();

	const command = new PutObjectCommand({
		Bucket: BUCKET_NAME,
		Key: `properties/${propertyId}/documents/${file.name}`,
		Body: Buffer.from(buffer),
	});

	try {
		await R2_CLIENT.send(command);
		console.log("File uploaded successfully");
		// revalidatePath('/dashboard/documents')
	} catch (error) {
		console.error("Error uploading file:", error);
		throw error;
	}
}

export async function deleteDocument(propertyId: string, key: string) {
	if (!(await userHasAccessToProperty(propertyId))) {
		throw new Error("Unauthorized access to property");
	}

	const command = new DeleteObjectCommand({
		Bucket: BUCKET_NAME,
		Key: key,
	});

	try {
		await R2_CLIENT.send(command);
		console.log("File deleted successfully");
		// revalidatePath('/dashboard/documents')
	} catch (error) {
		console.error("Error deleting file:", error);
		throw error;
	}
}
