import React from "react";
import { CallToAction } from "@/components/landing/CallToAction";
import { Faqs } from "@/components/landing/Faqs";
import { Footer } from "@/components/landing/Footer";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Pricing } from "@/components/landing/Pricing";
import { PrimaryFeatures } from "@/components/landing/PrimaryFeatures";
import { SecondaryFeatures } from "@/components/landing/SecondaryFeatures";
import { Testimonials } from "@/components/landing/Testimonials";
import { NavLink } from "@/components/default/NavLink";
import { Container } from "@/components/default/Container";
import { FollowerPointerCard } from "@/components/aceternity/following-pointer";
import { WavyBackground } from "@/components/aceternity/wavy-background";
import { BeforeAfter } from "@/components/landing/BeforeAfter";
import Image from "next/image";
import { Button } from "@/components/catalyst/button";
import backgroundImage from "@/images/background-call-to-action.jpg";

export default function Home() {
	return (
		<div className="bg-gray-50">
			<Header />
			<main>
				{/* <WavyBackground> */}
				<Hero />
				{/* </WavyBackground> */}
				<PrimaryFeatures />
				<BeforeAfter />
				<Testimonials />
				<FollowerPointerCard title="🏠 Future Property Manager">
					<CallToAction />
					<section
						id="get-started-today"
						className="relative overflow-hidden bg-blue-600 py-32"
					>
						<Image
							className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
							src={backgroundImage}
							alt=""
							width={2347}
							height={1244}
							unoptimized
						/>
						<Container className="relative">
							<div className="mx-auto max-w-lg text-center">
								<h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
									Let’s get started
								</h2>
								<p className="mt-4 text-lg tracking-tight text-white">
									Join successful property managers on Cribbly and unlock new
									levels of efficiency
								</p>
								<Button
									href="/get-started"
									color="sky"
									className={"mt-10 cursor-none"}
								>
									Get started today
								</Button>
							</div>
						</Container>
					</section>
				</FollowerPointerCard>

				<SecondaryFeatures />
				<Pricing />
				<Faqs />
			</main>
			<Footer />
		</div>
	);
}
