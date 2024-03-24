'use client'
import { useState } from 'react'
import { Step0 } from '@/components/welcome/Step0'
import { InputName } from '@/components/welcome/InputName'
import { AutofilledProperty } from '@/components/welcome/AutofilledProperty'
import { WelcomeMap } from '@/components/welcome/WelcomeMap'
import { Checkout } from '@/components/welcome/Checkout'
import Payment from '@/components/welcome/Payment'
import { Pricing } from '@/components/landing/Pricing'
import { Checkout2 } from '@/components/welcome/Checkout2'

export default function WelcomeLayout({ user, subscription, products } : { user: any, subscription: any, products: any }) {
  const [currentStep, setCurrentStep] = useState(2)

  const steps = [
    { name: 'Step 0' },
    { name: 'Step 1' },
    { name: 'Step 2' },
    // { name: 'Step 3' },
    // { name: 'Step 4' },
  ]

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex < currentStep) {
      setCurrentStep(stepIndex)
    }
  }

  const renderStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return (
          <Step0 buttonOnClick={() => setCurrentStep(currentStep + 1)} />
        )
      case 1:
        return (
          <InputName buttonOnClick={() => setCurrentStep(currentStep + 1)} />
        )
      case 2:
        return (
          <WelcomeMap
            buttonOnClick={() => setCurrentStep(currentStep + 1)}
          />
        )
      // case 3:
      //   return (
      //     <Checkout user={user} subscription={subscription} products={products} />
      //   )
      // case 4:
      //   return (
      //     <Checkout2 user={user} subscription={subscription} products={products} />
      //   )
      default:
        return <div className="h-full w-full px-32 pb-28 pt-16">Error here</div>
    }
  }

  return (
    <>
      <div className="flex flex-col min-h-screen w-full overscroll-none bg-gray-50">
        <div className="flex-grow flex flex-col items-center justify-center">
          {renderStepContent(currentStep)}
        </div>

        {/* Nav dots */}
        <nav className="flex items-center justify-center z-0 py-16" aria-label="Progress">
          <ol role="list" className="flex items-center space-x-5">
            {steps.map((step, index) => (
              <li key={step.name} onClick={() => handleStepClick(index)}>
                {index === currentStep ? (
                  <a className="block h-2.5 w-2.5 rounded-full bg-blue-600">
                    <span className="sr-only">{step.name}</span>
                  </a>
                ) : (
                  <a className="block h-2.5 w-2.5 rounded-full bg-zinc-300 transition duration-300 ease-in-out hover:bg-zinc-400">
                    <span className="sr-only">{step.name}</span>
                  </a>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </>
  )
}
