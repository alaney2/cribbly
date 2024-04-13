import { Fragment } from 'react'
import { Transition, Menu } from '@headlessui/react'
import {
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline'
import { getInitials } from '@/utils/helpers';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export function ProfileButton({ user }: { user: any }) {
  const initials = getInitials(user?.full_name)

  return (
    <Menu as="div" className="font-medium fixed right-5">
      <Menu.Button>
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-500">
          <span className="text-xs font-medium leading-none text-white">{initials}</span>
        </span>
        <span className="sr-only">Your profile</span>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-100"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-100"
      >
        <Menu.Items className="w-48 right-0 origin-top-right absolute z-10 mt-2 divide-y divide-gray-100 text-gray-700 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-4 py-3">
            <p className="text-sm">Signed in as</p>
            <p className="truncate text-sm font-medium ">{user.email}</p>
          </div>
          <Menu.Item>
            {({ focus }) => (
              <a
                href="/dashboard/account"
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
  )
}