"use client"
import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'animate.css';
import styles from '@/components/welcome/Welcome.module.css';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Script from 'next/script'
import Map, { AttributionControl, FullscreenControl, NavigationControl, Popup, Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { MapRef } from 'react-map-gl';
import { AddressDialog } from '@/components/welcome/AddressDialog'


export function MapBox() {
  const [fadeOut, setFadeOut] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupCoordinates, setPopupCoordinates] = useState<[number, number] | null>(null);
  const [result, setResult] = useState({});
  const [popupText, setPopupText] = useState('');
  const animationClass = fadeOut ? 'animate__animated animate__fadeOut animate__faster' : '';
  const geocoderRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapRef>(null);
  const popupRef = useRef<mapboxgl.Popup>(null);
  let [isOpen, setIsOpen] = useState(false)


  const popupClick = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("result", JSON.stringify(result));
    }
    // setTimeout(setIsOpen(true), 300);
    setIsOpen(true)
    // setTimeout(buttonOnClick, 300);
  }

  useEffect(() => {
    if (mapboxgl.supported() === false) {
      alert('Your browser does not support Mapbox GL');
      return;
    }

    if (!isMapLoaded || !mapRef.current) {
      return;
    }

    const map = mapRef.current.getMap();
  
    const geocoder = new MapboxGeocoder({
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_KEY || '',
      mapboxgl: mapboxgl,
      countries: 'us',
      filter: (item) => {
        return item.place_type[0] === 'address';
      },
    });

    if (geocoderRef.current) {
      geocoderRef.current.appendChild(geocoder.onAdd(map));
    }

    geocoder.on('result', function (e) {
      const result = e.result;
      setResult(result);
      setShowPopup(true);
      setPopupCoordinates(e.result.geometry.coordinates);
      setPopupText(e.result.place_name.split(',')[0]);
    });

    geocoder.on('clear', function() {
      if (popupRef.current) {
        popupRef.current.remove();
      }
    });
    
    const currentGeocoderRef = geocoderRef.current;
    const currentPopupRef = popupRef.current;
    return () => {
      if (currentPopupRef) {
        currentPopupRef.remove();
      }
      geocoder.clear();
      if (currentGeocoderRef) {
        currentGeocoderRef.innerHTML = '';
      }
    };

  }, [isMapLoaded]);


  return (
    <>
      <Script src='https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-supported/v2.0.0/mapbox-gl-supported.js' />
      <div className={`flex flex-col justify-center items-center relative h-full w-full ${animationClass}`}>
        <div
          className={`mx-auto text-center items-center w-full h-full transition-opacity appearance-none animate__animated animate__fadeIn`}
        >
          <Map
            ref={mapRef}
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
            initialViewState={{
              longitude: -95.7,
              latitude: 37.1,
              zoom: 3
            }}
            mapStyle="mapbox://styles/alan3y2/clq361ynz002t01ql64d81csd"
            reuseMaps={true}
            attributionControl={false}
            style={{
              borderRadius: '1rem',
              lineHeight: 1,
              zIndex: 0,
              height: 'calc(100vh - 6rem)',
              width: '100%',
            }}
            onLoad={() => setIsMapLoaded(true)}
          >
            {!isMapLoaded && <Skeleton containerClassName="flex-1" borderRadius="1rem" height="100%"/>}
            
            <AttributionControl compact={true} />
            <FullscreenControl />
            <NavigationControl />
            <div ref={geocoderRef} className="absolute z-10 w-1/2 top-4 left-1/2 transform -translate-x-1/2 flex items-center justify-center" />
            {showPopup && popupCoordinates && (
              <Popup ref={popupRef} longitude={popupCoordinates[0]} latitude={popupCoordinates[1]}
                anchor="bottom"
                onClose={() => setShowPopup(false)}
                offset={50}
                closeOnClick={false}
                closeButton={false}
                style={{
                  borderRadius: '1rem',
                  overflow: 'auto',
                }}
              >
                <div className="p-2">
                  <p className="font-semibold tracking-normal	text-base text-gray-700 m-0">{popupText}</p>
                  <div className="relative mt-2">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-gray-400" />
                    </div>
                  </div>
                  <button
                    className='button mb-1 mt-4 bg-blue-500 rounded-md cursor-default select-none
                    active:translate-y-1 active:[box-shadow:0_3px_0_0_#1b6ff8,0_4px_0_0_#1b70f841]
                    transition-all duration-150 [box-shadow:0_5px_0_0_#1b6ff8,0_7px_0_0_#1b70f841] border-b-0 px-3 py-2' 
                    onClick={popupClick}
                  >
                    <span className='flex flex-col justify-center items-center h-full text-white font-bold text-sm'>
                      Add property
                    </span>
                  </button>
                  <AddressDialog isOpen={isOpen} setIsOpen={setIsOpen} result={result} setFadeOut={setFadeOut} isWelcome={false} />
                </div>
              </Popup>
            )}
          </Map>
        </div>
      </div>
    </>
  )
}
