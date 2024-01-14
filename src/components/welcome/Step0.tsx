import logo from '@/images/icon.png'
import Image from 'next/image';
import { Button } from '@/components/catalyst/button'
import { Text, Strong } from '@/components/catalyst/text'
import 'animate.css';

export function Step0( { buttonOnClick }: { buttonOnClick: () => void }) {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-center">
          <Image 
            src={logo} 
            className='animate__animated animate__backInDown mx-auto mt-12' 
            alt="Cribbly logo" 
            width={100} height={100} 
          />
          <h1 
            className="text-6xl tracking-tighter font-semibold mt-4 delay-500 animate__animated animate__fadeIn animate__fast"
            style={{ animationDelay: '1.1s' }}
          >
            Welcome to Cribbly
          </h1>
          <Text 
            className="mt-6 animate__animated animate__fadeIn animate__fast"
            style={{ animationDelay: '1.3s' }}
          >
            Cribbly helps you streamline rent collection and property analytics for all your rental properties.
          </Text>
          <Button 
            onClick={buttonOnClick} 
            color='blue' 
            className="w-80 h-12 text-4xl mt-8 py-2 px-4 rounded-lg animate__animated animate__fadeIn animate__fast"
            style={{ animationDelay: '1.5s' }}
          >
            Get Started
          </Button>
        </div>
      </div>
    </>
  )
}