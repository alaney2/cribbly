"use client"
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

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

async function fetchProperties(): Promise<Property[]> {
  const supabase = createClient();
  let { data: {user} } = await supabase.auth.getUser()
  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching properties:', error);
    return [];
  }

  return data;
}

export function PropertiesGrid() {
  const [properties, setProperties] = useState<Property[]>([]);
  useEffect(() => {
    fetchProperties().then((data) => {
      setProperties(data);
    });
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {properties.map((property) => (
        <div key={property.id} className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold">{property.street_address}</h3>
          <p>{property.apt}</p>
          <p>{property.city}, {property.state} {property.zip}</p>
          <p>{property.country}</p>
        </div>
      ))}
    </div>
  );
};

export default PropertiesGrid;