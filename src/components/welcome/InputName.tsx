import { SetStateAction, useState } from 'react';
import logo from '@/images/icon.png'
import Image from 'next/image';
import styles from './Welcome.module.css';
import { Button } from '@/components/catalyst/button'
import { setFullName } from '@/components/welcome/action'

const formClasses =
  'block text-sm w-72 sm:w-80 h-10 appearance-none bg-gray-50 rounded-md border-1 border-gray-200 bg-white px-3 py-1.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 text-center animate__animated animate__fadeIn animate__fast'


export function InputName({ buttonOnClick }: { buttonOnClick: () => void }) {
  const [fadeOut, setFadeOut] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const animationClass = fadeOut ? 'animate__animated animate__fadeOut animate__faster' : '';

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const fullName = inputValue.trim();
    if (fullName === '') return;
    if (typeof window !== "undefined") {
      localStorage.setItem("fullName", fullName);
    }
    setFadeOut(true);
    setTimeout(buttonOnClick, 300);
  };

  const handleInputChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setInputValue(e.target.value);
  };

  return (
    <>
      <div className={`w-full flex flex-col items-center justify-center h-full mx-auto ${animationClass}`}>
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
        <form>
          <label htmlFor="name" className="sr-only">
            Full name
          </label>
          <input
            type="name"
            name="name"
            id="name"
            className={`${formClasses} ${styles.inputCenterText}`}
            placeholder="Full name"
            style={{ animationDelay: '0.3s' }}
            required={true}
            onChange={handleInputChange}
          />
          <Button
            type="submit"
            onClick={handleButtonClick}
            color='blue'
            className="w-72 sm:w-80 h-10 text-sm mt-4 mb-12 py-2 px-4 rounded-md animate__animated animate__fadeIn"
            style={{ animationDelay: '0.4s' }}
          >
            Next
          </Button>
        </form>
      </div>
    </>
  )
}