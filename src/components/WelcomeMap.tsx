"use client"
import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { Text } from '@/components/catalyst/text';
import 'animate.css';
import styles from './WelcomeMap.module.css';
import ReactDOM from 'react-dom';

interface PopupContentProps {
  placeName: string;
  onAdd: () => void;
}

const Popup = ({ placeName, onAdd }: PopupContentProps) => {
  return (
    <div>
      <p className={styles.popupText}>{placeName}</p>
      <button className={styles.popupButton} onClick={onAdd}>
        Add property
      </button>
    </div>
  );
}

export function WelcomeMap({ buttonOnClick }: { buttonOnClick: () => void }) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_KEY!
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);


  useEffect(() => {
    mapboxgl.accessToken = token

    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/alan3y2/clq361ynz002t01ql64d81csd',
        center: [-96, 37.8],
        zoom: 2,
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
      if (popupRef.current) {
        popupRef.current.remove();
      }
      const markers = document.querySelectorAll('.mapboxgl-marker');
      const latestMarker = markers[markers.length - 1]; // Get the latest marker
      
      const popupNode = document.createElement("div")
      ReactDOM.render(
        <Popup placeName={e.result.place_name} onAdd={buttonOnClick} />,
        popupNode
      );
      if (mapRef.current) {
        popupRef.current = new mapboxgl.Popup({ offset: 50, closeOnClick: false, closeButton: false })
          .setLngLat(e.result.geometry.coordinates)
          .setDOMContent(popupNode)
          .addTo(mapRef.current);
      }
    });

    geocoder.on('clear', function() {
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
    });

    const geocoderContainer = document.getElementById('geocoder');
    const navigationControl = new mapboxgl.NavigationControl();

    if (!mapRef.current.hasControl(navigationControl)) {
      mapRef.current.addControl(navigationControl, 'top-right');
    }

    if (geocoderContainer) {
      geocoderContainer.innerHTML = '';
      geocoderContainer.appendChild(geocoder.onAdd(mapRef.current));
    }

    mapRef.current.on('load', () => {
      setIsMapLoaded(true);
    });

    return () => {
      if (popupRef.current) {
        popupRef.current.remove();
      }
    };

  }, [token, popupRef, buttonOnClick]);

  return (
    <div className={`flex flex-col px-2 py-16 sm:py-8 justify-center items-center relative h-full w-full transition-opacity duration-500 overscroll-none ${isMapLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <Text
        className='mb-6 text-center animate__animated animate__fadeIn'
        style={{ animationDelay: '0.1s' }}
      >
        Type in your address to get started
      </Text>
      <div ref={mapContainer} id="map" className='mx-auto text-center items-center w-full sm:w-4/5 h-full sm:h-4/5 rounded-2xl'>
        <div id="geocoder" className="absolute z-10 w-1/2 top-4 left-1/2 transform -translate-x-1/2 flex items-center justify-center"></div>
      Bbu</div>
    </div>
  );
}
