'use client'
import React, { Suspense, useState, useEffect } from 'react';
import Image from 'next/image'
// import Spline from '@splinetool/react-spline';
import backgroundDefault from '@/images/background-auth.jpg'
import 'animate.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'

const Spline = React.lazy(() => import('@splinetool/react-spline'));

export function SlimLayout({ children, splineLink }: { children: React.ReactNode; splineLink: string }) {
  
  const [isSplineLoaded, setIsSplineLoaded] = useState(false)
  const [isLargeScreen, setIsLargeScreen] = useState(false)

  const handleSplineLoaded = () => {
    setTimeout(() => {
      setIsSplineLoaded(true)
    }, 100)
  }

  useEffect(() => {
    const checkSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    checkSize();
    window.addEventListener('resize', checkSize);

    return () => window.removeEventListener('resize', checkSize);
  }, []);

  return (
    <>
      {/* <link rel="preload" href="https://prod.spline.design/zRVkT5sl31cwbtW2/scene.splinecode" as="fetch"></link> */}

      <div className="relative flex min-h-full justify-center md:px-12 lg:px-0 bg-gray-100">
        <div className="relative z-10 flex flex-1 flex-col  px-4 py-10 justify-center md:flex-none md:px-28">
          <main className="mx-auto w-full max-w-md sm:px-4 md:w-96 md:max-w-sm md:px-0">
            {children}
          </main>
        </div>
        {isLargeScreen && (
          <div className="hidden lg:relative lg:block lg:flex-1 leading-4">
            {!isSplineLoaded && <Skeleton containerClassName="flex-1" height="100%" className="bg-opacity-0.1 opacity-0.05 z-10"/>}
              <Spline 
                scene={splineLink}
                className="absolute inset-0 h-full w-full object-cover z-10 animate__animated animate__fadeIn animate__faster"
                onLoad={handleSplineLoaded}
              />
            {/* </Suspense> */}
            {/* <Image src={backgroundDefault} alt="" className="absolute inset-0 h-full w-full object-cover z-0 opacity-0.05" /> */}
          </div>
        )}
      </div>
    </>
  )
}
