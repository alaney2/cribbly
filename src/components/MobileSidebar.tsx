'use client'
import { Fragment, useState, useEffect } from 'react'
import {
  CalendarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  HomeIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import { ProfileButton } from '@/components/ProfileButton'


function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export function MobileSidebar({ user }: { user: any }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add("overflow-y-hidden")
    } else {
      document.body.classList.remove("overflow-y-hidden")
    }
  }, [sidebarOpen]);

  const getDashboardURL = (href: string = '') => {
    const match = pathname.match(/\/dashboard\/properties\/([^/]+)/);
    const propertyId = match ? match[1] : '';
    let url = `/dashboard/properties/${propertyId}`
    if (href !== '') {
      url += `/${href}`
    }
    return url
  }

  const navigation = [
    { name: 'Dashboard', href: getDashboardURL(), icon: HomeIcon },
    { name: 'Tenants', href: '/', icon: UsersIcon },
    { name: 'Settings', href: getDashboardURL('settings'), icon: Cog6ToothIcon },
    { name: 'Analytics', href: '', icon: ChartPieIcon },
  ]

  return (
    <>
      <div className="sticky top-0 z-50 flex items-center gap-x-6 bg-gray-50 px-4 py-4 shadow-sm sm:px-6 lg:hidden h-16">
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
        <Link href="/dashboard" className='flex-1'>
          <div className="text-md font-semibold text-gray-700">Cribbly</div>
        </Link>
        <ProfileButton user={user} />
      </div>
      <div className={`fixed inset-0 flex lg:hidden z-40 ${sidebarOpen ? 'fixed w-full h-full translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out bg-gray-50`}>
        <div className="flex grow flex-col overflow-y-auto px-4 mt-16">
          <nav className="flex flex-1 flex-col ">
            <ul role="list" className="flex flex-1 flex-col divide-y divide-gray-200">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    onClick={() => {
                      setSidebarOpen(false)
                    }}
                    href={item.href}
                    className={classNames(
                      'text-gray-700 hover:text-blue-600',
                      'block w-full gap-x-3 rounded-md px-2 py-3 text-sm font-semibold'
                    )}
                  >
                    <item.icon
                      className={classNames(
                        'text-gray-400 group-hover:text-blue-600',
                        'inline-block h-4 w-4 mr-3'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}