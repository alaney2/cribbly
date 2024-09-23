import { Text, Strong } from "@/components/catalyst/text";
import Link from "next/link";
import type { Metadata } from "next";
import Head from "next/head";

export const metadata: Metadata = {
	title: "Privacy Policy",
};

export default function Privacy() {
	return (
		<>
			<div className="w-full py-6 space-y-6 md:py-12 justify-center flex">
				<div className="container grid max-w-3xl gap-6 px-4 text-sm md:gap-8 md:px-6">
					<div className="space-y-4">
						<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
							Privacy Policy
						</h1>
						<Text className="text-gray-500 dark:text-gray-400">
							<Strong>Effective date: February 27, 2024</Strong>
						</Text>
					</div>
					<div className="space-y-8">
						<div className="space-y-2">
							<p>
								At Cribbly, we take your privacy very seriously. It is our
								policy to respect your privacy regarding any information we may
								collect from you across our website.
							</p>
							<p>
								We only ask for personal information when we truly need it to
								provide a service to you. We collect it by fair and lawful
								means, with your knowledge and consent.
							</p>
							<p>
								We only retain collected information for as long as necessary to
								provide you with your requested service. What data we store,
								we&apos;ll protect within commercially acceptable means to
								prevent loss and theft, as well as unauthorized access,
								disclosure, copying, use or modification.
							</p>
							<Text>
								<Strong>
									By engaging with our Services in any capacity, you acknowledge
									and agree to the practices and policies detailed here. Your
									consent is given for the collection, utilization, and sharing
									of your information in accordance with the guidelines set
									forth in this Privacy Policy.
								</Strong>
							</Text>
							<Text className="font-medium">
								Please note that your interaction with Cribbly&apos;s Services
								is consistently governed by our{" "}
								<Link href="/terms" className="text-blue-600">
									Terms of Service
								</Link>
								. Terms used in this Policy, which are not defined here, carry
								their meanings as specified in the{" "}
								<Link href="/terms" className="text-blue-600">
									Terms of Service
								</Link>
								.
							</Text>
						</div>
						<div className="space-y-2">
							<h2 className="text-lg font-bold">Data</h2>
							<p>
								We collect information that your browser sends whenever you
								visit our site. We don&apos;t store personal information on our
								servers unless required for the on-going operation of our site.
								User data will be securely stored in AES-256 and TLS-encrypted
								databases. Data stored will never be sold to third parties.
							</p>
						</div>
						<div className="space-y-2">
							<h2 className="text-lg font-bold">Cookies</h2>
							<p>
								We use cookies for analytics purposes and to provide necessary
								services such as billing through companies like Stripe.
							</p>
						</div>
						<div className="space-y-2">
							<h2 className="text-lg font-bold">Third-Party Services</h2>
							<p>
								We may employ third-party companies and individuals due to the
								following reasons:
							</p>
							<ul className="list-disc list-inside">
								<li>To facilitate our Service;</li>
								<li>To provide the Service on our behalf;</li>
								<li>To perform Service-related services; or</li>
								<li>To assist us in analyzing how our Service is used.</li>
							</ul>
						</div>
						<div className="space-y-2">
							<h2 className="text-lg font-bold">Security</h2>
							<p>
								We value your trust in providing us your personal information,
								thus we are striving to use commercially acceptable means of
								protecting it.
							</p>
						</div>
						<div className="space-y-2">
							<h2 className="text-lg font-bold">Links to Other Sites</h2>
							<p>
								This Service may contain links to other sites. If you click on a
								third-party link, you will be directed to that site.
							</p>
						</div>
						<div className="space-y-2">
							<h2 className="text-lg font-bold">
								Changes to This Privacy Policy
							</h2>
							<p>
								We may update our Privacy Policy from time to time. Thus, you
								are advised to review this page periodically for any changes.
							</p>
						</div>
						<div className="space-y-2">
							<h2 className="text-lg font-bold">Contact Us</h2>
							<p>
								If you have any questions or suggestions about our Privacy
								Policy, do not hesitate to contact us.
							</p>
							<p>Email: support@cribbly.io</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
