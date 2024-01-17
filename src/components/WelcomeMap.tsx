"use client"
import { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { Text } from '@/components/catalyst/text';
import 'animate.css';

export function WelcomeMap() {
  const token = process.env.NEXT_PUBLIC_MAPBOX_KEY!
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const mapRef = useRef<mapboxgl.Map | null>(null);
  const currentPopup = useRef<mapboxgl.Popup | null>(null);

  useEffect(() => {
    mapboxgl.accessToken = token

    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/alan3y2/clq361ynz002t01ql64d81csd',
        center: [-96, 37.8],
        zoom: 0,
      });
    }

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      marker: new mapboxgl.Marker({ color: 'orange' }),
      mapboxgl: mapboxgl
    });

    geocoder.on('result', function (e) {
      const result = e.result;
      console.log(result);
      if (currentPopup.current) {
        currentPopup.current.remove();
      }
      // Assuming the geocoder creates its own marker, we retrieve it
      const markers = document.querySelectorAll('.mapboxgl-marker');
      const latestMarker = markers[markers.length - 1]; // Get the latest marker
    
      if (mapRef.current) {
      currentPopup.current = new mapboxgl.Popup({ offset: 50 })
        .setLngLat(e.result.geometry.coordinates)
        .setHTML(`
          <h3>${e.result.text}</h3>
          <p>${e.result.place_name}</p>
          <button className='text-xl'>Add property</button>
        `)
        .addTo(mapRef.current);
      }
    });

    geocoder.on('clear', function() {
      if (currentPopup.current) {
        currentPopup.current.remove();
        currentPopup.current = null;
      }
    });

    const geocoderContainer = document.getElementById('geocoder');

    if (geocoderContainer) {
      geocoderContainer.innerHTML = '';
      geocoderContainer.appendChild(geocoder.onAdd(mapRef.current));
    }

    console.log(geocoder.getWorldview())

    mapRef.current.on('load', () => {
      setIsMapLoaded(true);
    });

    // return () => {
    //   geocoderContainer!.innerHTML = '';
    // };
    return () => {
      if (currentPopup.current) {
        currentPopup.current.remove();
      }
    };

  }, [token, currentPopup]);

  return (
    <div className={`flex flex-col px-8 py-16 sm:py-8 justify-center items-center relative h-full w-full transition-opacity duration-500 ${isMapLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <h1 
        className='mb-2 text-2xl font-medium text-center animate__animated animate__fadeIn'
      >
        Add your property
      </h1>
      <Text 
        className='mb-6 text-center animate__animated animate__fadeIn'
        style={{ animationDelay: '0.1s' }}
      >
        Type in your address and click on the marker to add your property
      </Text>
      <div id="map" className='mx-auto text-center items-center w-full sm:w-4/5 h-full sm:h-4/5 rounded-2xl'>
        <div id="geocoder" className="absolute z-10 w-1/2 top-4 left-1/2 transform -translate-x-1/2 flex items-center justify-center"></div>
      </div>
    </div>
  );
}
