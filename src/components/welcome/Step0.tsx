import React, { useState } from 'react';
import logo from '@/images/icon.png'
import Image from 'next/image';
import { Button } from '@/components/catalyst/button'
import { Text } from '@/components/catalyst/text'
import 'animate.css';

export function Step0( { buttonOnClick }: { buttonOnClick: () => void } ) {
  const [fadeOut, setFadeOut] = useState(false);

  const handleButtonClick = () => {
    setFadeOut(true);
    setTimeout(buttonOnClick, 500);
  };
  const animationClass = fadeOut ? 'animate__animated animate__fadeOut animate__faster' : '';

  return (
    <>
      <div className={`flex flex-col items-center justify-center h-full ${animationClass}`}>
        <div className="text-center">
          <Image 
            src={logo}
            className='animate__animated animate__backInDown mx-auto mt-12 w-16 sm:w-24' 
            alt="Cribbly logo" 
          />
          <h1 
            className="text-2xl sm:text-5xl select-none tracking-tighter font-semibold mt-4 delay-500 animate__animated animate__fadeIn animate__fast"
            style={{ animationDelay: '1.1s' }}
          >
            Welcome to Cribbly
          </h1>
          <Text 
            className="mt-6 select-none animate__animated animate__fadeIn animate__fast"
            style={{ animationDelay: '1.3s' }}
          >
            Cribbly helps you streamline rent collection and property analytics for all your homes.
          </Text>
          <Button 
            onClick={handleButtonClick}
            color='blue'
            className="w-64 sm:w-80 h-12 text-4xl mt-8 py-2 px-4 rounded-lg animate__animated animate__fadeIn animate__fast"
            style={{ animationDelay: '1.5s' }}
          >
            Get Started
          </Button>
        </div>
      </div>
    </>
  )
}