'use client'
import { Fragment, useState } from 'react'
import { Dialog, Transition, Menu } from '@headlessui/react'
import {
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/16/solid'
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation'
import { getURL } from './../utils/helpers';


function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard/properties', icon: HomeIcon },
  { name: 'Team', href: '/', icon: UsersIcon },
  { name: 'Properties', href: '/dashboard/properties', icon: FolderIcon },
  { name: 'Calendar', href: '/', icon: CalendarIcon },
  { name: 'Documents', href: '/', icon: DocumentDuplicateIcon },
  { name: 'Reports', href: '', icon: ChartPieIcon },
]

const teams = [
  { id: 1, name: 'Heroicons', href: '/', initial: 'H' },
  { id: 2, name: 'Tailwind Labs', href: '/', initial: 'T' },
  { id: 3, name: 'Workcation', href: '/', initial: 'W' },
]

export function DesktopSidebar() {
  const pathname = usePathname()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const getDashboardURL = (href: string = '') => {
    const match = pathname.match(/\/dashboard\/properties\/([^/]+)/);
    const propertyId = match ? match[1] : '';
    return `/dashboard/properties/${propertyId}/${href}`
  }

  return (
    <motion.div
      className={`flex grow flex-col gap-y-5 overflow-hidden px-6 pb-2 min-h-full mt-24 overflow-y-auto`}
      initial={{ width: 196 }}
      animate={{ width: isSidebarCollapsed ? 64 : 196 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={getDashboardURL()}
                    className={classNames(
                      pathname === item.href
                        ? 'text-blue-500'
                        : 'text-gray-500 hover:text-blue-500',
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                    )}
                  >
                    <item.icon
                      className={classNames(
                        pathname === item.href ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-500',
                        'h-6 w-6 shrink-0'
                      )}
                      aria-hidden="true"
                    />
                    <AnimatePresence>
                      {!isSidebarCollapsed && (
                        <motion.span
                          initial={{ opacity: 1 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li>
            <div className={`text-xs font-semibold leading-6 text-gray-400 whitespace-nowrap ${isSidebarCollapsed ? 'hidden' : ''}`}>
              Your teams
            </div>
            <ul role="list" className="flex flex-1 flex-col -mx-2 mt-2 space-y-1">
              {teams.map((team) => (
                <li key={team.name}>
                  <Link
                    href={team.href}
                    className={classNames(
                      team.href === pathname
                        ? ' text-blue-600'
                        : 'text-gray-700 hover:text-blue-600 ',
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
                    <AnimatePresence>
                      {!isSidebarCollapsed && (
                        <motion.span
                          initial={{ opacity: 1 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="truncate"
                        >
                          {team.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li className="fixed bottom-10 left-8 text-sm font-semibold gap-x-4 px-6 py-3 leading-6 text-gray-900">
            <Menu as="div" className="font-medium">
              <Menu.Button>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-500">
                  <span className="text-sm font-medium leading-none text-white">TC</span>
                </span>
                <span className="sr-only">Your profile</span>
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="ml-4 w-40 origin-bottom-left absolute bottom-full left-0 z-10 mt-2 divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ focus }) => (
                      <button
                        onClick={toggleSidebar}
                        className={classNames(
                          focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block w-full px-4 py-2 text-left text-sm'
                        )}
                      >
                        {isSidebarCollapsed ? (
                          <>
                            <ChevronRightIcon className="inline-block h-4 w-4 mr-2" />
                            Expand
                          </>
                        ) : (
                          <>
                            <ChevronLeftIcon className="inline-block h-4 w-4 mr-2" />
                            Shrink
                          </>
                        )}
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ focus }) => (
                      <a
                        href="#"
                        className={classNames(
                          focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm'
                        )}
                      >
                        <Cog6ToothIcon className="inline-block h-4 w-4 mr-2" />
                        Settings
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ focus }) => (
                      <a
                        href="#"
                        className={classNames(
                          focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm'
                        )}
                      >
                        <QuestionMarkCircleIcon className="inline-block h-4 w-4 mr-2" />
                        Support
                      </a>
                    )}
                  </Menu.Item>
                  <form method="POST" action="/auth/sign-out">
                    <Menu.Item>
                      {({ focus }) => (
                        <button
                          type="submit"
                          className={classNames(
                            focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block w-full px-4 py-2 text-left text-sm'
                          )}
                        >
                          <ArrowRightStartOnRectangleIcon className="inline-block h-4 w-4 mr-2" />
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </form>
                </Menu.Items>
              </Transition>
            </Menu>
          </li>
        </ul>
      </nav>
    </motion.div>
  )
}