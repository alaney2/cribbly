"use client";
import { useMediaQuery } from "usehooks-ts";
import { useState, useEffect } from "react";
import { Drawer } from "vaul";
import { Button } from "@/components/catalyst/button";
import {
	Dialog,
	DialogActions,
	DialogBody,
	DialogDescription,
	DialogTitle,
} from "@/components/catalyst/dialog";
import clsx from "clsx";
import { Heading, Subheading } from "@/components/catalyst/heading";
import { Text } from "@/components/catalyst/text";
import { Input } from "@/components/catalyst/input";
import { LockClosedIcon } from "@heroicons/react/24/outline";

type LinkConfirmDialogProps = {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	dialogBody?: React.ReactNode;
	dialogActions: React.ReactNode;
};
export function LinkConfirmDialog({
	isOpen,
	setIsOpen,
	dialogBody,
	dialogActions,
}: LinkConfirmDialogProps) {
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
				onOpenChange={(open) => {
					setIsOpen(open);
				}}
				// dismissible={false}
				repositionInputs={false}
			>
				<Drawer.Portal>
					<Drawer.Overlay className="fixed inset-0 bg-black/40" />
					<Drawer.Content className="bg-white dark:bg-zinc-900 flex flex-col fixed bottom-0 left-0 right-0 max-h-[82vh] rounded-t-[10px]">
						<div className="max-w-md w-full mx-auto overflow-auto p-4 rounded-t-[10px]">
							<Drawer.Handle />
							<Drawer.Title asChild className="mt-8">
								<div className="flex items-center gap-x-4 mb-4">
									<LockClosedIcon className="w-6 text-gray-500" />
									<Subheading level={1}>Link Bank Account</Subheading>
								</div>
							</Drawer.Title>
							<Drawer.Description
								asChild
								className="leading-6 mt-2 text-gray-600"
							>
								<Text>
									In order to verify your bank account information, you will be
									redirected to our third-party partner, Plaid.
								</Text>
							</Drawer.Description>
							{dialogBody}
							<div className="flex flex-col mt-8 space-y-2 w-full">
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
			<Dialog open={isOpen} onClose={setIsOpen} size="md">
				<DialogTitle>Link Bank Account</DialogTitle>
				<DialogDescription>
					In order to verify your bank account information, you will be
					redirected to our third-party partner, Plaid.
				</DialogDescription>
				<DialogBody>{dialogBody}</DialogBody>
				<DialogActions>{dialogActions}</DialogActions>
			</Dialog>
		</>
	);
}
