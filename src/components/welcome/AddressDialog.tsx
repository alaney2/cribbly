import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/catalyst/dialog'
import { ErrorMessage, Field, Label, Fieldset, Legend, FieldGroup } from '@/components/catalyst/fieldset'
import { Input } from '@/components/catalyst/input'
import { Button } from '@/components/catalyst/button';
import { ICountry, IState, Country, State, City }  from 'country-state-city';
import { Text } from '@/components/catalyst/text';
import { Select } from '@/components/catalyst/select'
import { useState, useEffect, useRef } from 'react'

interface AddressDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  result: any;
  buttonOnClick: () => void;
  setFadeOut: (fadeOut: boolean) => void;
}

export function AddressDialog({ isOpen, setIsOpen, result, buttonOnClick, setFadeOut } : AddressDialogProps ) {
  const address = result.place_name;
  const addressArray = address.split(',');
  for (let i = 0; i < addressArray.length; i++) {
    addressArray[i] = addressArray[i].trim();
  }
  const numSlices = addressArray.length;
  const countryName = addressArray[numSlices - 1].trim();
  const initialCountry = Country.getAllCountries().find((country: { name: string; }) => country.name === countryName);
  const [selectedCountry, setSelectedCountry] = useState<ICountry | null | undefined>(initialCountry);
  const [stateOrProvince, setStateOrProvince] = useState('Province');
  const [zipOrPostal, setZipOrPostal] = useState('Postal Code');

  let stateObject = null;
  let zipCode = useRef('');
  let city = useRef('');
  let currentState = useRef('');
  let states = State.getStatesOfCountry(selectedCountry?.isoCode || '');
  const [apartment, setApartment] = useState('');
  let streetAddress = useRef(addressArray[0].trim())
  
  useEffect(() => {
    const countriesWithStates = ['United States', 'Australia', 'Austria', 'Brazil', 'South Sudan', 'Palau', 'Germany', 'India', 'Nigeria', 'New Zealand', 'Malaysia', 'Myanmar', 'Micronesia', 'Mexico'];
    const countriesWithZip = ['United States', 'Philippines'];

    if (selectedCountry && countriesWithStates.includes(selectedCountry.name)) {
      setStateOrProvince('State');
    } else {
      setStateOrProvince('Province');
    }

    if (selectedCountry && countriesWithZip.includes(selectedCountry.name)) {
      setZipOrPostal('Zip Code');
    } else {
      setZipOrPostal('Postal Code');
    }
  }, [selectedCountry]);

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountry = Country.getAllCountries().find(country => country.name === event.target.value);
    if (newCountry) {
      setSelectedCountry(newCountry);
    }
  };

  
  
  for (let i = numSlices - 2; i > 0; i--) {
    const parts = addressArray[i].trim().split(' ');

    for (let j = 0; j < parts.length; j++) {
      let potentialStateName = parts[j].trim().toLowerCase();
      stateObject = states.find(state => state.name.toLowerCase() === potentialStateName);
      if (stateObject) {
        currentState.current = stateObject.name;
        zipCode.current = parts.slice(j+1).join(' ');
        break;
      }
        
      for (let k = j + 1; k < parts.length; k++) {
        potentialStateName += " " + parts[k].trim().toLowerCase();
        stateObject = states.find(state => state.name.toLowerCase() === potentialStateName);
        if (stateObject) {
          currentState.current = stateObject.name;
          zipCode.current = parts.slice(k+1).join(' ');
          break;
        }
      }

      if (stateObject) {
        break;
      }
    }

    if (stateObject) {
      break;
    }
  }

  if (!stateObject && numSlices === 3) {
    const parts = addressArray[1].trim().split(' ');
    zipCode.current = parts[0].trim();
    city.current = parts.slice(1).join(' ');
  }

  if (numSlices >= 4) {
    if (countryName === 'United States') {
      city.current = addressArray[1].trim();
    } else if (countryName === 'Mexico') {
      const parts = addressArray[1].trim().split(' ');
      zipCode.current = parts[0].trim();
      city.current = parts.slice(1).join(' ');
    } else if (countryName === 'Canada') {
      city.current = addressArray[1].trim();
    }
  }

  const handleClick = () => {
    // event.preventDefault();
    setIsOpen(false);
    setFadeOut(true);
    setTimeout(buttonOnClick, 200);
  }
  
  return (
    <Dialog open={isOpen} onClose={setIsOpen}>
      <form autoComplete='off'>
        <DialogTitle>Confirm address</DialogTitle>
        <DialogDescription>
          Please confirm the address details for your property
        </DialogDescription>
        <DialogBody className='mt-8'>
          <Fieldset aria-label="Confirm address">
            <FieldGroup>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-4">
                <Field className="sm:col-span-2">
                  <Label>Street address</Label>
                  <Input name="street_address" defaultValue={streetAddress.current || ''} autoComplete='off' disabled />
                </Field>
                <Field className="sm:col-span-1">
                  <Label>Apt/Suite</Label>
                  <Input 
                    name="apt" 
                    autoComplete='off'
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-4 -mt-20">
                <Field className="sm:col-span-1">
                  <Label>City</Label>
                  <Input name="city" defaultValue={city.current || ''} autoComplete='off' required disabled />
                </Field>
                <Field className="sm:col-span-1">
                  <Label>{stateOrProvince}</Label>
                  <Select name="state" defaultValue={currentState.current || ''} required disabled>
                    <option value="" disabled>Select a {stateOrProvince === 'State' ? 'state' : 'province'}</option>
                    {states.map((state) => (
                      <option key={state.name} value={state.name}>
                        {state.name}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-4">
                <Field className="sm:col-span-1">
                  <Label>{zipOrPostal}</Label>
                  <Input 
                    name="zip" 
                    defaultValue={zipCode.current || ''} 
                    autoComplete='off' 
                    required
                    className=""
                    disabled
                  />
                </Field>
                <Field className="sm:col-span-1">
                  <Label>Country</Label>
                  <Select
                    disabled
                    name="country" 
                    onChange={handleCountryChange} 
                    defaultValue={selectedCountry?.name || 'United States'}
                  >
                    {Country.getAllCountries().map((country: { name: string; }) => (
                      <option key={country.name} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </Select>
                  {/* <Listbox name="country" defaultValue="United States">
                    {Country.getAllCountries().map((country: { name: string; }) => (
                      <ListboxOption key={country.name} value={country.name}>
                        {country.name}
                      </ListboxOption>
                    ))}
                  </Listbox>
                  <ComboBoxCustom inputs={Country.getAllCountries()} defaultCountry={countryObject} /> */}
                </Field>
              </div>
            </FieldGroup>
          </Fieldset>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)} type="submit">
            Cancel
          </Button>
          <Button color="blue" onClick={handleClick}>Confirm</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
