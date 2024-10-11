"use client";
import * as React from "react";
import { Heading } from "@/components/catalyst/heading";
import { Strong, Text } from "@/components/catalyst/text";
import { Button } from "@/components/catalyst/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Divider } from "@/components/catalyst/divider";
import { deleteLease } from "@/utils/supabase/actions";
import { toast } from "sonner";
import { mutate } from "swr";
import { useCurrentProperty } from "@/contexts/CurrentPropertyContext";

export function DeleteLeaseCard({
	lease,
	setSelectedLease,
}: { lease: any; setSelectedLease: (lease: any) => void }) {
	const [isDeleting, setIsDeleting] = React.useState(false);
	const { currentPropertyId } = useCurrentProperty();

	const handleDelete = async () => {
		const loading = toast.loading("Deleting lease...");
		setIsDeleting(true);
		try {
			await deleteLease(lease.id);
		} catch (error) {
			toast.dismiss(loading);
			toast.error("Failed to delete lease");
			console.error("Failed to delete lease:", error);
		} finally {
			toast.dismiss(loading);
			toast.success("Lease deleted successfully");
			setIsDeleting(false);
			setSelectedLease(null);
			mutate(["leases", currentPropertyId]);
		}
	};

	return (
		<>
			<Card className="w-full border border-red-500/25">
				<CardHeader>
					<Heading>Delete lease</Heading>
					<Text>
						Deletion of a lease is irreversible. Please confirm that you want to
						delete this lease.
					</Text>
				</CardHeader>
				<Divider className="mb-0" />
				<CardFooter className="flex justify-end ">
					<Button
						type="button"
						color="red"
						onClick={handleDelete}
						disabled={isDeleting}
					>
						{isDeleting ? "Deleting..." : "Delete lease"}
					</Button>
				</CardFooter>
			</Card>
		</>
	);
}
