import logo from '@/images/icon.png'
import Image from 'next/image';
import { Button } from '@/components/catalyst/button'
import { Text, Strong } from '@/components/catalyst/text'

export function Step0( { buttonOnClick }: { buttonOnClick: () => void }) {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-center">
          <Image src={logo} className='mx-auto' alt="Cribbly logo" width={100} height={100} />
          <h1 className="text-5xl tracking-tight font-bold mt-8">Welcome to Cribbly</h1>
          <Text className="mt-4">Cribbly helps you streamline rent collection and property analytics for all your rental properties.</Text>
          <Button onClick={buttonOnClick} color='blue' className="w-80 h-14 text-4xl mt-16 py-2 px-4 rounded-lg">
            Get Started
          </Button>
        </div>
      </div>
    </>
  )
}