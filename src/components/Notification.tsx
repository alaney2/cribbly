"use client"
import { Fragment, useState, useEffect } from 'react'
import { Transition } from '@headlessui/react'
import { XCircleIcon, ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { useSearchParams, usePathname } from 'next/navigation'


export function Notification() {
  const pathname = usePathname()

  const [show, setShow] = useState(false)
  const [isHovering, setIsHovering] = useState(false);

  const [notification, setNotification] = useState({ type: '', message: '' })

  const searchParams = useSearchParams()
 
  const success = searchParams.get('success')
  const error = searchParams.get('error')

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if ((success || error) && !isHovering) {
      const messageType = success ? 'success' : 'error';
      const messageContent = success || error;

      setNotification({ type: messageType, message: messageContent! });
      setShow(true);
      window.history.pushState({}, document.title, pathname);

      timer = setTimeout(() => {
        setShow(false);
      }, 5000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [success, error, pathname, isHovering]);

  return (
    <>
      {/* Global notification live region, render this permanently at the end of the document */}
      <div
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-50"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition
            show={show}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-300"
            leaveFrom="translate-y-0 opacity-100 sm:translate-x-0"
            leaveTo="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          >
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-md ring-1 ring-black ring-opacity-5">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                  {notification.type === 'error' ?
                      <ExclamationCircleIcon className="h-6 w-6 text-red-400" aria-hidden="true" /> :
                      <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />}
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-gray-900 cursor-default">{notification.type === 'error' ? 'Error' : 'Success!'}</p>
                    <p className="mt-1 text-sm text-gray-500 cursor-default">{notification.message}</p>
                  </div>
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      type="button"
                      className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => {
                        setShow(false)
                      }}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  )
}
