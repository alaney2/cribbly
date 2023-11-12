import logo from '@/images/logo.svg'
import Image from 'next/image'

export function Logo(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <Image
            // className="absolute inset-0 h-full w-full object-cover"
      className='h-28 w-auto pb-2 mx-auto'
      src={logo}
      alt=""
      // unoptimized
      // priority={false}
    />
  )
}
