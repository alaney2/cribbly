"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Tab, TabList, TabGroup, TabPanels, TabPanel } from "@headlessui/react";
import clsx from "clsx";
import { Container } from "@/components/default/Container";
import backgroundImage from "@/images/background-features.jpg";
import screenshotExpenses from "@/images/screenshots/expenses.png";
import analyticsDashboard from "@/images/screenshots/analyticsDashboard.png";
import inviteTenants from "@/images/screenshots/inviteTenants.png";
import maintenanceRequest from "@/images/screenshots/maintenanceRequest.png";
import taxDocuments from "@/images/screenshots/taxDocuments.png";

const features = [
	{
		title: "Rent payments",
		description:
			"Live in a world where rent collects itself. No more manual transfers or misplaced checks.",
		image: inviteTenants,
	},
	{
		title: "Analytics",
		description:
			"The analytics dashboard gives you real-time insights into your earnings and expenses. Stay informed, stay ahead. ",
		image: analyticsDashboard,
	},
	{
		title: "Maintenance requests",
		description:
			"Tenants can report issues directly through the platform — track and manage requests without lifting a phone.",
		image: maintenanceRequest,
	},
	{
		title: "Tax reports",
		description:
			"Forget the year-end tax scramble. Cribbly makes it simple to track expenses and income for seamless tax filing.",
		image: taxDocuments,
	},
];

export function PrimaryFeatures() {
	const [selectedIndex, setSelectedIndex] = useState(0);

	return (
		<section
			id="features"
			aria-label="Features for running your books"
			className="relative overflow-x-hidden bg-blue-600 pb-28 pt-20 sm:py-32"
			style={{
				backgroundImage: `url(${backgroundImage.src})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			<Container className="relative">
				<div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
					<h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl md:text-5xl">
						Automate tasks, Amplify returns
					</h2>
					<p className="mt-6 text-lg tracking-tight text-blue-100">
						Collect rent, handle maintenance requests, analyze performance, and
						automate tax forms
					</p>
				</div>
				<div className="mt-16 grid grid-cols-1 items-center gap-y-2 pt-10 sm:gap-y-6 md:mt-20 lg:grid-cols-12 lg:pt-0">
					<div className="-mx-4 flex overflow-x-scroll pb-4 sm:mx-0 sm:overflow-visible sm:pb-0 lg:col-span-5">
						<div className="relative z-10 flex gap-x-4 whitespace-nowrap px-4 sm:mx-auto sm:px-0 lg:mx-0 lg:block lg:gap-x-0 lg:gap-y-1 lg:whitespace-normal">
							{features.map((feature, featureIndex) => (
								<div
									key={feature.title}
									className={clsx(
										"group relative rounded-full px-4 py-1 lg:rounded-l-xl lg:rounded-r-none lg:p-6 focus:outline-none",
										selectedIndex === featureIndex
											? "bg-white lg:bg-white/10 lg:ring-inset lg:ring-white/10"
											: "sm:hover:bg-white/10 lg:hover:bg-white/5",
									)}
								>
									<h3>
										<button
											type="button"
											onClick={() => setSelectedIndex(featureIndex)}
											className={clsx(
												"font-display text-lg ui-not-focus-visible:outline-none",
												selectedIndex === featureIndex
													? "text-blue-600 lg:text-white"
													: "text-blue-100 sm:hover:text-white lg:text-white",
											)}
										>
											<span className="absolute inset-0 rounded-full lg:rounded-l-xl lg:rounded-r-none" />{" "}
											{feature.title}
										</button>
									</h3>
									<p
										className={clsx(
											"mt-2 hidden text-sm lg:block",
											selectedIndex === featureIndex
												? "text-white"
												: "text-blue-100 sm:group-hover:text-white",
										)}
									>
										{feature.description}
									</p>
								</div>
							))}
						</div>
					</div>
					<div className="lg:col-span-7">
						{features.map((feature, index) => (
							<div
								key={feature.title}
								className={index === selectedIndex ? "" : "hidden"}
							>
								<div className="relative sm:px-6 lg:hidden">
									<div className="absolute -inset-x-4 bottom-[-4.25rem] top-[-6.5rem] bg-white/10 ring-1 ring-inset ring-white/10 sm:inset-x-0 sm:rounded-t-xl" />
									<p className="relative mx-auto max-w-2xl text-base text-white sm:text-center">
										{feature.description}
									</p>
								</div>
								<div className="mt-10 overflow-hidden rounded-md sm:rounded-2xl bg-gray-100 shadow-xl shadow-blue-900/20 sm:w-auto lg:mt-0 w-[45rem] lg:w-[67.8125rem] pointer-events-none">
									<Image
										className="w-full rounded-md sm:rounded-2xl "
										src={feature.image}
										alt=""
										priority
										sizes="(min-width: 1024px) 67.8125rem, (min-width: 640px) 100vw, 45rem"
									/>
								</div>
							</div>
						))}{" "}
					</div>
				</div>
			</Container>
		</section>
	);
}
