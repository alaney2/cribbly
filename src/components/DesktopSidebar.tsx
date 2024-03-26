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
  QuestionMarkCircleIcon
  // ChevronLeftIcon,
  // ChevronRightIcon,
} from '@heroicons/react/24/outline'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/16/solid'
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation'


function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, current: true },
  { name: 'Team', href: '/', icon: UsersIcon, current: false },
  { name: 'Properties', href: '/dashboard/properties', icon: FolderIcon, current: false },
  { name: 'Calendar', href: '/', icon: CalendarIcon, current: false },
  { name: 'Documents', href: '/', icon: DocumentDuplicateIcon, current: false },
  { name: 'Reports', href: '', icon: ChartPieIcon, current: false },
]
const teams = [
  { id: 1, name: 'Heroicons', href: '/', initial: 'H', current: false },
  { id: 2, name: 'Tailwind Labs', href: '/', initial: 'T', current: false },
  { id: 3, name: 'Workcation', href: '/', initial: 'W', current: false },
]

export function DesktopSidebar() {
  const pathname = usePathname()
  const [currentNavItem, setCurrentNavItem] = useState('Dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <motion.div
      className={`flex grow flex-col gap-y-5 overflow-hidden px-6 pb-2 min-h-full mt-24 overflow-y-auto`}
      initial={{ width: 196 }}
      animate={{ width: isSidebarCollapsed ? 64 : 196 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* <div className="flex h-8 mt-16 shrink-0 items-center"> */}
        {/* <Logo /> */}
        {/* <Logo className="mx-0 h-8 w-auto"/> */}
        {/* <button
          className="p-1 rounded-md bg-gray-200 hover:bg-gray-300 focus:outline-none transition duration-200 ease-in-out ml-auto"
          onClick={toggleSidebar}
        >
          {isSidebarCollapsed ? (
            <ChevronRightIcon className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
          )}
        </button> */}
      {/* </div> */}
      
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
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
                      pathname === item.href ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600',
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
                      team.name === currentNavItem
                        ? ' text-blue-600'
                        : 'text-gray-700 hover:text-blue-600 ',
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                    )}
                    onClick={() => setCurrentNavItem(team.name)}
                  >
                    <span
                      className={classNames(
                        team.name === currentNavItem
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
          
          <li className="fixed bottom-10 left-8 mx-auto text-sm font-semibold gap-x-4 px-6 py-3 leading-6 text-gray-900">
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
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </form>
                  <Menu.Item>
                    {({ focus }) => (
                      <a
                        href="#"
                        className={classNames(
                          focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm'
                        )}
                      >
                        Support
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
                        Account settings
                      </a>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </li>
        </ul>
      </nav>
      
    </motion.div>
  )
}
