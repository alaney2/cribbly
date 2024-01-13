import logo from '@/images/logo-cropped.svg'
import Image from 'next/image';

export function Step0() {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-full bg-blue-500">
      <div className="text-center">
        <Image src={logo} alt="Linear Logo" width={100} height={100} />
        <h1 className="text-4xl font-bold mt-8">Welcome to Cribbly</h1>
        <p className="mt-4">Cribbly helps you to streamline software development, cycles, and bug fixes.</p>
        <button className="mt-8 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
          Get Started
        </button>
      </div>
    </div>
    </>
  )
}