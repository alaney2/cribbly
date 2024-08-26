'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image'
import backgroundDefault from '@/images/background-auth.jpg'
import 'react-loading-skeleton/dist/skeleton.css'
import { Boxes } from '@/components/aceternity/background-boxes'


type SlimLayoutProps = {
  children: React.ReactNode; 
  splineLink?: string
  heading?: string
  subHeading?: string
}

export function SlimLayout({ children, splineLink, heading, subHeading }: SlimLayoutProps ) {
  const [isLargeScreen, setIsLargeScreen] = useState(true)

  useEffect(() => {
    const checkSize = () => {
      if (typeof window === 'undefined') return
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    checkSize();
    if (typeof window === 'undefined') return
    window.addEventListener('resize', checkSize);

    return () => window.removeEventListener('resize', checkSize);
  }, [isLargeScreen]);

  return (
    <>
      <div className="relative flex min-h-full justify-center md:px-12 lg:px-0 bg-gray-50">
        <div className="relative z-10 flex flex-1 flex-col px-4 py-10 justify-center md:flex-none md:px-28">
          <main className="mx-auto w-full max-w-md sm:px-4 md:w-96 md:max-w-sm md:px-0">
            {children}
          </main>
        </div>
        {isLargeScreen && (
          <div className="hidden lg:relative lg:block lg:flex-1 leading-4">
            <>
              <div className="h-full relative w-full overflow-hidden bg-blue-500 flex flex-col items-center justify-center select-none">
                <div className="absolute inset-0 bg-blue-500/60 w-full h-full z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
                <Image src={backgroundDefault} alt="" className="absolute inset-0 h-full w-full object-cover z-0 " />
                <Boxes/>
                <h1 className={"md:text-2xl xl:text-3xl text-xl text-white relative z-20"}>
                  {heading ? heading : 'Get started with Cribbly'}
                </h1>
                <p className="text-center mt-2 text-neutral-300 relative z-20 mb-36">
                  {subHeading ? subHeading : 'Start managing your rental properties today!'}
                </p>
              </div>
            </>
          </div>
        )}
      </div>
    </>
  )
}
