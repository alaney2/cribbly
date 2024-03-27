'use client'
import { useState } from 'react'
import {
  HomeIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link';
import { ProfileButton } from '@/components/ProfileButton'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
const navigation = [
  { name: 'All properties', href: '/dashboard', icon: HomeIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
  { name: 'Support', href: '/', icon: QuestionMarkCircleIcon },
]
export function MobileSidebarDashboard(user: any) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const userEmail = user.user.email;

  return (
    <>
      <div className="sticky top-0 z-50 flex items-center gap-x-6 bg-gray-100 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <button
          type="button"
          className={`-m-2.5 p-2.5 text-gray-700 lg:hidden z-50 ${sidebarOpen ? 'openmenu' : ''}`}
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
        <div className="flex-1 text-md font-semibold text-gray-700 ">Cribbly</div>
        {/* <ProfileButton /> */}
      </div>
      <div className={`fixed inset-0 flex lg:hidden mt-16 z-40 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="flex grow flex-col overflow-y-auto bg-gray-100 px-4">
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col divide-y divide-gray-200">
              <li>
                <div className="py-4 px-2 text-sm font-semibold text-gray-400">{userEmail}</div>
              </li>
              {navigation.map((item) => (
                <li key={item.name} className="">
                  <Link
                    href={item.href}
                    className={classNames('text-gray-700 block w-full gap-x-3 rounded-md px-2 py-3 text-sm font-semibold'
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