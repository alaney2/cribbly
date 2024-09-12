"use client";
import { useRouter } from "next/navigation";
import { Fragment, useRef } from "react";
import Link from "next/link";
import { Popover, Transition } from "@headlessui/react";
import clsx from "clsx";

import { Button } from "@/components/default/Button";
import { Container } from "@/components/default/Container";
import { Logo } from "@/components/Logo";
import { NavLink } from "@/components/default/NavLink";
import useSparks from "@/components/default/useSparks";
import icon from "@/images/icon.png";
import Image from "next/image";

const tailwindColors = [
	"bg-red-400",
	"bg-orange-400",
	"bg-yellow-400",
	"bg-green-400",
	"bg-emerald-400",
	"bg-cyan-400",
	"bg-sky-400",
	"bg-blue-400",
	"bg-indigo-400",
	"bg-purple-400",
	"bg-fuchsia-400",
	"bg-pink-400",
	"bg-rose-400",
];
const randomColor =
	tailwindColors[Math.floor(Math.random() * tailwindColors.length)];

function MobileNavLink({
	href,
	children,
}: {
	href: string;
	children: React.ReactNode;
}) {
	return (
		<Popover.Button as={Link} href={href} className="block w-full p-2">
			{children}
		</Popover.Button>
	);
}

function MobileNavIcon({ open }: { open: boolean }) {
	return (
		<svg
			aria-hidden="true"
			className="h-3.5 w-3.5 overflow-visible stroke-slate-700"
			fill="none"
			strokeWidth={2}
			strokeLinecap="round"
		>
			<path
				d="M0 1H14M0 7H14M0 13H14"
				className={clsx(
					"origin-center transition",
					open && "scale-90 opacity-0",
				)}
			/>
			<path
				d="M2 2L12 12M12 2L2 12"
				className={clsx(
					"origin-center transition",
					!open && "scale-90 opacity-0",
				)}
			/>
		</svg>
	);
}

function MobileNavigation() {
	return (
		<Popover>
			<Popover.Button
				className="relative z-10 flex h-8 w-8 items-center justify-center ui-not-focus-visible:outline-none outline-none ring-0"
				aria-label="Toggle Navigation"
			>
				{({ open }) => <MobileNavIcon open={open} />}
			</Popover.Button>
			<Transition.Root>
				<Transition.Child
					as={Fragment}
					enter="duration-150 ease-out"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="duration-150 ease-in"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<Popover.Overlay className="fixed inset-0 bg-slate-300/50" />
				</Transition.Child>
				<Transition.Child
					as={Fragment}
					enter="duration-150 ease-out"
					enterFrom="opacity-0 scale-95"
					enterTo="opacity-100 scale-100"
					leave="duration-100 ease-in"
					leaveFrom="opacity-100 scale-100"
					leaveTo="opacity-0 scale-95"
				>
					<Popover.Panel
						as="div"
						className="absolute inset-x-0 top-full mt-4 flex origin-top flex-col rounded-2xl bg-white p-4 text-lg tracking-tight text-slate-900 shadow-xl ring-1 ring-slate-900/5"
					>
						<MobileNavLink href="#features">Features</MobileNavLink>
						<MobileNavLink href="#testimonials">Testimonials</MobileNavLink>
						{/* <MobileNavLink href="#pricing">Pricing</MobileNavLink> */}
						<hr className="m-2 border-slate-300/40" />
						<MobileNavLink href="/login">Sign in</MobileNavLink>
					</Popover.Panel>
				</Transition.Child>
			</Transition.Root>
		</Popover>
	);
}

export function Header() {
	const { makeBurst, sparks } = useSparks();
	const containerRef = useRef<HTMLDivElement>(null);
	const router = useRouter();

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (!containerRef.current) return;

		const containerRect = containerRef.current.getBoundingClientRect();
		const clickX = e.pageX - window.scrollX;
		const clickY = e.pageY - window.scrollY;

		const relativeX = clickX - containerRect.left;
		const relativeY = clickY - containerRect.top;

		makeBurst({ x: relativeX, y: relativeY });
		setTimeout(() => router.push("/get-started"), 150);
	};

	return (
		<header className="py-6">
			<Container>
				<nav className="relative z-50 flex justify-between">
					<div className="flex items-center md:gap-x-12">
						<Link
							href="/"
							aria-label="Cribbly"
							className="flex items-center font-lexend text-lg tracking-tight font-medium select-none w-full"
						>
							{/* <Logo className="h-8 mb-2 w-auto" /> */}
							<Image
								src={icon}
								alt="logo"
								height={32}
								width={32}
								className="mr-2"
							/>
							<>
								<span className={"text-gray-600"}>Crib</span>
								<span className={"text-blue-500"}>bly</span>
							</>
						</Link>
						<div className="hidden md:flex md:gap-x-4">
							<NavLink href="#features">Features</NavLink>
							<NavLink href="#testimonials">Testimonials</NavLink>
							{/* <NavLink href="#pricing">Pricing</NavLink> */}
						</div>
					</div>
					<div
						ref={containerRef}
						className="relative flex items-center gap-x-4 md:gap-x-6"
					>
						<div className="hidden md:block">
							<NavLink href="/sign-in">Sign in</NavLink>
						</div>
						<Button
							onClick={handleClick}
							color="blue"
							className="cursor-pointer"
						>
							<span>
								Get started <span className="hidden lg:inline" />
							</span>
						</Button>
						{sparks.map((spark) => (
							<div
								key={spark.id}
								className={`absolute w-6 h-2 rounded-sm ${randomColor} z-50 transform-none`}
								style={{
									left: `${spark.center.x}px`,
									top: `${spark.center.y}px`,
									animation: `${spark.aniName} 500ms ease-out both`,
								}}
							/>
						))}
						<div className="-mr-1 md:hidden">
							<MobileNavigation />
						</div>
					</div>
				</nav>
			</Container>
		</header>
	);
}
