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

const navigation = [
  { name: 'All properties', href: '/dashboard', icon: HomeIcon, current: true },
  { name: 'Team', href: '/', icon: UsersIcon, current: false },
  { name: 'Properties', href: '/dashboard/properties', icon: FolderIcon, current: false },
  { name: 'Calendar', href: '/', icon: CalendarIcon, current: false },
  { name: 'Documents', href: '/', icon: DocumentDuplicateIcon, current: false },
  { name: 'Reports', href: '', icon: ChartPieIcon, current: false },
]
// const teams = [
//   { id: 1, name: 'Heroicons', href: '/', initial: 'H', current: false },
//   { id: 2, name: 'Tailwind Labs', href: '/', initial: 'T', current: false },
//   { id: 3, name: 'Workcation', href: '/', initial: 'W', current: false },
// ]


export function MobileSidebar({ user }: { user: any }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

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
        <div className="flex-1 text-md font-semibold text-gray-700">Cribbly</div>
        <ProfileButton user={user} />
      </div>

      <div className={`fixed inset-0 flex lg:hidden mt-16 z-40 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="flex grow flex-col overflow-y-auto bg-gray-100 px-4">
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={classNames(
                          pathname === item.href
                            ? 'text-blue-600'
                            : 'text-gray-700 hover:text-blue-600',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                        )}
                      >
                        <item.icon
                          className={classNames(
                            pathname === item.href
                              ? 'text-blue-600'
                              : 'text-gray-400 group-hover:text-blue-600',
                            'h-6 w-6 shrink-0'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
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