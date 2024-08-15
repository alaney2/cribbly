'use client'
import { useState } from 'react'
import { Button } from "@/components/catalyst/button"
import { Step0 } from '@/components/welcome/Step0'
import { InputName } from '@/components/welcome/InputName'
import { AutofilledProperty } from '@/components/welcome/AutofilledProperty'
import { WelcomeMap } from '@/components/welcome/WelcomeMap'
import { Checkout } from '@/components/welcome/Checkout'
import Payment from '@/components/welcome/Payment'
import { Pricing } from '@/components/landing/Pricing'
import { Checkout2 } from '@/components/welcome/Checkout2'
import { SetupProperty } from '@/components/welcome/SetupProperty'
import { InviteCard } from '@/components/PropertySettings/InviteCard';
import { setWelcomeScreen } from '@/utils/supabase/actions'
import { useRouter } from 'next/navigation'
import GoogleMap from '@/components/welcome/GoogleMap'

export default function WelcomeLayout({ user, subscription, products } : { user: any, subscription: any, products: any }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [propertyId, setPropertyId] = useState("")
  const [fullName, setFullName] = useState('');
  const [finishWelcome, setFinishWelcome] = useState(false)
  const router = useRouter()

  const steps = [
    { name: 'Step 0' },
    { name: 'Step 1' },
    { name: 'Step 2' },
    { name: 'Step 3' },
    { name: 'Step 4' },
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
          <InputName fullName={fullName} setFullName={setFullName} buttonOnClick={() => setCurrentStep(currentStep + 1)} />
        )
      case 2:
        return (
          // <WelcomeMap
          //   buttonOnClick={() => setCurrentStep(currentStep + 1)}
          //   setPropertyId={setPropertyId}
          // />
          <GoogleMap buttonOnClick={() => setCurrentStep(currentStep + 1)} />
        )
      case 3:
        return (
          <SetupProperty propertyId={propertyId} setPropertyId={setPropertyId} buttonOnClick={() => setCurrentStep(currentStep + 1)} />
        )
      case 4:
        return (
          <div className="flex flex-col justify-center">
            <InviteCard propertyId={propertyId} setPropertyId={setPropertyId} finishWelcome={finishWelcome} setFinishWelcome={setFinishWelcome} />
            <Button disabled={!finishWelcome} className="mt-8 " color="blue"
              onClick={async () => {
                // setFadeOut(true)
                localStorage.removeItem('propertyId')
                localStorage.removeItem('fullName')
                localStorage.removeItem('email')
                await setWelcomeScreen(false)
                router.push('/dashboard')
              }}
            >
              Finish setup
            </Button>
            <Button className="mt-4" plain
              onClick={async () => {
                // setFadeOut(true)
                localStorage.removeItem('propertyId')
                localStorage.removeItem('fullName')
                localStorage.removeItem('email')
                await setWelcomeScreen(false)
                router.push('/dashboard')
              }}
            >
              Skip, do later
            </Button>
          </div>
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
        return <div className="h-full w-full px-32 pb-28 pt-16">Error</div>
    }
  }

  return (
    <>
      <div className="flex flex-col h-full w-full bg-gray-50">
        <div className="flex-grow flex flex-col items-center justify-center ">
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
                  <a className="block h-2.5 w-2.5 rounded-full bg-zinc-300 transition duration-300 ease-in-out">
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
