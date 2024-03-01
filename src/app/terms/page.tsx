import { Text, Strong } from "@/components/catalyst/text"
import Link from "next/link"

export default function Terms() {
  return(
    <div className="w-full py-6 space-y-6 md:py-12 justify-center flex">
        <div className="container grid max-w-3xl gap-6 px-4 text-sm md:gap-8 md:px-6">
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter">Terms of Service</h1>
            <Text className="text-gray-500 dark:text-gray-400"><Strong>Effective date:</Strong> February 27, 2024</Text>
          </div>
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Introduction</h2>
              <p>
                These terms and conditions outline the rules and regulations for the use of Cribbly&apos;s website,
                located at https://cribbly.io.
              </p>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Interpretation and Definitions</h2>
              <p>
                The words of which the initial letter is capitalized have meanings defined under the following
                conditions. The following definitions shall have the same meaning regardless of whether they appear in
                singular or in plural.
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>For the purposes of these Terms and Conditions:</li>
                <li>
                  You means the individual accessing or using the Service, or the company, or other legal entity on
                  behalf of which such individual is accessing or using the Service, as applicable. Under these Terms,
                  when we refer to &quot;You&quot; or &quot;Your,&quot; we are referring to You, the person accessing the Service and
                  accepting these Terms.
                </li>
                <li>
                  Affiliate means an entity that controls, is controlled by or is under common control with a party,
                  where &quot;control&quot; means ownership of 50% or more of the shares, equity interest or other securities
                  entitled to vote for election of directors or other managing authority.
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">User Responsibilities</h2>
              <p>
                The User is responsible for the security of their account and password. Users must not disclose their
                password to anyone else. Users must also agree to accept all risks of unauthorized access to their data
                and any other information they provide to the Service.
              </p>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Intellectual Property Rights</h2>
              <p>
                The Service and its original content, features, and functionality are and will remain the exclusive
                property of Example Website and its licensors. The Service is protected by copyright, trademark, and
                other laws of both the Country and foreign countries.
              </p>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Disclaimers</h2>
              <p>
                The Service is provided &quot;as is,&quot; without warranty of any kind, express or implied, including but not
                limited to the warranties of merchantability, fitness for a particular purpose, and non-infringement.
              </p>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Limitation of Liability</h2>
              <p>
                In no event shall Example Website, nor its directors, employees, partners, agents, suppliers, or
                affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages,
                including without limitation, loss of profits, data, use, goodwill, or other intangible losses,
                resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct
                or content of any third party on the Service; (iii) any content obtained from the Service; and (iv)
                unauthorized access, use or alteration of your transmissions or content, whether based on warranty,
                contract, tort (including negligence) or any other legal theory, whether or not we have been informed of
                the possibility of such damage, and even if a remedy set forth herein is found to have failed of its
                essential purpose.
              </p>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Governing Law and Jurisdiction</h2>
              <p>
                These Terms shall be governed and construed in accordance with the laws of the State of example-state,
                United States, without regard to its conflict of law provisions.
              </p>
            </div>
          </div>
        </div>
      </div>
  )
}