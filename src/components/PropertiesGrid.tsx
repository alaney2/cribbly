"use client"
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import useSWR from 'swr';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Link from 'next/link';
import { Button } from '@/components/catalyst/button';

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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-8">
      {isLoading ? (
        Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-lg p-4 h-36 shadow-sm bg-gray-50 ring-1 ring-gray-300">
            <Skeleton height={24} width="80%" />
            <Skeleton height={18} width="60%" />
            <Skeleton height={18} width="40%" />
          </div>
        ))
      ) : (
        properties?.map((property) => (
          <div key={property.id} className="rounded-lg p-4 h-36 shadow-sm bg-gray-50 ring-1 ring-gray-300">
            <h3 className="text-lg font-semibold">{property.street_address}</h3>
            <p>{property.apt}</p>
            <p>{property.city}, {property.state} {property.zip}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default PropertiesGrid;