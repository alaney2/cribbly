import { Text, Strong } from "@/components/catalyst/text"
import Link from "next/link"
import { type Metadata } from 'next'
import Head from 'next/head'

export const metadata: Metadata = {
  title: 'Information Security Policy'
}

export default function InformationSecurity() {
  return (
    <>
      <Head>
        <title>Information Security Policy</title>
      </Head>
      <div className="w-full py-6 space-y-6 md:py-12 justify-center flex">
        <div className="container grid max-w-3xl gap-6 px-4 text-sm md:gap-8 md:px-6">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Information Security Policy</h1>
            <Text className="text-gray-500 dark:text-gray-400"><Strong>Effective date:</Strong> March 27, 2024</Text>
          </div>
          <div className="space-y-8">
            <div className="space-y-2">
              <p>
                At Cribbly, we are committed to protecting the confidentiality, integrity, and availability of our users' information. This Information Security Policy outlines our approach to identifying, mitigating, and monitoring information security risks associated with our real estate property management software.
              </p>
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-bold">Scope</h2>
              <p>
                This policy applies to all employees, contractors, and third-party vendors who have access to Cribbly's information assets, including our software, systems, and user data.
              </p>
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-bold">Data Security</h2>
              <p>
                We store user data securely on the cloud using Supabase, which employs AES-256 encryption for data at rest and TLS encryption for data in transit. Our software is hosted on Vercel, a secure cloud platform.
              </p>
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-bold">Access Control</h2>
              <p>
                Access to user data and systems is strictly controlled and granted on a need-to-know basis. We employ strong authentication mechanisms, such as multi-factor authentication, to prevent unauthorized access.
              </p>
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-bold">Risk Assessment and Management</h2>
              <p>
                We regularly conduct risk assessments to identify potential threats and vulnerabilities to our information assets. Based on these assessments, we implement appropriate controls and mitigation strategies to minimize the identified risks.
              </p>
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-bold">Incident Response</h2>
              <p>
                In the event of a security incident, we have an established incident response plan to promptly detect, contain, and recover from the incident. We will notify affected users in accordance with applicable laws and regulations.
              </p>
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-bold">Employee Training and Awareness</h2>
              <p>
                All employees and contractors undergo regular information security training to ensure they understand their roles and responsibilities in protecting user data and maintaining a secure environment.
              </p>
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-bold">Third-Party Vendor Management</h2>
              <p>
                We carefully assess the security practices of our third-party vendors and require them to adhere to strict security standards to protect user data.
              </p>
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-bold">Continuous Improvement</h2>
              <p>
                We regularly review and update our information security policy and practices to ensure they remain effective and aligned with industry best practices and regulatory requirements.
              </p>
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-bold">Contact Us</h2>
              <p>If you have any questions or concerns about our Information Security Policy, please contact us at:</p>
              <p>
                Email: security@cribbly.io
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}