"use client"

import { useState } from 'react'
import { CheckIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { Button } from '@/components/default/Button'
import { Switch, SwitchField } from '@/components/catalyst/switch'
import { Field as HeadlessField } from '@headlessui/react'
import { Label } from '@/components/catalyst/fieldset'

const tiers = [
  {
    name: 'Subscription',
    id: 'tier-hobby',
    href: '#',
    priceMonthly: '$20',
    priceYearly: '$15',
    description: 'Modi dolorem expedita deleniti. Corporis iste qui inventore pariatur adipisci vitae.',
    features: ['Tiered pricing', 'Ability to switch between monthly and yearly plans', '48-hour support response time'],
  },
  {
    name: 'Lifetime',
    id: 'tier-team',
    href: '#',
    priceMonthly: '$450',
    description: 'Explicabo quo fugit vel facere ullam corrupti non dolores. Expedita eius sit sequi.',
    features: [
      'Unlimited updates',
      'Same features',
    ],
  },
]

export function Checkout({ user, subscription, products }: { user: any, subscription: any, products: any }) {

  const [yearly, setYearly] = useState(true)

  return (
    <div className="isolate overflow-hidden bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 pb-96 pt-24 text-center sm:pt-32 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-base font-semibold leading-7 text-indigo-400">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            The right price for you, <br className="hidden sm:inline lg:hidden" />
            whoever you are
          </p>
        </div>
        <div className="relative mt-6">
          <p className="mx-auto max-w-2xl text-lg leading-8 text-white/60">
          If you are not satisfied during the first month, we will issue a full refund.
          </p>
          <svg
            viewBox="0 0 1208 1024"
            className="absolute -top-10 left-1/2 -z-10 h-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:-top-12 md:-top-20 lg:-top-12 xl:top-0"
          >
            <ellipse cx={604} cy={512} fill="url(#6d1bd035-0dd1-437e-93fa-59d316231eb0)" rx={604} ry={512} />
            <defs>
              <radialGradient id="6d1bd035-0dd1-437e-93fa-59d316231eb0">
                <stop stopColor="#7775D6" />
                <stop offset={1} stopColor="#E935C1" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="flow-root bg-white pb-24 sm:pb-32">
        <div className="-mt-80">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto grid max-w-md grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-2">
              {tiers.map((tier) => (
                <div
                  key={tier.id}
                  className="flex flex-col justify-between rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-900/10 sm:p-10"
                >
                  <div>
                    <div className="flex justify-between">
                      <h3 id={tier.id} className="text-base font-semibold leading-7 text-indigo-600">
                        {tier.name}
                      </h3>
                      {tier.name === 'Subscription' && (
                        <SwitchField className="">
                          <Label className="-mr-4">Annual billing</Label>
                          <Switch name="subscription_interval" defaultChecked onChange={setYearly} />
                        </SwitchField>
                      )}
                    </div>
                    {tier.name === 'Subscription' ? (
                      <>
                        <div className="mt-4 flex items-baseline gap-x-2">
                          <span className="text-5xl font-bold tracking-tight text-gray-900">
                            <span className="ml-2">
                              {yearly ? tier.priceYearly : tier.priceMonthly}
                            </span>
                          </span>
                          <span className="text-base font-semibold leading-7 text-gray-600">
                            /month
                          </span>
                        </div>
                      </>
                    )
                    : (
                      <>
                        <div className="mt-4 flex items-baseline gap-x-2">
                          <span className="text-5xl font-bold track">
                          {tier.priceMonthly}
                          </span>
                        </div>
                      </>
                    )}
                    <p className="mt-6 text-base leading-7 text-gray-600">{tier.description}</p>
                    <ul role="list" className="mt-10 space-y-4 text-sm leading-6 text-gray-600">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex gap-x-3">
                          <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a
                    href={tier.href}
                    aria-describedby={tier.id}
                    className="mt-8 block rounded-md bg-indigo-600 px-3.5 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Get started today
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
