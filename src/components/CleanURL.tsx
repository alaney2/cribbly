"use client"
import { useEffect } from 'react';

const CleanURL = () => {
  useEffect(() => {
    if (window.history.replaceState) {
      const cleanURL = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
      window.history.replaceState({}, document.title, cleanURL);
    }
  }, []);

  return null;
};

export default CleanURL;
