import Image from "next/image";

import { Container } from "@/components/default/Container";
import avatarImage1 from "@/images/avatars/avatar-1.png";
import avatarImage2 from "@/images/avatars/avatar-2.png";
import avatarImage3 from "@/images/avatars/avatar-3.png";
import avatarImage4 from "@/images/avatars/avatar-4.png";
import avatarImage5 from "@/images/avatars/avatar-5.png";
import avatar1 from "@/images/avatars/avatar1.jpg";
import avatar2 from "@/images/avatars/avatar2.jpg";
import avatar3 from "@/images/avatars/avatar3.jpg";
import avatar4 from "@/images/avatars/avatar4.jpg";
import avatar5 from "@/images/avatars/avatar5.jpg";
import enterProperty from "@/images/screenshots/enterPropertyScreely.png";
import backgroundImage from "@/images/background-faqs.jpg";

const testimonials = [
	[
		{
			content:
				"Switching to Cribbly was a game-changer for my rental business. The automated features save me countless hours each month. Highly recommend!",
			author: {
				name: "James R.",
				role: "Atlanta, GA",
				image: avatar2,
			},
		},
		{
			content:
				"Cribbly’s maintenance tracking system has cut my response times dramatically, increasing tenant satisfaction and simplifying logistics.",
			author: {
				name: "Sandra L.",
				role: "Dover, MA",
				image: avatarImage4,
			},
		},
	],
	[
		{
			content:
				"As a landlord of multiple properties, Cribbly’s dashboard and reporting tools have simplified my management tasks more than I ever imagined possible.",
			author: {
				name: "Advay S.",
				role: "Seattle, WA",
				image: avatar5,
			},
		},
		{
			content:
				"The automatic rent collection feature alone makes Cribbly worth it. Plus, their customer support is top-notch!",
			author: {
				name: "Mike D.",
				role: "San Francisco, CA",
				image: avatar3,
			},
		},
	],
	[
		{
			content:
				"Cribbly has made tax season a breeze with its streamlined financial reporting. It’s perfect for me because I need to stay organized!",
			author: {
				name: "Jing Z.",
				role: "San Jose, CA",
				image: avatar4,
			},
		},
		{
			content:
				"I love how Cribbly levels the playing field, giving property owners the tools that management firms use at an affordable price.",
			author: {
				name: "Angela K.",
				role: "New York, NY",
				image: avatar1,
			},
		},
	],
];

function QuoteIcon(props: React.ComponentPropsWithoutRef<"svg">) {
	return (
		<svg aria-hidden="true" width={105} height={78} {...props}>
			<path d="M25.086 77.292c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622C1.054 58.534 0 53.411 0 47.686c0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C28.325 3.917 33.599 1.507 39.324 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Zm54.24 0c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622-2.11-4.52-3.164-9.643-3.164-15.368 0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C82.565 3.917 87.839 1.507 93.564 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Z" />
		</svg>
	);
}

export function Testimonials() {
	return (
		<section
			id="testimonials"
			aria-label="What our customers are saying"
			className="relative bg-slate-50 py-20 sm:py-32 overflow-hidden"
		>
			<svg
				viewBox="0 0 1208 1024"
				className="absolute left-1/2 top-7/12 -translate-y-7/12 z-0 h-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] "
			>
				<title>Background gradient</title>
				<ellipse
					cx={604}
					cy={512}
					fill="url(#6d1bd035-0dd1-437e-93fa-59d316231eb0)"
					rx={604}
					ry={512}
				/>
				<defs>
					<radialGradient id="6d1bd035-0dd1-437e-93fa-59d316231eb0">
						<stop stopColor="rgb(65,115,236)" />
						<stop offset={1} stopColor="#3b82f6" />
					</radialGradient>
				</defs>
			</svg>
			<Container className="relative">
				<div className="mx-auto max-w-2xl md:text-center z-10">
					<h2 className="font-display text-3xl sm:text-4xl font-medium tracking-tight bg-gradient-to-r to-blue-600 from-[#60a4ff] via-indigo-400 inline-block text-transparent bg-clip-text">
						Undoubtibbly loved by landlords.
					</h2>
					<p className="mt-4 text-lg tracking-tight text-slate-700 font-medium">
						Join other landlords who’ve elevated their rental game. No hassle,
						just results.
					</p>
				</div>
				<ul className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3">
					{testimonials.map((column, columnIndex) => (
						<li key={columnIndex}>
							<ul role="list" className="flex flex-col gap-y-6 sm:gap-y-8">
								{column.map((testimonial, testimonialIndex) => (
									<li key={testimonialIndex}>
										<figure className="relative rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/10">
											<QuoteIcon className="absolute left-6 top-6 fill-slate-100" />
											<blockquote className="relative">
												<p className="text-lg tracking-tight text-slate-900">
													{testimonial.content}
												</p>
											</blockquote>
											<figcaption className="relative mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
												<div>
													<div className="font-display text-base text-slate-900">
														{testimonial.author.name}
													</div>
													<div className="mt-1 text-sm text-slate-500">
														{testimonial.author.role}
													</div>
												</div>
												{/* <div className="overflow-hidden rounded-full bg-slate-50">
                          <Image
                            className="h-14 w-14 object-cover"
                            src={testimonial.author.image}
                            alt=""
                            width={56}
                            height={56}
                          />
                        </div> */}
											</figcaption>
										</figure>
									</li>
								))}
							</ul>
						</li>
					))}
				</ul>
			</Container>
		</section>
	);
}
