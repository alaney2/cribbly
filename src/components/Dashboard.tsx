/* eslint-disable @next/next/no-img-element */
'use client'
import { BellIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { useState } from 'react';

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

import { Logo } from '@/components/Logo'

const navigation = [
  { name: 'Dashboard', href: '#', icon: HomeIcon, current: true },
  { name: 'Team', href: '#', icon: UsersIcon, current: false },
  { name: 'Projects', href: '#', icon: FolderIcon, current: false },
  { name: 'Calendar', href: '#', icon: CalendarIcon, current: false },
  { name: 'Documents', href: '#', icon: DocumentDuplicateIcon, current: false },
  { name: 'Analytics', href: '#', icon: ChartPieIcon, current: false },
]

const teams = [
  { id: 1, name: 'Heroicons', href: '#', initial: 'H', current: false },
  { id: 2, name: 'Tailwind Labs', href: '#', initial: 'T', current: false },
  { id: 3, name: 'Workcation', href: '#', initial: 'W', current: false },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
export function Dashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-full flex-col bg-gray-100">
      <div className={`absolute top-16 left-16 z-50 lg:hidden ${isSidebarOpen ? 'hidden' : 'block'}`}>
        <Bars3Icon 
          className="h-6 w-6 text-gray-500" 
          aria-hidden="true"
          onClick={() => setSidebarOpen(true)} 
        />
      </div>
      <div className={`absolute top-16 left-16 z-50 lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}>
        <XMarkIcon 
          className="h-6 w-6 text-gray-500" 
          aria-hidden="true"
          onClick={() => setSidebarOpen(false)} 
        />
      </div>
      <div className="mx-auto flex w-full h-full items-start gap-x-8 px-4 p-8 sm:px-6 lg:px-8 lg:mt-8">
        <aside className={`lg:sticky top-16 left-4 flex flex-col mt-2 gap-y-5 overflow-y-auto absolute ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>{/* Left column area */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-2">
            <div className="flex h-16 shrink-0 items-center">
              {/* <Logo className="h-10 w-auto" /> */}
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt="Your Company"
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={classNames(
                            item.current
                              ? ' text-indigo-600'
                              : 'text-gray-700 hover:text-indigo-600 ',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                          )}
                        >
                          <item.icon
                            className={classNames(
                              item.current ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600',
                              'h-6 w-6 shrink-0'
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                  <div className="text-xs font-semibold leading-6 text-gray-400">Your teams</div>
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {teams.map((team) => (
                      <li key={team.name}>
                        <a
                          href={team.href}
                          className={classNames(
                            team.current
                              ? ' text-indigo-600'
                              : 'text-gray-700 hover:text-indigo-600 ',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                          )}
                        >
                          <span
                            className={classNames(
                              team.current
                                ? 'text-indigo-600 border-indigo-600'
                                : 'text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600',
                              'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'
                            )}
                          >
                            {team.initial}
                          </span>
                          <span className="truncate">{team.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="-mx-6 mt-auto">
                  <a
                    href="#"
                    className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
                  >
                    <img
                      className="h-8 w-8 rounded-full bg-gray-50"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                    <span className="sr-only">Your profile</span>
                    <span aria-hidden="true">Tom Cook</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </aside>

        <main className="flex-1 bg-white h-full rounded-3xl shadow-md lg:mr-8">{/* Main area */}
          {/* <div>Hello</div> */}
        </main>
      </div>
    </div>
  )
}
