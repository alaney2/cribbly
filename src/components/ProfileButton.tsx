import { Fragment } from 'react'
import { Transition, Menu } from '@headlessui/react'
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
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export function ProfileButton() {
  return (
    <Menu as="div" className="font-medium">
      <Menu.Button>
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-500">
          <span className="text-sm font-medium leading-none text-white">TC</span>
        </span>
        <span className="sr-only">Your profile</span>
        {/* <span aria-hidden="true" className='p-2'>Profile</span> */}
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
        <Menu.Items className="w-40 right-6 origin-top-right absolute z-10 mt-2 divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
  )
}