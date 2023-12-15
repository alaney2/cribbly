"use client"
import Head from 'next/head';
import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

export default function Home() {
  const token = process.env.NEXT_PUBLIC_MAPBOX_KEY!
  useEffect(() => {
    mapboxgl.accessToken = token

    const geojson = {
      // ... your geojson data
    };

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/alan3y2/clq361ynz002t01ql64d81csd',
      center: [-96, 37.8],
      zoom: 3,
    });

    map.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
      })
    );
    map.addControl(new mapboxgl.NavigationControl());

    // add markers to map
    // ... your marker code
  }, []);

  return (
    <div>
      <Head>
        <title>Demo: Add custom markers in Mapbox GL JS</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" />
      </Head>
      <div id="map" />
      <style jsx>{`
        body {
          margin: 0;
          padding: 0;
        }
        #map {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 100%;
        }
        .marker {
          background-image: url('/mapbox-icon.png');
          background-size: cover;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          cursor: pointer;
        }
        .mapboxgl-popup {
          max-width: 200px;
        }
        .mapboxgl-popup-content {
          text-align: center;
          font-family: 'Open Sans', sans-serif;
        }
      `}</style>
    </div>
  );
}
