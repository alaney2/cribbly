"use client"
import { WelcomeMap } from "@/components/WelcomeMap"
import { SetStateAction, useState } from "react";
import { Step0 } from '@/components/welcome/Step0'

export default function Welcome() {
  const [currentStep, setCurrentStep] = useState(2);

  const steps = [
    { name: 'Step 0', href: '' },
    { name: 'Step 1', href: '' },
    { name: 'Step 2', href: '' },
    { name: 'Step 3', href: '' },
    { name: 'Step 4', href: '' },
  ]

  // const currentStepIndex = steps.findIndex(step => step.status === 'current');

  const handleStepClick = (stepIndex: number) => {
    // if (stepIndex <= currentStep) {
    //   setCurrentStep(stepIndex);
    // }
    setCurrentStep(stepIndex);

  };

  const renderStepContent = (stepIndex: number) => {
    switch(stepIndex) {
      case 0:
        return <div className="w-full h-full px-32 pb-28 pt-16"><Step0 /></div>;
      case 1:
        return <div className="w-full h-full px-32 pb-28 pt-16">Content for Step 1</div>;
      case 2:
        return <WelcomeMap />;
      case 3:
        return <div className="w-full h-full px-32 pb-28 pt-16">Content for Step 3</div>;
      case 4:
        return <div className="w-full h-full px-32 pb-28 pt-16">Content for Step 4</div>;
      default:
        return <div className="w-full h-full px-32 pb-28 pt-16">Welcome! Please select a step.</div>;
    }
  };
  
  return (
    <>
      <div className="w-full h-full px-32 pb-28 pt-16">
        {renderStepContent(currentStep)}

        <nav className="flex items-center justify-center mt-8" aria-label="Progress">
          <ol role="list" className="flex items-center space-x-5">
            {steps.map((step, index) => (
              <li key={step.name} onClick={() => handleStepClick(index)}>
                {index === currentStep ? (
                  <a className="block h-2.5 w-2.5 rounded-full bg-indigo-600 hover:bg-indigo-900">
                    <span className="sr-only">{step.name}</span>
                  </a>
                ) : (
                  <a className="block h-2.5 w-2.5 rounded-full bg-gray-200 hover:bg-gray-400">
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