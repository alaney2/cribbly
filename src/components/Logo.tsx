import React from 'react';
import Image from 'next/image';
import logo from '@/images/logo-cropped.svg';

export function Logo({ className, ...rest }: { className?: string; [key: string]: any }) {
  // Set the default className if not provided
  const finalClassName = className || 'h-10 w-auto pb-2 mx-auto';

  return (
    <Image
      className={finalClassName}
      src={logo}
      alt=""
      priority
      {...rest} // Spread the rest of the props here
    />
  );
}
