'use client'
import { createClient } from '@/utils/supabase/client';
import { Fragment, useState } from 'react'
import { Dialog, Transition, Menu } from '@headlessui/react'
import {
  ChartPieIcon,
  HomeIcon,
  UsersIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon,
  QuestionMarkCircleIcon,
  Cog8ToothIcon,
} from '@heroicons/react/24/outline'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/16/solid'
import Link from 'next/link';
import icon from '@/images/icon.png';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation'
import { getInitials } from '@/utils/helpers'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import useLocalStorage from '@/utils/useLocalStorage'
import { useRouter } from 'next/navigation'

const setSidebarSettings = async (isCollapsed: boolean) => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return
  }
  await supabase.from('users').update({
    is_sidebar_collapsed: isCollapsed
  }).eq('id', user.id)
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export function DesktopSidebar({ user }: { user: any }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(user.is_sidebar_collapsed)

  const userInitials = getInitials(user?.full_name)

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
    { name: 'Tenants', href: getDashboardURL('tenants'), icon: UsersIcon },
    { name: 'Settings', href: getDashboardURL('settings'), icon: Cog8ToothIcon },
    { name: 'Analytics', href: getDashboardURL('analytics'), icon: ChartPieIcon },
  ]

  return (
    <motion.div
      className={`flex grow flex-col overflow-x-hidden mt-4 min-h-full overflow-y-auto`}
      initial={{ width: isSidebarCollapsed ? 50 : 150 }}
      animate={{ width: isSidebarCollapsed ? 50 : 150 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {isSidebarCollapsed ? (
        <div onClick={() => { router.push('/dashboard') }} className="mt-6">
        <TooltipProvider delayDuration={50}>
          <Tooltip>
            <TooltipTrigger>
              <Image src={icon} alt="logo" height={28} width={28} className="mx-4" />
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Home</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        </div>
      ) : (
        <div onClick={() => { router.push('/dashboard') }} className="group mt-6 mb-1.5 flex items-center gap-x-3 text-md tracking-tight font-semibold text-gray-400 cursor-default rounded-2xl w-full ">
          <Image src={icon} alt="logo" height={28} width={28} className="ml-4" />
          <AnimatePresence>
            {!isSidebarCollapsed && (
              <motion.span
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="group-hover:text-blue-500"
              >
                Cribbly
              </motion.span>       
            )}
          </AnimatePresence>
        </div>
      )}
      <nav className="flex flex-1 flex-col mt-24">
        <ul role="list" className="gap-y-0">
          <li>
            <ul role="list" className="-mx-2 p-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name} className="">
                  {isSidebarCollapsed ? (
                  <TooltipProvider delayDuration={50}>
                    <Tooltip>
                      <Link
                        href={item.href}
                        className={classNames(
                          pathname === item.href
                            ? 'text-blue-500'
                            : 'text-gray-500 hover:text-blue-500',
                          'group flex gap-x-3 rounded-md py-2 px-4 text-sm leading-6 font-semibold cursor-default'
                        )}
                      >
                        <TooltipTrigger>
                        <item.icon
                          className={classNames(
                            pathname === item.href ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-500',
                            'h-6 w-6 shrink-0'
                          )}
                          aria-hidden="true"
                        />
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{item.name}</p>
                        </TooltipContent>
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
                    </Tooltip>
                  </TooltipProvider>
                  ) : (
                    <Link
                      href={item.href}
                      className={classNames(
                        pathname === item.href
                          ? 'text-blue-500'
                          : 'text-gray-500 hover:text-blue-500',
                        'group flex gap-x-3 rounded-md py-2 px-4 text-sm leading-6 font-semibold cursor-default'
                      )}
                    >
                      <item.icon
                        className={classNames(
                          pathname === item.href ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-500',
                          'h-6 w-6 shrink-0'
                        )}
                        aria-hidden="true"
                      />
                      <span>{item.name}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </li>
        
          <li className="fixed bottom-12 left-6 text-sm font-semibold px-6 py-3 leading-6 text-gray-800 z-50">
            <Menu as="div" className="font-medium">
              <Menu.Button>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-500 cursor-default hover:bg-gray-600">
                  <span className="text-sm font-medium leading-none text-white">{userInitials}</span>
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
                <Menu.Items className="ml-4 w-36 origin-bottom-left absolute bottom-full left-0 z-10 mt-2 divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ focus }) => (
                      <button
                        onClick={async() => {
                          await setSidebarSettings(!isSidebarCollapsed)
                          setIsSidebarCollapsed(!isSidebarCollapsed)
                        }}
                        className={classNames(
                          focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block w-full px-4 py-2 text-left text-sm cursor-default'
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
                      <Link
                        href="/dashboard/account"
                        className={classNames(
                          focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm cursor-default'
                        )}
                      >
                        <Cog6ToothIcon className="inline-block h-4 w-4 mr-2" />
                        Settings
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ focus }) => (
                      <Link
                        href="#"
                        className={classNames(
                          focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm cursor-default'
                        )}
                      >
                        <QuestionMarkCircleIcon className="inline-block h-4 w-4 mr-2" />
                        Support
                      </Link>
                    )}
                  </Menu.Item>
                  <form method="POST" action="/auth/sign-out">
                    <Menu.Item>
                      {({ focus }) => (
                        <button
                          type="submit"
                          className={classNames(
                            focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block w-full px-4 py-2 text-left text-sm cursor-default'
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