"use client"
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import useSWR from 'swr';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Link from 'next/link';
import { Button } from '@/components/catalyst/button';
import { Input } from '@/components/catalyst/input';
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '@/components/catalyst/dropdown';
import { ChevronDownIcon, MagnifyingGlassIcon, PlusIcon, CheckIcon } from '@heroicons/react/16/solid';
import Fuse from 'fuse.js';

interface Property {
  id: number;
  user_id: string;
  street_address: string;
  zip: string;
  apt: string;
  city: string;
  state: string;
  country: string;
}

const fetcher = async () => {
  const supabase = createClient();
  let { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return [];
  }
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('user_id', user.id);
  if (error) {
    throw error;
  }
  return data;
};


export function PropertiesGrid() {
  const { data: properties, error, isLoading } = useSWR('properties', fetcher);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');

  const fuse = new Fuse(properties || [], {    keys: ['street_address', 'city', 'state'],
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

  if (error) {
    toast.error('Error fetching properties');
  }

  if (!isLoading && properties?.length === 0) {
    return (
      <div className="flex flex-col h-full pb-32 items-center justify-center p-8">
        <div className="ring-2 rounded-lg p-2 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <h2 className="text-lg font-medium mb-3">Add your first property</h2>
        <Link href="/dashboard/properties">
          <Button color="blue" className="bg-blue-500 text-white px-4 py-2 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Property
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
    <div className="flex flex-col sm:flex-row items-center justify-between sm:justify-center mb-4">
      <div className="relative sm:mr-2.5 w-full sm:w-auto mb-2.5 sm:mb-0">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          name="search"
          id="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-72 md:w-96 rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-zinc-950/10 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-sm sm:text-md sm:leading-6 h-10"
          placeholder="Search Properties..."
        />
      </div>
      <div className="flex items-center justify-end w-full sm:w-auto">
        <Dropdown>
          <DropdownButton outline className="mr-2.5 h-10">
            <span className="text-sm block">
              Sort by
            </span>
            <ChevronDownIcon />
          </DropdownButton>
          <DropdownMenu className="min-w-32">
            <DropdownItem onClick={() => setSortBy('name')} className="justify-between">
              <div className="flex justify-between">
                <div className="flex text-sm">
                  Name
                </div>
                <div>
                  {sortBy === 'name' && (
                    <CheckIcon className="h-5 w-5 ml-2 text-blue-500" />
                  )}
                </div>
              </div>

            </DropdownItem>
            <DropdownItem onClick={() => setSortBy('city')}>
              <div className="flex justify-between">
                <div className="flex text-sm">
                  City
                </div>
                <div>
                  {sortBy === 'city' && (
                    <CheckIcon className="h-5 w-5 ml-2 text-blue-500" />
                  )}
                </div>
              </div>
            </DropdownItem>
            <DropdownItem onClick={() => setSortBy('state')}>
              <div className="flex justify-between">
                <div className="flex text-sm">
                  State
                </div>
                <div>
                  {sortBy === 'state' && (
                    <CheckIcon className="h-5 w-5 ml-2 text-blue-500" />
                  )}
                </div>
              </div>
            </DropdownItem>
            </DropdownMenu>
        </Dropdown>
        <Button color="blue" className="max-w-40 h-10" href="/dashboard/properties">
          <PlusIcon className="h-5 w-5 mr-2" />
          <span className="text-sm block">
            Add Property
          </span>
        </Button>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 py-4 lg:py-8 2xl:p-16">
      {isLoading ? (
        Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-lg p-4 h-30 lg:h-36 shadow-sm bg-gray-50 ring-1 ring-gray-300">
            <Skeleton height={24} width="80%" />
            <Skeleton height={18} width="60%" />
            <Skeleton height={18} width="40%" />
          </div>
        ))
      ) : (
        sortedProperties?.map((property) => (
          <div key={property.id} className="rounded-lg p-4 h-30 lg:h-36 shadow-sm bg-gray-50 ring-1 ring-gray-300">
            <h3 className="text-lg font-semibold truncate">{property.street_address}</h3>
            <p>{property.apt}</p>
            <p>{property.city}, {property.state} {property.zip}</p>
          </div>
        ))
      )}
    </div>
  </div>
  );
};
