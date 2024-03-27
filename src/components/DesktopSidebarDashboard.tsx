'use client'
import {
  HomeIcon,
  ArrowRightStartOnRectangleIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const navigation = [
  { name: 'All properties', href: '/dashboard', icon: HomeIcon },
]

const account = [
  { id: 1, name: 'Settings', href: '/dashboard/settings' },
]

export function DesktopSidebarDashboard() {
  const pathname = usePathname()

  return (
    <motion.div
      className={`flex grow flex-col gap-y-5 overflow-hidden pb-4 min-h-full mt-24 overflow-y-auto`}
      initial={{ width: 196 }}
    >
      <nav className="flex flex-1 flex-col text-sm tracking-normal">
        <ul role="list" className="">
          <div className="p-4 border-b border-slate-300">
            <div className={`font-medium text-gray-400 whitespace-nowrap`}>Properties</div>
            {/* <div className="text-xs font-semibold leading-6 text-gray-400">Properties</div> */}

            <li>
              <ul role="list" className="-mx-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={classNames(
                        pathname === item.href
                          ? 'text-blue-500'
                          : 'text-gray-500 hover:text-blue-500',
                        'group flex gap-x-3 rounded-md p-2 font-semibold'
                      )}
                    >
                      <span>
                        {item.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </div>

          <li>
            <div className="p-4 border-b border-slate-300">
              <div className={`font-medium text-gray-400 whitespace-nowrap`}>
                Account
              </div>
              <ul role="list" className="flex flex-1 flex-col -mx-2">
                {account.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={classNames(
                        item.href === pathname
                          ? 'text-blue-500'
                          : 'text-gray-500 hover:text-blue-600',
                        'group flex gap-x-3 rounded-md p-2 font-semibold'
                      )}
                    >
                      <span className="truncate">
                        {item.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
 
          <div className="p-4 border-b border-slate-300">
            <a
              href="/dashboard/support"
              className={classNames(
                pathname === '/dashboard/support'
                  ? 'text-blue-500'
                  : 'text-gray-500 hover:text-blue-500',
                'group flex items-center gap-x-3 rounded-md font-semibold'
              )}
            >
              <QuestionMarkCircleIcon className="h-4 w-4" />
              <span>Support</span>
            </a>
          </div>

          <div className="p-4 border-slate-300">
            <form method="POST" action="/auth/sign-out">
              <button
                type="submit"
                className={classNames(
                  'text-gray-500 hover:text-blue-500',
                  'group flex items-center gap-x-3 rounded-md font-semibold'
                )}
              >
                <ArrowRightStartOnRectangleIcon className="h-4 w-4" />
                <span>Sign out</span>
              </button>
            </form>
          </div>

        </ul>
      </nav>
    </motion.div>
  )
}
