"use client";

import { useState } from "react";
import { Button } from "@/components/catalyst/button";
import { Heading, Subheading } from "@/components/catalyst/heading";
import { Text } from "@/components/catalyst/text";
import GoogleMap, { AddressAutocomplete } from "@/components/welcome/GoogleMap";

export function NewProperty() {
	const [showMap, setShowMap] = useState(false);

	const noPropertiesMessage = (
		<div className="text-center py-8">
			<Subheading className="text-lg mb-4">
				It looks like you haven't added any properties yet!
			</Subheading>
			<Button color="blue" onClick={() => setShowMap(true)}>
				Add rental property
			</Button>
		</div>
	);

	return (
		<div className="flex items-center justify-center h-full">
			<div className="w-full max-w-xl">
				{showMap ? (
					<GoogleMap
						heading="Welcome"
						subheading="Get started by adding your first property"
					/>
				) : (
					noPropertiesMessage
				)}
			</div>
		</div>
	);
}
