

const formClasses =
  'block w-full appearance-none rounded-md border-1 border-gray-200 bg-white px-3 py-1.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-blue-500 sm:text-sm ring-1 ring-inset ring-gray-300'

export function InputName() {
  return (
    <>
      <div className='w-64 flex flex-col items-center justify-center h-full mx-auto'>
        <label htmlFor="name" className="sr-only">
          Full name
        </label>
        <input
          type="name"
          name="name"
          id="name"
          className={formClasses}
          placeholder="Full name"
        />
      </div>
    </>
  )
}