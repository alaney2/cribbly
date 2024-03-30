'use client'
import { Fragment, useState } from 'react'
import { Dialog, Transition, Menu } from '@headlessui/react'
import {
  Bars3Icon,
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { usePathname } from 'next/navigation'
import { ProfileButton } from '@/components/ProfileButton'


function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export function MobileSidebar({ user }: { user: any }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

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
    { name: 'Team', href: '/', icon: UsersIcon },
    { name: 'Calendar', href: '/', icon: CalendarIcon },
    { name: 'Documents', href: '/', icon: DocumentDuplicateIcon },
    { name: 'Reports', href: '', icon: ChartPieIcon },
  ]

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
        <Link href="/dashboard" className='flex-1'>
          <div className="text-md font-semibold text-gray-700">Cribbly</div>
        </Link>
        <ProfileButton user={user} />
      </div>

      <div className={`fixed inset-0 flex lg:hidden mt-16 z-40 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="flex grow flex-col overflow-y-auto bg-gray-100 px-4">
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col divide-y divide-gray-200">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={classNames(
                      pathname === item.href
                        ? 'text-blue-600'
                        : 'text-gray-700 hover:text-blue-600',
                      'block w-full gap-x-3 rounded-md px-2 py-3 text-sm font-semibold'
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon
                      className={classNames(
                        pathname === item.href
                          ? 'text-blue-600'
                          : 'text-gray-400 group-hover:text-blue-600',
                        'inline-block h-4 w-4 mr-3'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                </li>
              ))}

              {/* <li>
                <div className="text-xs font-semibold leading-6 text-gray-400">Your teams</div>
                <ul role="list" className="mt-2 space-y-1">
                  {teams.map((team) => (
                    <li key={team.name}>
                      <Link
                        href={team.href}
                        className={classNames(
                          team.href === pathname
                            ? 'text-blue-600'
                            : 'text-gray-700 hover:text-blue-600',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                        )}
                      >
                        <span
                          className={classNames(
                            team.href === pathname
                              ? 'text-blue-600 border-blue-600'
                              : 'text-gray-400 border-gray-200 group-hover:border-blue-600 group-hover:text-blue-600',
                            'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'
                          )}
                        >
                          {team.initial}
                        </span>
                        <span className="truncate">{team.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li> */}
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}