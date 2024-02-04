"use client"
import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { Text, Strong } from '@/components/catalyst/text';
import 'animate.css';
import styles from './Welcome.module.css';
import ReactDOM from 'react-dom';
import { Button } from '@/components/catalyst/button';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Script from 'next/script'

type PopupContentProps = {
  placeName: string;
  onAdd: () => void;
};

const Popup = ({ placeName, onAdd }: PopupContentProps) => {
  return (
    <div className=''>
      <p className={styles.popupText}>{placeName}</p>
      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
      </div>
      <button color="blue" className='button mb-1 mt-3 bg-blue-500 rounded-md cursor-default select-none
        active:translate-y-1 active:[box-shadow:0_3px_0_0_#1b6ff8,0_4px_0_0_#1b70f841]
        transition-all duration-150 [box-shadow:0_5px_0_0_#1b6ff8,0_7px_0_0_#1b70f841] border-b-0 px-2 py-0.5' onClick={onAdd}>
          <span className='flex flex-col justify-center items-center h-full text-white font-bold text-sm'>
            Add property
          </span>
      </button>
    </div>
  );
}

export function WelcomeMap({ buttonOnClick }: { buttonOnClick: () => void }) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_KEY!
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const popupRef = useRef(
    new mapboxgl.Popup({ offset: 50, closeOnClick: false, closeButton: false })
  )
  const geocoderRef = useRef<HTMLDivElement>(null);
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapboxgl.supported() === false) {
      alert('Your browser does not support Mapbox GL');
      return;
    }
    mapboxgl.accessToken = token

    const map = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/alan3y2/clq361ynz002t01ql64d81csd',
      center: [-96, 37.8],
      zoom: 2,
      attributionControl: false,
      
    }).addControl(new mapboxgl.AttributionControl({
      compact: true,
  }));;
    
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      filter: function (item) {
        console.log(item)
        return item.place_type[0] === 'address';
      },
      // marker: new mapboxgl.Marker({ color: 'orange' }),
      mapboxgl: mapboxgl
    });

    geocoder.on('result', function (e) {
      const result = e.result;
      console.log(result)
      if (popupRef.current) {
        popupRef.current.remove();
      }
      
      const popupNode = document.createElement("div")
      ReactDOM.render(
        <Popup placeName={e.result.place_name.split(',')[0]} onAdd={buttonOnClick} />,
        popupNode
      );
      popupRef.current
        .setLngLat(e.result.geometry.coordinates)
        .setDOMContent(popupNode)
        .addTo(map);
    });

    geocoder.on('clear', function() {
      if (popupRef.current) {
        popupRef.current.remove();
      }
    });

    const navigationControl = new mapboxgl.NavigationControl();

    if (!map.hasControl(navigationControl)) {
      map.addControl(navigationControl, 'top-right');
    }

    if (geocoderRef.current) {
      geocoderRef.current.innerHTML = '';
      geocoderRef.current.appendChild(geocoder.onAdd(map));
    }

    map.on('load', () => {
      setIsMapLoaded(true);
    });

    const currentPopupRef = popupRef.current;
    return () => {
      if (currentPopupRef) {
        currentPopupRef.remove();
      }
      map.remove();
      geocoder.clear();
    };

  }, [token, popupRef, buttonOnClick]);

  return (
    <>
      <Script src='https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-supported/v2.0.0/mapbox-gl-supported.js'></Script>

      <div className={`flex flex-col px-2 py-16 sm:py-8 justify-center items-center relative h-full w-full overscroll-none`}>
        <Text
          className='mb-6 text-center animate__animated animate__fadeIn'
          style={{ animationDelay: '0.2s' }}
        >
          Type in your address to get started
        </Text>
        <div 
          ref={mapContainer} 
          className={`mx-auto text-center items-center w-full sm:w-4/5 h-full sm:h-4/5 rounded-2xl transition-opacity appearance-none animate__animated animate__fadeIn`}
          style={{ animationDelay: '0.4s' }}
        >
          {!isMapLoaded && <Skeleton containerClassName="flex-1" borderRadius="1rem" height="100%"/>}
          <div ref={geocoderRef} className="absolute z-10 w-1/2 top-4 left-1/2 transform -translate-x-1/2 flex items-center justify-center">
          </div>
        </div>
      </div>
    </>
  );
}
