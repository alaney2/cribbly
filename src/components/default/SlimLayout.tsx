'use client'
import React, { Suspense, useState, useEffect } from 'react';
import Image from 'next/image'
// import Spline from '@splinetool/react-spline';
import backgroundDefault from '@/images/background-auth.jpg'
import 'animate.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import { Notification } from '@/components/Notification'
import { signal, effect } from '@preact/signals'
import { Boxes } from '@/components/aceternity/background-boxes'
import { cn } from '@/utils/cn'
import { getGPUTier } from 'detect-gpu';

const Spline = React.lazy(() => import('@splinetool/react-spline'));

export function SlimLayout({ children, splineLink }: { children: React.ReactNode; splineLink?: string }) {
  const isSplineLoaded = signal(false)
  const isLargeScreen = signal(true)
  const isHardwareAccelerated = signal(true)
  // const gpuTier = await getGPUTier();

  const handleSplineLoaded = () => {
    setTimeout(() => {
      isSplineLoaded.value = true
    }, 0)
  }

  effect(() => {
    const checkSize = () => {
      if (typeof window === 'undefined') return
      isLargeScreen.value = window.innerWidth >= 1024;
    };

    checkSize();
    if (typeof window === 'undefined') return
    window.addEventListener('resize', checkSize);

    return () => window.removeEventListener('resize', checkSize);
  });

  // useEffect(() => {
  //   const checkHardwareAcceleration = () => {
  //     if (typeof window === 'undefined') return
  //     const logicalProcessors = navigator.hardwareConcurrency || 0;
  //     isHardwareAccelerated.value = logicalProcessors >= 9999;
  //   };
  //   checkHardwareAcceleration();
  // }, []);

  return (
    <>
      <div className="relative flex min-h-full justify-center md:px-12 lg:px-0 bg-gray-100">
        <Suspense>
          <Notification />
        </Suspense>
        <div className="relative z-10 flex flex-1 flex-col  px-4 py-10 justify-center md:flex-none md:px-28">
          <main className="mx-auto w-full max-w-md sm:px-4 md:w-96 md:max-w-sm md:px-0">
            {children}
          </main>
        </div>
        {isLargeScreen.value && (
          <div className="hidden lg:relative lg:block lg:flex-1 leading-4">
            {/* {(gpuTier > 0 || !splineLink) && ( */}
              <>
                <div className="h-full relative w-full overflow-hidden bg-blue-500 flex flex-col items-center justify-center select-none">
                  <div className="absolute inset-0 bg-blue-500/60 w-full h-full z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
                  <Image src={backgroundDefault} alt="" className="absolute inset-0 h-full w-full object-cover z-0 " />
                  <Boxes/>
                  <h1 className={"md:text-2xl xl:text-3xl text-xl text-white relative z-20"}>
                    Get started with Cribbly
                  </h1>
                  <p className="text-center mt-2 text-neutral-300 relative z-20">
                    Start managing your rental properties today!
                  </p>
                </div>
              </>
            {/* )} */}
            {/* {splineLink && gpuTier > 0 (
              <>
                {!isSplineLoaded.value && <Skeleton containerClassName="flex-1" height="100%" className="bg-opacity-0.1 opacity-0.05 z-10"/>}
                <Spline
                  scene={splineLink}
                  className="absolute inset-0 h-full w-full object-cover z-10 animate__animated animate__fadeIn animate__faster"
                  onLoad={handleSplineLoaded}
                  onError={() => {
                    isHardwareAccelerated.value = false
                  }}
                />
              </>
            )} */}
          </div>
        )}
      </div>
    </>
  )
}
