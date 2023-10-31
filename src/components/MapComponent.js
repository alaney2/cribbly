// pages/map.js or components/MapComponent.js
import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = () => {
  useEffect(() => {
    // Check if window is defined (so if in the browser or in node.js).
    if (typeof window !== 'undefined') {
      // Create the map
      const map = L.map('map', {
        center: [51.505, -0.09], // Coordinates for London
        zoom: 13,
      });

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Add a marker
      const marker = L.marker([51.505, -0.09]).addTo(map);
      marker.bindPopup('A pretty CSS3 popup.<br> Easily customizable.').openPopup();
    }
  }, []);

  return <div id="map" style={{ height: '400px' }} />;
};

export default MapComponent;
