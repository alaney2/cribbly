import React, { useEffect, useState, useRef } from 'react';
import { RentCard } from '@/components/PropertySettings/RentCard';
import { FeeCard } from '@/components/PropertySettings/FeeCard';

export function SetupProperty({ propertyId }: { propertyId: string }) {
  console.log(propertyId)
  const [fadeOut, setFadeOut] = useState(false);
  
  const animationClass = fadeOut ? 'animate__animated animate__fadeOut animate__faster' : '';

  return (
    <>
      <div
        className={`flex flex-col px-2 pt-8 sm:pt-4 justify-center items-center relative h-full w-full gap-y-4 ${animationClass}`}
      >
        <RentCard />
        {/* <FeeCard /> */}
      </div>
    </>
  )
}