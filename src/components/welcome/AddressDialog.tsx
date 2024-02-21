import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/catalyst/dialog'
import { Field, Label } from '@/components/catalyst/fieldset'
import { Input } from '@/components/catalyst/input'
import { Button } from '@/components/catalyst/button';
import { ComboBoxCustom } from '@/components/welcome/ComboBox';
import { Country, State, City }  from 'country-state-city';


export function AddressDialog({ isOpen, setIsOpen, result } : { isOpen: boolean; setIsOpen: (isOpen: boolean) => void; result: any } ) {
  const address = result.place_name;
  const addressArray = address.split(',');
  const numSlices = addressArray.length;
  const countryName = addressArray.pop().trim();
  let allCountries = Country.getAllCountries();
  let countryObject = allCountries.find((country: { name: string; }) => country.name === countryName);
  
  return (
    <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Confirm address details</DialogTitle>
        <DialogDescription>
          Please confirm the address details for the property you are adding.
        </DialogDescription>
        <DialogBody>
          <Field>
            <Label>Country</Label>
            {/* <Input name="country" placeholder="United States" /> */}
            <ComboBoxCustom inputs={Country.getAllCountries()} defaultCountry={countryObject} />
          </Field>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button color="blue" onClick={() => setIsOpen(false)}>Confirm</Button>
        </DialogActions>
      </Dialog>
  )
}