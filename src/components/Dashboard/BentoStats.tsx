"use client";
import { deleteProperty } from "@/utils/supabase/actions";
import { BentoGrid, BentoGridItem } from "@/components/aceternity/bento-grid";
import {
	IconFileStack,
	IconWavesElectricity,
	IconTableColumn,
	IconPigMoney,
} from "@tabler/icons-react";
import { PencilSquareIcon, WrenchIcon } from "@heroicons/react/24/outline";
import { IncomeGraph } from "@/components/bento-stuff/IncomeGraph";
import { UtilityPie } from "@/components/bento-stuff/UtilityPie";
import { BentoMaintenanceTable } from "@/components/bento-stuff/BentoMaintenanceTable";
import { BarGraph } from "@/components/bento-stuff/BarGraph";
import { Button } from "@/components/catalyst/button";
import { motion } from "framer-motion";
import { createMoovAccount } from "@/utils/moov/actions";
import { loadMoov, type Drops } from "@moovio/moov-js";
import { useState } from "react";

export function BentoStats({ tasks }: { tasks: any }) {
	const [moovjs, setMoovjs] = useState<any>(null);
	const [moovToken, setMoovToken] = useState<string | null>(null);

	const openOnboardingDrop = async () => {
		try {
			const dropsInstance = await moovjs?.drops();

			dropsInstance.onboarding({
				token: moovToken,
				open: true,
				onResourceCreated: ({ resourceType, resource }) => {
					console.log(`Resource created: ${resourceType}`, resource);
				},
				onError: ({ errorType, error }) => {
					console.error(`Error in ${errorType}:`, error);
				},
				onCancel: () => {
					console.log("Onboarding cancelled");
				},
				onSuccess: () => {
					console.log("Onboarding completed successfully");
				},
			});
		} catch (error) {
			console.error("Error loading Moov:", error);
		}
	};

	const openTOSDrop = async () => {
		try {
			const dropsInstance = await moovjs?.drops();
			const token = await moovjs.accounts.getTermsOfServiceToken();
			console.log("Terms of Service token:", token);

			const result = await moovjs.accounts.acceptTermsOfService({
				accountId: process.env.NEXT_PUBLIC_MOOV_ACCOUNT_ID as string,
				termsOfServiceToken: token,
			});

			console.log("Terms of Service accepted:", result);
			dropsInstance.termsOfService({
				token: token,
				textColor: "#000",
				linkColor: "#0000ff",
				backgroundColor: "#fff",
				fontSize: "16px",
				customActionCopy: "I agree to the terms of service",

				// onResourceCreated: ({ resourceType, resource }) => {
				// 	console.log(`Resource created: ${resourceType}`, resource);
				// },
				// onError: ({ errorType, error }) => {
				// 	console.error(`Error in ${errorType}:`, error);
				// },
				onTermsOfServiceReady: (termsOfServiceToken) => {
					console.log("Terms of Service ready", termsOfServiceToken);
				},
				onTermsOfServiceError: (error) => {
					console.error("Error loading terms of service:", error);
					console.log(error);
				},
			});
		} catch (error) {
			console.error("Error loading Moov:", error);
		}
	};

	const SkeletonOne = () => {
		const variants = {
			initial: {
				x: 0,
			},
			animate: {
				x: 10,
				rotate: 5,
				transition: {
					duration: 0.2,
				},
			},
		};
		const variantsSecond = {
			initial: {
				x: 0,
			},
			animate: {
				x: -10,
				rotate: -5,
				transition: {
					duration: 0.2,
				},
			},
		};

		return (
			<motion.div
				initial="initial"
				whileHover="animate"
				className="dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex h-full min-h-[6rem] w-full flex-1 flex-col space-y-2"
			>
				<motion.div
					variants={variants}
					className="flex flex-row items-center space-x-2 rounded-full border border-neutral-100 bg-white p-2 dark:border-white/[0.2] dark:bg-black"
				>
					<div className="h-6 w-6 flex-shrink-0 rounded-full bg-gradient-to-r from-pink-500 to-violet-500" />
					<div className="h-4 w-full rounded-full bg-gray-100 dark:bg-neutral-900" />
				</motion.div>
				<motion.div
					variants={variantsSecond}
					className="ml-auto flex w-3/4 flex-row items-center space-x-2 rounded-full border border-neutral-100 bg-white p-2 dark:border-white/[0.2] dark:bg-black"
				>
					<div className="h-4 w-full rounded-full bg-gray-100 dark:bg-neutral-900" />
					<div className="h-6 w-6 flex-shrink-0 rounded-full bg-gradient-to-r from-pink-500 to-violet-500" />
				</motion.div>
				<motion.div
					variants={variants}
					className="flex flex-row items-center space-x-2 rounded-full border border-neutral-100 bg-white p-2 dark:border-white/[0.2] dark:bg-black"
				>
					<div className="h-6 w-6 flex-shrink-0 rounded-full bg-gradient-to-r from-pink-500 to-violet-500" />
					<div className="h-4 w-full rounded-full bg-gray-100 dark:bg-neutral-900" />
				</motion.div>
			</motion.div>
		);
	};

	const items = [
		{
			title: "Total income",
			description: "Rent - (maintenance + utility costs)",
			header: <IncomeGraph />,
			className: "md:col-span-2",
			icon: <IconPigMoney className="h-4 w-4 text-blue-500" />,
			edit: false,
		},
		{
			title: "Net income",
			description: "+/- per month",
			header: <BarGraph />,
			className: "md:col-span-1",
			icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
			edit: false,
		},
		{
			title: "Documents",
			description: "(e.g., taxes, insurance, lease)",
			header: <SkeletonOne />,
			className: "md:col-span-1",
			icon: <IconFileStack className="h-4 w-4 text-blue-500" />,
			href: "/dashboard/documents",
			edit: true,
		},
		{
			title: "Maintenance requests",
			description: "Most recent maintenance requests",
			header: <BentoMaintenanceTable tasks={tasks} />,
			className: "md:col-span-2",
			icon: <WrenchIcon className="h-4 w-4 text-blue-500" />,
			edit: true,
			href: "/dashboard/maintenance",
		},
	];

	return (
		<>
			<BentoGrid className="mx-auto w-full auto-rows-[20rem] xl:auto-rows-[30vh]">
				{items.map((item, i) => (
					<BentoGridItem
						key={item.title}
						title={item.title}
						description={item.description}
						header={item.header}
						className={item.className}
						icon={item.icon}
						edit={item.edit}
						href={item.href}
					/>
				))}
			</BentoGrid>
			<Button
				onClick={async () => {
					const token = await createMoovAccount();
					console.log(token);
					if (!token) return;
					setMoovToken(token);
					const loadedMoovjs = await loadMoov(token);
					setMoovjs(loadedMoovjs);
					console.log("Moov.js loaded", loadedMoovjs);
				}}
			>
				Create Moov Account
			</Button>
			<Button onClick={() => openOnboardingDrop()} disabled={!moovjs}>
				Open Onboarding
			</Button>
			<Button onClick={openTOSDrop} disabled={!moovjs}>
				Open TOS
			</Button>
		</>
	);
}
