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
import { DeleteProperyDialog } from "@/components/dialogs/DeletePropertyDialog";

export function DeleteCard({ propertyId }: { propertyId: string }) {
	const [isOpen, setIsOpen] = React.useState(false);

	return (
		<>
			<Card className="w-full border border-red-500/25">
				<CardHeader>
					<Heading>Delete property</Heading>
					<Text>
						Permanently remove your property and all of its contents from the
						Cribbly platform. This action is irreversible.
					</Text>
				</CardHeader>
				<Divider className="mb-0" />
				<CardFooter className="flex justify-end ">
					<Button type="button" color="red" onClick={() => setIsOpen(true)}>
						Delete property
					</Button>
				</CardFooter>
			</Card>
			<DeleteProperyDialog
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				propertyId={propertyId}
			/>
		</>
	);
}
