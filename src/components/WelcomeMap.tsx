"use client"
import { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { Text } from '@/components/catalyst/text';
import 'animate.css';

export function WelcomeMap() {
  const token = process.env.NEXT_PUBLIC_MAPBOX_KEY!
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    mapboxgl.accessToken = token

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/alan3y2/clq361ynz002t01ql64d81csd',
      center: [-96, 37.8],
      zoom: 0,
    });

    // map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      marker: new mapboxgl.Marker({ color: 'orange' }),
      mapboxgl: mapboxgl
    });


    const geocoderContainer = document.getElementById('geocoder');
    geocoderContainer!.innerHTML = '';
    geocoderContainer!.appendChild(geocoder.onAdd(map));

    geocoder.on('result', function (e) {
      console.log(e.result);
    });
    console.log(geocoder.getWorldview())

    map.on('load', () => {
      setIsMapLoaded(true);
    });

    return () => {
      geocoderContainer!.innerHTML = '';
    };

  }, [token]);

  return (
    <div className={`flex flex-col px-8 py-24 sm:py-8 justify-center items-center relative h-full w-full transition-opacity duration-500 ${isMapLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <h1 
        className='mb-2 text-2xl font-medium text-center animate__animated animate__fadeIn'
      >
        Add your property
      </h1>
      <Text 
        className='mb-6 text-center animate__animated animate__fadeIn'
        style={{ animationDelay: '0.1s' }}
      >
        Type in the address to start managing your first rental property
      </Text>
      <div id="map" className='mx-auto text-center items-center w-full sm:w-4/5 h-full sm:h-4/5 rounded-2xl'>
        <div id="geocoder" className="absolute z-10 w-1/2 top-4 left-1/2 transform -translate-x-1/2 flex items-center justify-center"></div>
      </div>
    </div>
  );
}
