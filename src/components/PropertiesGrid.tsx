"use client"
import { useRef, useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import useSWR from 'swr';
import { toast } from 'sonner'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Button } from '@/components/catalyst/button';
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '../../dropdown';
import { ChevronDownIcon, MagnifyingGlassIcon, PlusIcon, CheckCircleIcon, XCircleIcon, EllipsisVerticalIcon } from '@heroicons/react/16/solid';
import Fuse from 'fuse.js';
import { Input } from '@/components/aceternity/Input'
import Link from 'next/link';
import { Spinner } from '@/components/Spinners/Spinner'
import useSparks from '@/components/default/useSparks'
import { useRouter } from 'next/navigation'
import Confetti from 'react-confetti'
import useWindowSize from 'react-use/lib/useWindowSize'
import { useLocalStorage } from 'react-use';

const fetcher = async () => {
  const supabase = createClient();
  let { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    toast.error("User not found")
    return
  }
  const { data, error } = await supabase
    .from('properties')
    .select(`*, tenants(*)`)
    .eq('user_id', user!.id);
  if (error) {
    throw error;
  }
  return data;
};

export function PropertiesGrid() {
  const { data: properties, error, isLoading } = useSWR('properties', fetcher);
  const { makeBurst, sparks } = useSparks();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [addPropertyClicked, setAddPropertyClicked] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { width, height } = useWindowSize()
  const [showConfetti, setShowConfetti] = useState(false);
  const [value, setValue, remove] = useLocalStorage('welcomeConfettiShown');
  useEffect(() => {
    if (!value) {
      setShowConfetti(true);
      setValue(true);
    }
  }, [setValue, value])

  const fuse = new Fuse(properties || [], { keys: ['street_address', 'city', 'state'],
    threshold: 0.4,
  });

  const filteredProperties = searchQuery
    ? fuse.search(searchQuery).map((result) => result.item)
    : properties;

  const sortedProperties = filteredProperties?.sort((a, b) => {
    if (sortBy === 'name') {
      return a.street_address.localeCompare(b.street_address);
    } else if (sortBy === 'city') {
      return a.city.localeCompare(b.city);
    } else if (sortBy === 'state') {
      return a.state.localeCompare(b.state)
    }
    return 0;
  });

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setAddPropertyClicked(true)
    if (!containerRef.current) return;
  
    const clickX = e.pageX - window.scrollX;
    const clickY = e.pageY - window.scrollY;
  
    makeBurst({ x: clickX, y: clickY });
    setTimeout(() => router.push('/dashboard/add-property'), 150);
  };

  return (
    <div ref={containerRef} className="p-2 md:p-8 content-container">
      {showConfetti && width && height && isFinite(width) && isFinite(height) && <Confetti
        width={width}
        height={height}
        gravity={0.3}
        recycle={false}
        numberOfPieces={600}
        initialVelocityY={20}
        initialVelocityX={10}
        opacity={0.8}
      />}
      <Spinner />
      <div className="flex flex-col sm:flex-row items-center justify-between sm:justify-center mb-4">
        <div className="relative sm:mr-2.5 w-full sm:w-auto mb-2.5 sm:mb-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <Input 
            id="search"
            placeholder="Search Properties..." 
            type="text"
            autoComplete='off'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-72 text-base md:text-sm md:w-96 border border-gray-200 py-1.5 pl-10 placeholder:text-gray-400 focus:ring-2 bg-gray-50 focus:ring-blue-500/90"
          />
        </div>
        <div  className="flex items-center justify-end w-full sm:w-auto">
          <Dropdown>
            <DropdownButton outline className="mr-2.5 h-10 bg-gray-50">
              <span className="text-sm block">
                Sort by
              </span>
              <ChevronDownIcon />
            </DropdownButton>
            <DropdownMenu className="min-w-32">
              <DropdownItem onClick={() => setSortBy('name')}>
                <div className={`text-sm ${sortBy === 'name' && 'font-semibold'}`}>
                  Address
                </div>
              </DropdownItem>
              <DropdownItem onClick={() => setSortBy('city')}>
                <div className={`text-sm ${sortBy === 'city' && 'font-semibold'}`}>
                  City
                </div>
              </DropdownItem>
              <DropdownItem onClick={() => setSortBy('state')}>
                <div className={`text-sm ${sortBy === 'state' && 'font-semibold'}`}>
                  State
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Button color={addPropertyClicked ? 'lightblue' : 'blue'} 
            className="w-40 h-10 cursor-default" onClick={handleClick}
          >
            <div className="">
            {addPropertyClicked ? (
              <Spinner />
            )
            : (
              <div className="flex">
                <PlusIcon className="h-5 w-5 mr-2" />
                <span className="text-sm block text-center "> Add Property </span>
              </div>
            )}
            </div>
          </Button>
          {sparks.map(spark => (
              <div
                key={spark.id}
                className="absolute w-6 h-2 rounded-sm bg-purple-400/80 z-50 transform-none"
                style={{
                  left: `${spark.center.x}px`,
                  top: `${spark.center.y}px`,
                  animation: `${spark.aniName} 500ms ease-in-out both`
                }}
              />
            ))}
        </div>
      </div>
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-4 pb-2 lg:pt-8 2xl:p-16 justify-items-center">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="rounded-lg p-4 h-28 lg:h-36 shadow-sm bg-gray-50 ring-1 ring-gray-300 w-full max-w-md">
                <Skeleton height={24} width="80%" />
                <Skeleton height={18} width="60%" />
                <Skeleton height={18} width="40%" />
              </div>
            ))
          ) : properties?.length === 0 ? (
          <div className="flex col-span-3 mt-8 flex-col h-full items-center justify-center p-8">
            <div className="ring-2 rounded-lg p-2 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 sm:h-8 w-6 sm:w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h2 className="text-sm sm:text-lg font-medium">Add your first property</h2>
          </div>
        ) : (
          sortedProperties?.map((property, index) => (
            <div key={property.id} 
              className={`rounded-lg p-4 ${property.apt ? 'h-32' : 'h-28'} md:h-32 lg:h-36 shadow-sm bg-gray-50 ring-1 ring-gray-300 w-full max-w-md relative transition ease-in-out duration-200 hover:ring-2 hover:ring-blue-300`}
            >
              <div className="absolute top-3 right-3">
                <Dropdown>
                  <DropdownButton plain className="h-7 w-6 p-0 bg-transparent transition ease-in-out duration-200">
                    <EllipsisVerticalIcon className="h-5 w-5" />
                  </DropdownButton>
                  <DropdownMenu>
                    <DropdownItem href={`/dashboard/${property.id}/settings`}>
                      Settings
                    </DropdownItem>
                    <DropdownItem href={`/dashboard/${property.id}`}>
                      Tenants
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
              <Link 
                href={{
                  pathname: `/dashboard/${property.id}`,
                }}
                className="block w-full h-full cursor-default transition duration-200 ease-in-out">
                <h3 className="text-md font-semibold truncate">{property.street_address}</h3>
                <p>{property.apt}</p>
                <p>{property.city}, {property.state} {property.zip}</p>
                <div className="absolute bottom-4 left-4 flex items-center gap-x-1">
                  {property.tenants.length > 0 ? 
                    <>
                      <CheckCircleIcon className="h-4 w-4 text-blue-500" />
                      <span className="text-gray-700 tracking-tight text-sm">{property.tenants.length} {property.tenants.length === 1 ? 'tenant' : 'tenants'}</span>
                    </> : 
                    <>
                      <XCircleIcon className="h-4 w-4 text-red-400/80" />
                      <span className="text-gray-700 tracking-tight text-sm">No tenants</span>
                    </>
                }
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
  );
};
