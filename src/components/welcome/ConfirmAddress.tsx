"use client"
import { useEffect } from 'react';
import { Country, State, City }  from 'country-state-city';
import { ComboBoxCustom } from '@/components/welcome/ComboBoxCustom';

export function ConfirmAddress() {
  let countryObject = {}
  useEffect(() => {
    if (typeof window !== "undefined") {
      const result = JSON.parse(localStorage.getItem("result") || '{}');
      const address = result.place_name;
      const addressArray = address.split(',');
      const numSlices = addressArray.length;
      const countryName = addressArray.pop().trim();
      // const state = addressArray[2].trim();

      // const city = addressArray[1].trim();
      // const country = addressArray[3].trim();
      // console.log('city', city);
      // console.log('state', state);
      // console.log('country', country);
      

      console.log('result', result);
      // console.log('address', address);
      // console.log('Country', Country.getAllCountries());
      // console.log(State.getStatesOfCountry('US'))
      let allCountries = Country.getAllCountries();
      let countryObject = allCountries.find((country: { name: string; }) => country.name === countryName);
      
      console.log('countryObject', countryObject);
    }
  }, )
  if (!countryObject) {
    countryObject = {};
  }
  
  return (
    <>
      <h1>Confirm Address</h1>
      <ComboBoxCustom inputs={Country.getAllCountries()} defaultCountry={countryObject} />
    </>
  )
}