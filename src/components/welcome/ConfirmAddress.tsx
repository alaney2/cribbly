"use client"
import { useEffect } from 'react';
import { Country, State, City }  from 'country-state-city';

export function ConfirmAddress() {
  useEffect(() => {
    console.log('here')
    if (typeof window !== "undefined") {
      const result = JSON.parse(localStorage.getItem("result") || '{}');
      const address = result.place_name;
      const addressArray = address.split(',');
      const numSlices = addressArray.length;
      const country = addressArray.pop().trim();
      // const state = addressArray[2].trim();

      // const city = addressArray[1].trim();
      // const country = addressArray[3].trim();
      // console.log('city', city);
      // console.log('state', state);
      // console.log('country', country);
      console.log('result', result);
      console.log('address', address);
      console.log('Country', Country.getAllCountries());
    }
  }, )
  
  return (
    <>
      <h1>Confirm Address</h1>

    </>
  )
}