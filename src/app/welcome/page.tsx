"use client"
import { WelcomeMap } from "@/components/WelcomeMap"
import { SetStateAction, useState } from "react";

export default function Welcome() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { name: 'Step 0', href: '#', status: 'complete' },
    { name: 'Step 1', href: '#', status: 'complete' },
    { name: 'Step 2', href: '#', status: 'current' },
    { name: 'Step 3', href: '#', status: 'upcoming' },
    { name: 'Step 4', href: '#', status: 'upcoming' },
  ]

  const currentStepIndex = steps.findIndex(step => step.status === 'current');

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex);
    }
  };

  const renderStepContent = (stepIndex: number) => {
    switch(stepIndex) {
      case 0:
        return <div>Content for Step 0</div>;
      case 1:
        return <div>Content for Step 1</div>;
      // Add cases for other steps
      default:
        return <div>Welcome! Please select a step.</div>;
    }
  };
  
  return (
    <>
      <div className="w-full h-full px-32 pb-28 pt-16">
        <WelcomeMap />
        <nav className="flex items-center justify-center mt-8" aria-label="Progress">
      {/* <p className="text-sm font-medium">
        Step {steps.findIndex((step) => step.status === 'current') + 1} of {steps.length}
      </p> */}
          <ol role="list" className="flex items-center space-x-5">
            {steps.map((step, index) => (
              <li key={step.name} onClick={() => handleStepClick(index)}>
                {step.status === 'complete' ? (
                  <a href={step.href} className="block h-2.5 w-2.5 rounded-full bg-indigo-600 hover:bg-indigo-900">
                    <span className="sr-only">{step.name}</span>
                  </a>
                ) : step.status === 'current' ? (
                  <a href={step.href} className="relative flex items-center justify-center" aria-current="step">
                    <span className="absolute flex h-5 w-5 p-px" aria-hidden="true">
                      <span className="h-full w-full rounded-full bg-indigo-200" />
                    </span>
                    <span className="relative block h-2.5 w-2.5 rounded-full bg-indigo-600" aria-hidden="true" />
                    <span className="sr-only">{step.name}</span>
                  </a>
                ) : (
                  <a href={step.href} className="block h-2.5 w-2.5 rounded-full bg-gray-200 hover:bg-gray-400">
                    <span className="sr-only">{step.name}</span>
                  </a>
                )}
              </li>
            ))}
          </ol>
        </nav>
        {renderStepContent(currentStep)}

      </div>
    </>
  )
}