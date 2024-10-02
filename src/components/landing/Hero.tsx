"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/default/Button";
import { Container } from "@/components/default/Container";
import useSparks from "@/components/default/useSparks";
import { motion, useMotionValue } from "framer-motion";
import { toast } from "sonner";
import { BoxReveal } from "@/components/magicui/BoxReveal";
import { Text } from "../catalyst/text";
import { Subheading } from "../catalyst/heading";

export function Hero() {
	const { makeBurst, sparks } = useSparks();
	const containerRef = useRef<HTMLDivElement>(null);
	const router = useRouter();
	const x = useMotionValue("100%");

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (!containerRef.current) return;

		const containerRect = containerRef.current.getBoundingClientRect();
		const clickX = e.clientX - containerRect.left;
		const clickY = e.clientY - containerRect.top;

		makeBurst({ x: clickX, y: clickY });
		setTimeout(() => router.push("/get-started"), 50);
	};

	return (
		<Container className="pb-8 pt-8 sm:pt-16 max-w-5xl text-center sm:text-left">
			<div className="relative z-20">
				<h1 className="max-w-4xl font-display text-5xl font-medium tracking-tighter text-slate-800 sm:text-6xl">
					<span className="leading-tight">Property management software </span>
					<span className="relative whitespace-nowrap text-blue-600 z-10">
						<BoxReveal
							boxColor={"#2563eb"}
							duration={0.4}
							inline={true}
							className="pb-4"
						>
							<span className="relative leading-tight">
								made simple.
								<svg
									aria-hidden="true"
									viewBox="0 0 418 42"
									className="absolute left-0 top-2/3 h-[0.58em] w-full fill-slate-500"
									preserveAspectRatio="none"
								>
									<path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
								</svg>
							</span>
						</BoxReveal>
					</span>
				</h1>
				<BoxReveal
					boxColor={"#2563eb"}
					duration={0.4}
					className="max-w-xl mt-1 py-2 flex justify-center"
				>
					<>
						<p className="hidden sm:block font-semibold text-xl tracking-tight text-slate-500">
							{/* Incredibbly simple. Unbeatabbl efficiency. */}
							{/* Unthinkabbl ease. Inestimabbl value. */}
							Terribbly efficient. Unbeatabbly simple.
						</p>
						<p className="font-semibold text-xl tracking-tight text-slate-500">
							{/* Cribbly makes complex property tasks invisibbl. */}
							Cribbly makes property tasks incredibbly easy.
						</p>
					</>
				</BoxReveal>
			</div>
			<BoxReveal
				boxColor={"#2563eb"}
				duration={0.4}
				inline={true}
				className="mt-4"
			>
				<div
					ref={containerRef}
					className="flex justify-center gap-x-4 sm:gap-x-6 relative py-3 my-1"
				>
					<Button onClick={handleClick} className="cursor-pointer">
						Cool, let's dive in
					</Button>
					{sparks.map((spark) => (
						<div
							key={spark.id}
							className="absolute w-6 h-2 rounded-sm bg-blue-500 z-50 transform-none"
							style={{
								left: `${spark.center.x}px`,
								top: `${spark.center.y}px`,
								animation: `${spark.aniName} 500ms ease-out both`,
								zIndex: 9999,
							}}
						/>
					))}
					<Button
						href=""
						variant="outline"
						className="cursor-pointer"
						onClick={() => toast.success("Demo video coming soon")}
					>
						<svg
							aria-hidden="true"
							className="h-3 w-3 flex-none fill-blue-600 group-active:fill-current"
						>
							<path d="m9.997 6.91-7.583 3.447A1 1 0 0 1 1 9.447V2.553a1 1 0 0 1 1.414-.91L9.997 5.09c.782.355.782 1.465 0 1.82Z" />
						</svg>
						<span className="ml-3">Show me the ropes</span>
					</Button>
				</div>
			</BoxReveal>
			<div className="mt-12 lg:mt-16" />
		</Container>
	);
}
