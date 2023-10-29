"use client"
import clsx from 'clsx'
import { useId } from 'react'
import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

const formClasses =
  'block w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-blue-500 sm:text-sm'

function Label({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={id}
      className="mb-3 block text-sm font-medium text-gray-700"
    >
      {children}
    </label>
  )
}

export function TextField({
  label,
  type = 'text',
  className,
  ...props
}: Omit<React.ComponentPropsWithoutRef<'input'>, 'id'> & { label: string }) {
  let id = useId()

  return (
    <div className={className}>
      {label && <Label id={id}>{label}</Label>}
      <input id={id} type={type} {...props} className={formClasses} />
    </div>
  )
}

export function SelectField({
  label,
  className,
  optional,
  ...props
}: Omit<React.ComponentPropsWithoutRef<'select'>, 'id'> & { label: string; optional?: boolean }) {
  let id = useId()

  return (
    <div className={className}>
      <div className="flex justify-between">
        {label && <Label id={id}>{label}</Label>}
        {optional && (
          <span className="text-sm leading-6 text-gray-500" id="email-optional">
            Optional
          </span>
        )}
      </div>

      <select id={id} {...props} className={clsx(formClasses, 'pr-8')} />
    </div>
  )
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export function SelectFieldNew({
  label,
  className,
  optional,
  options,
  ...props}: Omit<React.ComponentPropsWithoutRef<'select'>, 'id'> & { label: string; optional?: boolean; options: string[] }) {
  const [selected, setSelected] = useState(options[0])
  let id = useId()

  return (
    <div className={className}>
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <div className="flex justify-between">
            <Label id={id} >{label}</Label>
            {optional && (
              <span className="text-sm leading-6 text-gray-500" id="email-optional">
                Optional
              </span>
            )}
          </div>

          <div className="relative">
            <Listbox.Button className={clsx(formClasses, 'cursor-default flex justify-between focus:ring-1')}>
              <span className="block truncate">{selected}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {options.map((option) => (
                  <Listbox.Option
                    key={option}
                    className={({ active }) =>
                      classNames(
                        active ? 'bg-blue-600 text-white' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-8 pr-4'
                      )
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                          {option}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-indigo-600',
                              'absolute inset-y-0 left-0 flex items-center pl-1.5'
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
    </div>
  )
}
