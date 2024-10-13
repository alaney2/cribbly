"use client";
import { useMediaQuery } from "usehooks-ts";
import { useState, useEffect } from "react";
import { Drawer } from "vaul";
import {
	Dialog,
	DialogActions,
	DialogBody,
	DialogDescription,
	DialogTitle,
} from "@/components/catalyst/dialog";
import { Heading, Subheading } from "@/components/catalyst/heading";
import { Text } from "@/components/catalyst/text";
import {
	Description,
	Fieldset,
	Label,
	Legend,
} from "@/components/catalyst/fieldset";
import { Radio, RadioField, RadioGroup } from "@/components/catalyst/radio";

type ConnectBankDialogProps = {
	isOpen: boolean;
	onClose: () => void;
	dialogBody: React.ReactNode;
	dialogActions: React.ReactNode;
};

export function ConnectBankDialog({
	isOpen,
	onClose,
	dialogBody,
	dialogActions,
}: ConnectBankDialogProps) {
	const isMobile = useMediaQuery("(max-width: 640px)");
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	if (isMobile) {
		return (
			<Drawer.Root
				open={isOpen}
				onOpenChange={onClose}
				repositionInputs={false}
			>
				<Drawer.Portal>
					<Drawer.Overlay className="fixed inset-0 bg-zinc-950/25 dark:bg-zinc-950/50" />
					<Drawer.Content className="bg-white dark:bg-zinc-900 flex flex-col fixed bottom-0 left-0 right-0 max-h-[82vh] rounded-t-[10px]">
						<div className="max-w-md w-full mx-auto overflow-auto p-4 rounded-t-[10px]">
							<Drawer.Handle />
							<Drawer.Title asChild className="mt-8">
								<Subheading level={1}>Template heading</Subheading>
							</Drawer.Title>
							<Drawer.Description
								asChild
								className="leading-6 mt-2 text-gray-600"
							>
								<Text>Template text</Text>
							</Drawer.Description>
							{dialogBody}
							<div className="flex flex-col mt-8 space-y-2">
								{dialogActions}
							</div>
						</div>
					</Drawer.Content>
				</Drawer.Portal>
			</Drawer.Root>
		);
	}
	return (
		<>
			<Dialog open={isOpen} onClose={onClose}>
				<DialogTitle>Title</DialogTitle>
				<DialogDescription>Description</DialogDescription>
				<DialogBody>{dialogBody}</DialogBody>
				<DialogActions>{dialogActions}</DialogActions>
			</Dialog>
		</>
	);
}
