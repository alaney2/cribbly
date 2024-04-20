import Image from 'next/image'
import { Container } from '@/components/default/Container'
import { XMarkIcon, CheckIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/catalyst/table'

const beforeBenefits = [
  'Spending time and energy keeping track of and collecting rent',
  'Having unorganized documents and feeling unsure about financials',
  'Getting calls and texts about maintenance requests at inconvenient times',
  'Complicated and time-consuming tax preparation',
]

const afterBenefits = [
  'Automatic rent collection through direct deposits',
  'One central source of truth for all documents and financials',
  'Centralized maintenance request system accessible from any device',
  'Financial reports and automatic tax calculations for an effortless tax season',
]

export function BeforeAfter() {
  return (
    <section
      id="benefits"
      aria-label="We make property management easy."
      className="relative bg-slate-50 pt-20 sm:pt-32 pb-12 sm:pb-12 overflow-hidden"
    >
      <Container>
        <div className="mx-auto md:max-w-2xl text-center z-10">
          <h2 className="font-display text-4xl font-semibold tracking-tight text-slate-800">
            We make property management easy.
          </h2>
        </div>
        <div className="mx-auto mt-8 lg:mt-12 flex justify-center max-w-4xl w-full">
          <div className="w-full p-8 rounded-xl outline outline-gray-300 outline-1">
            <div className="md:hidden">
              <div className="text-xl mb-1 text-blue-300">From</div>
              <div className="text-3xl font-semibold tracking-tight text-gray-800 mb-2">Without Cribbly</div>
              <div className="divide-y">
                {beforeBenefits.map((beforeBenefit, index) => (
                  <div key={index} className="text-lg py-4">
                    <XMarkIcon className="h-5 w-5 text-red-600 mr-2 inline" />
                    {beforeBenefit}
                  </div>
                ))}
              </div>
              <div className="text-xl mb-1 mt-8 text-blue-300">To</div>
              <div className="text-3xl font-semibold tracking-tight text-gray-800 mb-2">With Cribbly</div>
              <div className="divide-y">
                {afterBenefits.map((afterBenefit, index) => (
                  <div key={index} className="text-lg py-4">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 inline" />
                    {afterBenefit}
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:block">
              <div className="flex">
                <div className="w-5/12 border-b-0">
                  <div className="text-xl mb-1 text-blue-300">From</div>
                  <div className="text-3xl text-gray-800 font-semibold tracking-tight">Without Cribbly</div>
                </div>
                <div className="w-1/6 border-b-0"></div>
                <div className="w-5/12 border-b-0">
                  <div className="text-xl mb-1 text-blue-300">To</div>
                  <div className="text-3xl text-gray-800 font-semibold tracking-tight">With Cribbly</div>
                </div>
              </div>
              <div className="divide-y mt-4">
                {beforeBenefits.map((beforeBenefit, index) => (
                  <div key={index} className="text-lg pb-6 pt-4 flex">
                    <div className="w-5/12 border-b-0 gap-x-2 flex items-start flex">
                      <XMarkIcon className="h-5 w-6 text-red-600 mt-1 inline" />
                      <span>{beforeBenefit}</span>
                    </div>
                    <div className="w-1/6 border-b-0 text-center flex justify-center">
                      <ArrowRightIcon className="h-8 w-8 text-gray-300 mx-4" />
                    </div>
                    <div className="w-5/12 border-b-0 flex items-start gap-x-2">
                      <CheckIcon className="h-5 w-6 text-green-500 inline mt-1" />
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
  )
}