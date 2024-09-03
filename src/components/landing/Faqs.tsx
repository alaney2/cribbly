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
			question: "What is Cribbly, and who is it for?",
			answer:
				"Cribbly is property management software for small landlords managing homes and apartments. It is the source of truth for all your property management needs, from rent collection to tax preparation. Keep all your data in one place and manage your properties from anywhere.",
		},
		{
			question: "Is property management software really necessary?",
			answer:
				"No, but using property management software saves you a lot of time managing rental properties by automating routine tasks like rent collection, taxes, and maintenance scheduling but. It also reduces human error and improves tenant satisfaction.",
		},
		{
			question:
				"Is property management software suitable for individual landlords or just property management companies?",
			answer:
				"It’s suitable for both, scaling efficiently for any number of properties, from one to hundreds. No matter the portfolio size, everyone can benefit from the time and cost savings, improved organization, and enhanced tenant experience that this software provides.",
		},
		{
			question: "What if I have a question that isn’t answered here?",
			answer: "We’re here to help! Contact us at support@cribbly.io",
		},
	],
	[
		{
			question: "How much does Cribbly cost?",
			answer:
				"Cribbly costs $80 to list unlimited properties. Tenants pay a small fee when paying rent to cover the payment processing cost. There are no hidden fees or additional charges. We offer a risk-free 30-day money-back guarantee if you are not satisfied with the service.",
		},
		{
			question: "How do I get started with Cribbly?",
			answer:
				"Simply sign up for an account, add your properties, and invite your tenants in order to start collecting rent and tracking expenses. Cribbly is designed to be intuitive and easy to use, so you can get started right away.",
		},
		{
			question: "What does Cribbly offer?",
			answer:
				"Cribbly provides automated online rent payment, financial analytics, maintenance request tracking, and tax report automation in a user-friendly platform. You can also use Cribbly's mobile platform to manage your properties on the go.",
		},
		{
			question:
				"What types of properties can be managed using property management software?",
			answer:
				"All types, including single-family homes, condos, apartments, commercial properties, etc.",
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
			{/* <Image
        className="absolute left-1/2 top-0 max-w-none -translate-y-1/4 translate-x-[-30%]"
        src={backgroundImage}
        alt=""
        width={1558}
        height={946}
        unoptimized
      /> */}

			<Container className="relative">
				<div className="mx-auto lg:mx-0">
					<h2
						id="faq-title"
						className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-slate-800 bg-gradient-to-r to-blue-600 from-[#60a4ff] via-indigo-400 inline-block text-transparent bg-clip-text"
					>
						Frequently asked questions
					</h2>
					<p className="mt-4 text-lg tracking-tight text-slate-700">
						We’ve got your questions covered! If you have any additional
						questions, please feel free to reach out to us at{" "}
						<a href="mailto:support@cribbly.io " className="text-blue-600">
							{" "}
							support@cribbly.io
						</a>
					</p>
				</div>
				<ul
					role="list"
					className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-2"
				>
					{faqs.map((column, columnIndex) => (
						<li key={columnIndex}>
							<ul role="list" className="flex flex-col gap-y-6">
								{column.map((faq, faqIndex) => (
									<Accordion
										key={faqIndex}
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
