'use client'
import { useState, useEffect } from 'react'
import {
  HomeIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link';
import { redirect, usePathname } from 'next/navigation'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
const navigation = [
  { name: 'All properties', href: '/dashboard', icon: HomeIcon },
  { name: 'Settings', href: '/dashboard/account', icon: Cog6ToothIcon },
  // { name: 'Support', href: '/', icon: QuestionMarkCircleIcon },
]
export function MobileSidebarDashboard({ user }: { user: any }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const userEmail = user.email;

  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add("overflow-y-hidden")
      // document.body.classList.add("fixed")
    } else {
      document.body.classList.remove("overflow-y-hidden")
      // document.body.classList.remove("fixed")
    }
  }, [sidebarOpen]);

  return (
    <>
      <div className="sticky top-0 z-50 flex items-center gap-x-6 bg-gray-50 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <button
          type="button"
          className={`fixed -m-2.5 p-2.5 text-gray-700 lg:hidden z-50 ${sidebarOpen ? 'openmenu' : ''}`}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <span className="sr-only">Open sidebar</span>
          <div className="menu">
            <div>
              <span className="line-1"></span>
              <span className="line-2"></span>
              <span className="line-3"></span>
            </div>
          </div>
        </button>
        <Link href="/dashboard" className="flex-1 flex justify-center">
          <div className="text-md text-gray-700 font-lexend font-medium">Cribbly</div>
        </Link>
      </div>
      <div className={`fixed inset-0 flex lg:hidden z-40 ${sidebarOpen ? 'fixed w-full h-lvh translate-x-0 ' : '-translate-x-full'} transition-transform duration-300 ease-in-out bg-gray-50`}>
        <div className="flex grow flex-col overflow-y-auto px-4 mt-16">
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col divide-y divide-gray-200">
              <li>
                <div className="py-4 px-2 text-sm font-semibold text-gray-400">{userEmail}</div>
              </li>
              {navigation.map((item) => (
                <li key={item.name} className="">
                  <Link
                    onClick={() => {
                      setSidebarOpen(false)
                    }}
                    href={item.href}
                    className={classNames('text-gray-700 text-left block w-full gap-x-3 rounded-md px-2 py-3 text-sm font-semibold'
                    )}
                  >
                    <item.icon className="inline-block h-4 w-4 mr-3" />
                    {item.name}
                  </Link>
                </li>
              ))}

              <li className="">
                <button
                  type="submit"
                  className={classNames(
                    ' text-gray-700 block w-full px-2 py-3 text-left text-sm font-semibold'
                  )}
                >
                  <ArrowRightStartOnRectangleIcon className="inline-block h-4 w-4 mr-3" />
                  Sign out
                </button>
              </li>
              <li className="mt-6 mx-2">
                <button
                  type="button"
                  className={classNames(
                    'text-gray-700 block w-full px-2 py-2 text-center text-sm font-semibold ring-1 ring-gray-200 rounded-lg'
                  )}
                >
                  Contact
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}