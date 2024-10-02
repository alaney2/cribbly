import Image from "next/image";
import { Container } from "@/components/default/Container";
import {
	XMarkIcon,
	CheckIcon,
	ArrowRightIcon,
} from "@heroicons/react/24/outline";
import backgroundImage from "@/images/background-faqs.jpg";

const beforeBenefits = [
	"Spending time and energy keeping track of rent payments",
	"Having unorganized documents and financials",
	"Getting calls and texts about maintenance requests at inconvenient times",
	"Complicated and time-consuming tax preparation",
];

const afterBenefits = [
	"Automatic rent collection through direct deposits",
	"One central source of truth for all documents and financials",
	"Centralized maintenance request system accessible from any device",
	"Financial reports and automatic tax calculations for an easy tax season",
];

export function BeforeAfter() {
	return (
		<section
			id="benefits"
			aria-label="We make property management easy."
			className="relative bg-slate-100 text-slate-900 pt-20 pb-8 sm:pt-32 overflow-hidden shadow-sm"
		>
			<Container>
				<div className="mx-auto md:max-w-4xl md:text-center z-20">
					<h2 className="font-display text-3xl sm:text-4xl font-medium tracking-tighter text-slate-800 bg-gradient-to-r to-blue-600 from-[#60a4ff] via-indigo-400 inline-block text-transparent bg-clip-text p-4">
						We make property management easy.
					</h2>
				</div>
				<div className="mx-auto z-10 mt-8 lg:mt-12 flex justify-center max-w-4xl w-full">
					<div className="w-full p-8 rounded-xl outline outline-gray-300 outline-1 z-10 bg-slate-50">
						<div className="md:hidden">
							<div className="text-lg sm:text-xl mb-1 text-blue-300">From</div>
							<div className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-800 mb-2">
								Without Cribbly
							</div>
							<div className="divide-y">
								{beforeBenefits.map((beforeBenefit, index) => (
									<div
										// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
										key={index}
										className="text-md sm:text-lg py-4 flex items-start"
									>
										<span className="h-4 w-4 mr-2 mt-1">
											<XMarkIcon className="h-4 w-4 text-red-600" />
										</span>
										<span>{beforeBenefit}</span>
									</div>
								))}
							</div>
							<div className="text-lg sm:text-xl mb-1 mt-8 text-blue-300">
								To
							</div>
							<div className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-800 mb-2">
								With Cribbly
							</div>
							<div className="divide-y">
								{afterBenefits.map((afterBenefit, index) => (
									<div
										// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
										key={index}
										className="text-md sm:text-lg py-4 flex items-start"
									>
										<span className="h-4 w-4 mr-2 mt-1">
											<CheckIcon className="h-4 w-4 text-green-500" />
										</span>
										<span>{afterBenefit}</span>
									</div>
								))}
							</div>
						</div>
						<div className="hidden md:block">
							<div className="flex">
								<div className="w-5/12 border-b-0">
									<div className="text-xl mb-1 text-blue-300">From</div>
									<div className="text-3xl text-gray-800 font-semibold tracking-tight">
										Without Cribbly
									</div>
								</div>
								<div className="w-1/6 border-b-0" />
								<div className="w-5/12 border-b-0">
									<div className="text-xl mb-1 text-blue-300">To</div>
									<div className="text-3xl text-gray-800 font-semibold tracking-tight">
										With Cribbly
									</div>
								</div>
							</div>
							<div className="divide-y mt-4">
								{beforeBenefits.map((beforeBenefit, index) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									<div key={index} className="text-lg pb-6 pt-4 flex">
										<div className="w-5/12 border-b-0 gap-x-2 flex items-start">
											<span className="h-5 w-5 mt-1 mr-1">
												<XMarkIcon className="h-5 w-5 text-red-600" />
											</span>
											<span>{beforeBenefit}</span>
										</div>
										<div className="w-1/6 border-b-0 text-center flex justify-center">
											<ArrowRightIcon className="h-8 w-8 text-gray-300 mx-4" />
										</div>
										<div className="w-5/12 border-b-0 flex items-start gap-x-2">
											<span className="h-5 w-5 mt-1 mr-1">
												<CheckIcon className="h-5 w-5 text-green-500" />
											</span>
											<span>{afterBenefits[index]}</span>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</Container>
		</section>
	);
}
