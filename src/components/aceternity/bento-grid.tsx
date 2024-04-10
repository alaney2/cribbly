import { cn } from "@/utils/cn";
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import Link from "next/link";
import { useRouter } from 'next/navigation'

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full mx-auto ",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  edit=false,
  href,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  edit?: boolean;
  href?: string;
}) => {
  const router = useRouter()
  const ItemContent = () => (
    <>
      <div className="h-full overflow-hidden">
        {header}
      </div>
      <div className="group-hover/bento:translate-x-2 transition duration-200 flex items-center">
        <div className="">
          <div className="flex items-center mb-2 mt-2">
            <div className="mr-2">{icon}</div>
            <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200">
              {title}
            </div>
          </div>
          <div className="font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300">
            {description}
          </div>
        </div>
        {edit && (
          <div className="ml-3 group-hover:opacity-100 p-2 rounded-lg block opacity-20 transition-opacity duration-200 ease-in-out">
            <PencilSquareIcon className="h-5 w-5 text-gray-500" />
          </div>
        )}
      </div>
    </>
  )
  return href ? (
    <Link
      href={href}
      className={cn(
        "row-span-1 rounded-xl group group/bento hover:shadow-xl transition duration-200 dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white ring-inset ring-1 ring-gray-200 hover:ring-0 justify-between flex flex-col space-y-4 overflow-y-auto select-none cursor-default",
        className
      )}
    >
      <ItemContent />
    </Link>
  ) : (
    <div
      className={cn(
        "row-span-1 rounded-xl group group/bento hover:shadow-xl transition duration-200 dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white ring-inset ring-1 ring-gray-200 hover:ring-0 justify-between flex flex-col space-y-4 overflow-y-auto select-none",
        className
      )}
    >
      <ItemContent />
    </div>
  );
};
