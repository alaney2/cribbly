"use client"
import Head from 'next/head';
import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

export function MapBox() {
  const token = process.env.NEXT_PUBLIC_MAPBOX_KEY!
  useEffect(() => {
    mapboxgl.accessToken = token

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/alan3y2/clq361ynz002t01ql64d81csd',
      center: [-96, 37.8],
      zoom: 3,
    });

    map.addControl(new mapboxgl.NavigationControl());

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      marker: {
        color: 'orange'
      },
      mapboxgl: mapboxgl
    });


    const geocoderContainer = document.getElementById('geocoder');
    geocoderContainer!.innerHTML = '';
    geocoderContainer!.appendChild(geocoder.onAdd(map));

    geocoder.on('result', function (e) {
      console.log(e.result);
    });
    console.log(geocoder.getWorldview())


    return () => {
      geocoderContainer!.innerHTML = '';
    };

  }, [token]);

  return (
    <div className='relative h-full w-full rounded-lg'>
      <div id="geocoder" className="absolute z-10 w-1/2 top-4 left-1/2 transform -translate-x-1/2 flex items-center justify-center"></div>
      <div id="map" className='absolute top-0 bottom-0 w-full h-full rounded-2xl' />
    </div>
  );
}
