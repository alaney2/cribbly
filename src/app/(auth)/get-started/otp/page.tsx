// import Link from 'next/link'

// import { Button } from '@/components/Button'
// import { TextField, SelectFieldNew } from '@/components/Fields'
// import { Logo } from '@/components/Logo'
// import { SlimLayout } from '@/components/SlimLayout'
// import  CleanURL from '@/components/CleanURL';
import { OtpForm } from '@/components/OtpForm'


// export default function Register() {

//   return (
//     <SlimLayout>
//       <CleanURL />
//       <div className="flex">
//         <Link href="/" aria-label="Home">
//           <Logo className="h-10 w-auto" />
//         </Link>
//       </div>
//       < OtpForm />
//     </SlimLayout>
//   )
// }

import Link from 'next/link'

import { Button } from '@/components/Button'
import { TextField } from '@/components/Fields'
import { Logo } from '@/components/Logo'
import { type Metadata } from 'next'
import  CleanURL from '@/components/CleanURL';
import icon from '@/images/icon.png'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Verify code',
}

export default function SignIn() {
  return (
    <>
      {/* <CleanURL /> */}
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/" aria-label="Home">
            <Image
              // className="absolute inset-0 h-full w-full object-cover"
              className='mx-auto h-10 w-auto'
              src={icon}
              alt=""
              // unoptimized
              // priority={false}
            />
          </Link>
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Email verification
          </h2>

        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-gray-50 px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <OtpForm />
          </div>
        </div>
      </div>
    </>
  )
}

