import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";
import { Heading, Subheading } from "@/components/catalyst/heading";
import { Input } from "@/components/catalyst/input";
import {
	Description,
	Field,
	FieldGroup,
	Fieldset,
	Label,
	Legend,
} from "@/components/catalyst/fieldset";
import { Button } from "@/components/catalyst/button";
import { Divider } from "@/components/catalyst/divider";
import "animate.css";
import { createClient } from "@/utils/supabase/client";
import useSWR, { useSWRConfig } from "swr";
import { toast } from "sonner";
import { addPropertyNew } from "@/utils/supabase/actions";
import { useRouter } from "next/navigation";
import { updateCurrentProperty } from "@/utils/supabase/actions";
import React from "react";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

type FunctionProps = {
	currentProperty?: any;
	setCurrentProperty?: (property: any) => void;
	buttonOnClick?: () => void;
};
interface Address {
	street: string;
	apt: string;
	city: string;
	state: string;
	zip: string;
	country: string;
}

interface Suggestion {
	place_id: string;
	description: string;
}

const AddressAutocomplete = ({
	currentProperty,
	setCurrentProperty,
	buttonOnClick,
}: FunctionProps) => {
	const [address, setAddress] = useState<Address>({
		street: currentProperty?.street_address || "",
		apt: currentProperty?.apt || "",
		city: currentProperty?.city || "",
		state: currentProperty?.state || "",
		zip: currentProperty?.zip || "",
		country: "United States",
	});

	const [inputDisabled, setInputDisabled] = useState(
		currentProperty &&
			currentProperty?.street_address !== "" &&
			currentProperty?.city !== "" &&
			currentProperty?.state !== "" &&
			currentProperty?.zip !== "",
	);

	const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const inputRef = useRef<HTMLInputElement>(null);
	const suggestionsRef = useRef<HTMLUListElement>(null);
	const places = useMapsLibrary("places");
	const router = useRouter();

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				suggestionsRef.current &&
				!suggestionsRef.current.contains(event.target as Node) &&
				inputRef.current &&
				!inputRef.current.contains(event.target as Node)
			) {
				setShowSuggestions(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setAddress((prev) => ({ ...prev, [name]: value }));

		if (name === "street" && places && value) {
			const autocompleteService = new places.AutocompleteService();
			autocompleteService.getPlacePredictions(
				{
					input: value,
					componentRestrictions: { country: "us" },
					types: ["address"],
				},
				(
					predictions: google.maps.places.AutocompletePrediction[] | null,
					status: google.maps.places.PlacesServiceStatus,
				) => {
					if (
						status === google.maps.places.PlacesServiceStatus.OK &&
						predictions
					) {
						const filteredPredictions = predictions.filter((p) =>
							/^\d/.test(p.description),
						);
						setSuggestions(
							filteredPredictions.map((p) => ({
								place_id: p.place_id,
								description: p.description,
							})),
						);
						setSelectedIndex(-1);
						setShowSuggestions(filteredPredictions.length > 0);
					} else {
						setSuggestions([]);
						setShowSuggestions(false);
					}
				},
			);
		} else {
			setSuggestions([]);
		}
	};

	const handleInputFocus = () => {
		if (suggestions.length > 0) {
			setShowSuggestions(true);
		}
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "ArrowDown") {
			event.preventDefault();
			setSelectedIndex((prevIndex) =>
				prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex,
			);
			setShowSuggestions(true);
		} else if (event.key === "ArrowUp") {
			event.preventDefault();
			setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : -1));
			setShowSuggestions(true);
		} else if (event.key === "Enter" && selectedIndex !== -1) {
			event.preventDefault();
			handleSuggestionClick(suggestions[selectedIndex]);
		} else if (event.key === "Escape") {
			setShowSuggestions(false);
		}
	};

	const handleSuggestionClick = (suggestion: Suggestion) => {
		if (!places) return;

		const placesService = new places.PlacesService(
			document.createElement("div"),
		);
		placesService.getDetails(
			{ placeId: suggestion.place_id },
			(
				place: google.maps.places.PlaceResult | null,
				status: google.maps.places.PlacesServiceStatus,
			) => {
				if (
					status === google.maps.places.PlacesServiceStatus.OK &&
					place &&
					place.address_components
				) {
					const addressComponents = place.address_components;
					const newAddress: Address = {
						street: `${getComponent(addressComponents, "street_number")} ${getComponent(addressComponents, "route")}`,
						apt: "",
						city: getComponent(addressComponents, "locality"),
						state: getComponent(
							addressComponents,
							"administrative_area_level_1",
						),
						zip: getComponent(addressComponents, "postal_code"),
						country: "United States",
					};
					setAddress(newAddress);
				}
			},
		);
		setSuggestions([]);
	};

	const getComponent = (
		components: google.maps.GeocoderAddressComponent[],
		type: string,
	): string => {
		const component = components.find((c) => c.types.includes(type));
		return component ? component.long_name : "";
	};

	return (
		<div className="space-y-4">
			<form
				autoComplete="off"
				action={async (formData) => {
					const promise = (async () => {
						const result = await addPropertyNew(formData);
						await updateCurrentProperty(result.id);
						return result;
					})();

					toast.promise(promise, {
						loading: "Adding property...",
						success: (result) => {
							console.log("result", result);
							if (buttonOnClick) {
								setCurrentProperty?.({
									street_address: result.street_address,
									apt: result.apt,
									city: result.city,
									state: result.state,
									zip: result.zip,
									country: result.country,
								});
								setInputDisabled(true);
								buttonOnClick();
							} else {
								router.push("/dashboard/settings");
							}
							return "Property added successfully!";
						},
						error: (err) => `Error adding property: ${err.message}`,
					});

					try {
						await promise;
					} catch (error) {
						console.error("Error in form submission:", error);
					}
				}}
			>
				<Fieldset>
					<FieldGroup>
						<div className="relative">
							<Field>
								<Label>Street address</Label>
								<Input
									ref={inputRef}
									type="text"
									name="street"
									value={address.street}
									onChange={handleInputChange}
									onKeyDown={handleKeyDown}
									onBlurCapture={() =>
										setTimeout(() => setShowSuggestions(false), 100)
									}
									onFocus={handleInputFocus}
									autoComplete="off"
									autoFocus
									readOnly={inputDisabled}
									required
								/>
							</Field>
							{showSuggestions && suggestions.length > 0 && (
								<ul
									ref={suggestionsRef}
									className="absolute z-10 w-full bg-white dark:bg-black dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-lg mt-1 max-h-64 overflow-y-auto"
								>
									{suggestions.map((suggestion, index) => (
										<React.Fragment key={suggestion.place_id}>
											<li
												onClick={() => handleSuggestionClick(suggestion)}
												onKeyDown={(e) => {
													if (e.key === "Enter" || e.key === " ") {
														handleSuggestionClick(suggestion);
													}
												}}
												aria-selected={index === selectedIndex}
												className={`p-2.5 cursor-default sm:text-sm transition-colors duration-150 ease-in-out ${
													index === selectedIndex
														? "bg-gray-100 dark:bg-zinc-800"
														: "hover:bg-gray-100 dark:hover:bg-zinc-700"
												}`}
											>
												{suggestion.description}
											</li>
											{index < suggestions.length - 1 && <Divider />}
										</React.Fragment>
									))}
								</ul>
							)}
						</div>
						<Field>
							<Label>Apt, Suite, etc (optional)</Label>
							<Input
								type="text"
								name="apt"
								value={address.apt}
								onChange={handleInputChange}
								autoComplete="off"
								readOnly={inputDisabled}
							/>
						</Field>
						<Field>
							<Label>City</Label>
							<Input
								type="text"
								name="city"
								value={address.city}
								onChange={handleInputChange}
								autoComplete="off"
								required
								readOnly={inputDisabled}
							/>
						</Field>
						<div className="flex space-x-4">
							<Field>
								<Label>State</Label>
								<Input
									type="text"
									name="state"
									value={address.state}
									onChange={handleInputChange}
									autoComplete="off"
									readOnly={inputDisabled}
									required
								/>
							</Field>
							<Field>
								<Label>ZIP Code</Label>
								<Input
									type="text"
									name="zip"
									value={address.zip}
									onChange={handleInputChange}
									autoComplete="off"
									readOnly={inputDisabled}
									required
								/>
							</Field>
						</div>
						<Field>
							<Label>Country</Label>
							<Input
								type="text"
								name="country"
								value={address.country}
								onChange={handleInputChange}
								autoComplete="off"
								readOnly
								required
							/>
						</Field>
					</FieldGroup>
				</Fieldset>
				{inputDisabled ? (
					<Button
						type="button"
						color="blue"
						onClick={buttonOnClick}
						className="w-full h-10 text-sm mt-8 py-2 px-4 rounded-md"
					>
						Continue
					</Button>
				) : (
					<Button
						type="submit"
						color="blue"
						className="w-full h-10 text-sm mt-8 py-2 px-4 rounded-md"
					>
						Add property
					</Button>
				)}
			</form>
		</div>
	);
};

const App = ({
	currentProperty,
	setCurrentProperty,
	buttonOnClick,
}: FunctionProps) => {
	const [fadeOut, setFadeOut] = useState(false);
	const animationClass = fadeOut
		? "animate__animated animate__fadeOut animate__faster"
		: "";

	return (
		<APIProvider apiKey={GOOGLE_MAPS_API_KEY || ""}>
			<div
				className={`p-4 animate__animated animate__fadeIn ${animationClass}`}
			>
				<Heading>Property address</Heading>
				<Subheading className="mb-6">
					Get started with entering your property address
				</Subheading>
				<AddressAutocomplete
					currentProperty={currentProperty}
					setCurrentProperty={setCurrentProperty}
					buttonOnClick={buttonOnClick}
				/>
			</div>
		</APIProvider>
	);
};

export default App;
