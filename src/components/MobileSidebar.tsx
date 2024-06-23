'use client'
import { Fragment, useState, useEffect } from 'react'
import {
  CalendarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  HomeIcon,
  UsersIcon,
  WrenchIcon,
  Cog8ToothIcon,
} from '@heroicons/react/24/outline'
import {
  IconWavesElectricity,
  IconSignature,
  IconVariableMinus,
} from "@tabler/icons-react";
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import { ProfileButton } from '@/components/ProfileButton'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

type MobileSidebarProps = {
  userEmail: string | undefined
  fullName: string | undefined | null
}

export function MobileSidebar({ userEmail, fullName }: MobileSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add("overflow-y-hidden")
      document.body.classList.add("fixed")
    } else {
      document.body.classList.remove("overflow-y-hidden")
      document.body.classList.remove("fixed")
    }
  }, [sidebarOpen]);

  const getDashboardURL = (href: string = '') => {
    const match = pathname.match(/\/dashboard\/([^/]+)/);
    const propertyId = match ? match[1] : '';
    let url = `/dashboard/${propertyId}`
    if (href !== '') {
      url += `/${href}`
    }
    return url
  }

  const navigation = [
    { name: 'Analytics', href: getDashboardURL(), icon: ChartPieIcon },
    { name: 'Tenants', href: getDashboardURL('tenants'), icon: UsersIcon },
    // { name: 'Analytics', href: getDashboardURL('analytics'), icon: ChartPieIcon },
    { name: 'Maintenance', href: getDashboardURL('maintenance'), icon: WrenchIcon },
    { name: 'Utilities', href: getDashboardURL('utilities'), icon: IconWavesElectricity },
    { name: 'Documents', href: getDashboardURL('documents'), icon: IconSignature },
    { name: 'Settings', href: getDashboardURL('settings'), icon: Cog8ToothIcon },
    { name: 'Delete', href: getDashboardURL('delete-property'), icon: IconVariableMinus },
  ]

  return (
    <>
      <div className="top-0 z-50 flex justify-center items-center gap-x-6 bg-gray-50 px-4 py-4 shadow-sm sm:px-6 lg:hidden w-screen">
        <button
          type="button"
          className={`absolute left-2.5 p-2.5 text-gray-700 lg:hidden z-50 ${sidebarOpen ? 'openmenu' : ''}`}
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
        <Link href="/dashboard" className='' 
          onClick={() => {
            setSidebarOpen(false)
            document.body.classList.remove("overflow-y-hidden")
            document.body.classList.remove("fixed")
          }}
        >
          <div className="text-md font-medium font-lexend text-gray-700 tracking-tight">
            <span className={`text-gray-600`}>Crib</span>
            <span className={`text-blue-500`}>bly</span>
          </div>
        </Link>
        <ProfileButton userEmail={userEmail} fullName={fullName} />
      </div>
      <div className={`fixed inset-0 flex lg:hidden z-40 ${sidebarOpen ? 'fixed w-full h-lvh translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out bg-gray-50`}>
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
                      pathname === item.href
                            ? 'text-blue-500'
                            : 'text-gray-500 hover:text-blue-500',
                      'w-full gap-x-3 rounded-md px-2 py-3 text-md font-semibold flex items-center'
                    )}
                  >
                    <item.icon
                      className={classNames(
                        pathname === item.href
                            ? 'text-blue-500'
                            : 'text-gray-500 group-hover:text-blue-500',
                        'inline-block h-5 w-5 mr-1.5'
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