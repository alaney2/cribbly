import { useState, useEffect } from 'react';
import logo from '@/images/icon.png'
import Image from 'next/image';
import styles from '@/styles/InputCenter.module.css';
import { Button } from '@/components/catalyst/button'
import { updateFullName } from '@/utils/supabase/actions';

type InputNameProps = {
  fullName: string
  setFullName: (fullName: string) => void
  buttonOnClick: () => void
}
const formClasses =
  'block text-base w-80 h-10 appearance-none bg-gray-50 rounded-md border-1 border-gray-200 bg-white px-3 py-1.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 text-center animate__animated animate__fadeIn animate__fast'

export function InputName({ fullName, setFullName, buttonOnClick }: InputNameProps) {
  const [fadeOut, setFadeOut] = useState(false);
  const animationClass = fadeOut ? 'animate__animated animate__fadeOut animate__faster' : '';

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const fullNameTrimmed = fullName.trim();
    if (fullNameTrimmed === '') return;
    setFadeOut(true);
    setTimeout(buttonOnClick, 300);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
  };

  return (
    <>
      <div className={`mt-8 w-full flex flex-col items-center justify-center h-full mx-auto ${animationClass}`}>
        <Image 
          src={logo}
          className='animate__animated animate__fadeIn animate__fast mx-auto w-12 sm:w-16'
          alt="Cribbly logo"
          style={{ animationDelay: '0.1s' }}
        />
        <h2 
          className='text-xl sm:text-2xl font-semibold text-nowrap text-gray-500 mb-4 mt-2 animate__animated animate__fadeIn animate__fast'
          style={{ animationDelay: '0.2s' }}
        >
          How shall we call you?
        </h2>
        <form action={updateFullName}>
          <label htmlFor="name" className="sr-only">
            Legal name
          </label>
          <input
            type="name"
            name="name"
            id="name"
            className={`${formClasses} ${styles.inputCenterText}`}
            placeholder="Legal name"
            style={{ animationDelay: '0.3s' }}
            required
            onChange={handleInputChange}
            autoFocus
            defaultValue={fullName}
          />
          <Button
            type="submit"
            onClick={handleButtonClick}
            color='blue'
            className="w-80 h-10 text-sm mt-4 mb-12 py-2 px-4 rounded-md animate__animated animate__fadeIn"
            style={{ animationDelay: '0.4s' }}
          >
            Next
          </Button>
        </form>
      </div>
    </>
  )
}