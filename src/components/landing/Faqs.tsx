import Image from "next/image";

import { Container } from "@/components/default/Container";
import backgroundImage from "@/images/background-faqs.jpg";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
	[
		{
			question: "What's Cribbly, and who is it for?",
			answer:
				"Cribbly is property management software for independent landlords managing homes and apartments. It is the source of truth for all your property management needs, from rent collection to tax preparation.",
		},
		{
			question: "Do I really need property management software?",
			answer:
				"Technically, no one's forcing you, but why make life harder? Cribbly saves you time and helps avoid mistakes, all the while keeping your tenants happy.",
		},
		{
			question: "What makes Cribbly different from other software?",
			answer:
				"Cribbly is built specifically for independent landlords like you. No bloated features you don't need—just simple, powerful tools to make your life easier. Plus, with a one-time fee and no subscriptions, it's easy on the wallet.",
		},
		{
			question: "What if I have a question that isn’t answered here?",
			answer: "We are here to help; contact us at support@cribbly.io",
		},
	],
	[
		{
			question: "How much is Cribbly gonna cost me?",
			answer:
				"Your first property's on the house. To manage more properties, it's just a one-time fee of $78 for a lifetime license. That means all features and updates, no annoying subscriptions.",
		},
		{
			question: "How do I start using Cribbly?",
			answer:
				"Just sign up, add your properties, go through a quick verification with our payment processor, and invite your tenants. You're good to go!",
		},
		{
			question: "Can I manage properties on the go?",
			answer:
				"Absolutely. Cribbly is mobile-friendly, so you can handle everything from your phone or tablet. Whether you're at the beach or on the couch, your properties are at your disposal.",
		},
		{
			question:
				"What types of properties can be managed using Cribbly?",
			answer:
				"All types of properties. Whether it's a single-family home, a condo, or a 20-unit apartment building, Cribbly's got you covered.",
		},
	],
];

export function Faqs() {
	return (
		<section
			id="faq"
			aria-labelledby="faq-title"
			className="relative overflow-hidden bg-slate-50 pt-8 py-20 sm:py-32 "
		>
			<Container className="relative">
				<div className="mx-auto lg:mx-0">
					<h2
						id="faq-title"
						className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-slate-800 bg-gradient-to-r to-blue-600 from-[#60a4ff] via-indigo-400 inline-block text-transparent bg-clip-text"
					>
						Frequently asked questions
					</h2>
					<p className="mt-4 text-lg tracking-tight text-slate-700">
						If you have any additional questions, please feel free to reach out
						to us at{" "}
						<a href="mailto:support@cribbly.io " className="text-blue-600">
							{" "}
							support@cribbly.io
						</a>
					</p>
				</div>
				<ul className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-2">
					{faqs.map((column, columnIndex) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<li key={columnIndex}>
							<ul className="flex flex-col gap-y-6">
								{column.map((faq, faqIndex) => (
									<Accordion
										key={faq.question}
										type="single"
										collapsible
										className=""
									>
										<AccordionItem value={`item-${columnIndex}-${faqIndex}`}>
											<AccordionTrigger className="font-display text-lg leading-7 text-slate-800 cursor-pointer text-left	">
												{faq.question}
											</AccordionTrigger>
											<AccordionContent className="mt-4 text-sm text-slate-700">
												{faq.answer}
											</AccordionContent>
										</AccordionItem>
									</Accordion>
								))}
							</ul>
						</li>
					))}
				</ul>
			</Container>
		</section>
	);
}
