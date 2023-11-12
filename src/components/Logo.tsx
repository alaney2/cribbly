import logo from '@/images/logo-cropped.svg'
import Image from 'next/image'

// import { ReactComponent as LogoSVG } from './path/to/logo.svg';


export function Logo(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <Image
            // className="absolute inset-0 h-full w-full object-cover"
      className='h-10 w-auto pb-2 mx-auto'
      src={logo}
      alt=""
      priority
      // unoptimized
      // priority={false}
    />
  )
}
