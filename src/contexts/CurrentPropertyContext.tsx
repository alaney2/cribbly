"use client";
import type React from "react";
import { createContext, useState, useContext } from "react";

type CurrentPropertyContextType = {
	currentPropertyId: string;
	setCurrentPropertyId: (id: string) => void;
};

const CurrentPropertyContext = createContext<
	CurrentPropertyContextType | undefined
>(undefined);

export const CurrentPropertyProvider: React.FC<{
	children: React.ReactNode;
	initialPropertyId: string;
}> = ({ children, initialPropertyId }) => {
	const [currentPropertyId, setCurrentPropertyId] = useState(initialPropertyId);

	return (
		<CurrentPropertyContext.Provider
			value={{ currentPropertyId, setCurrentPropertyId }}
		>
			{children}
		</CurrentPropertyContext.Provider>
	);
};

export const useCurrentProperty = () => {
	const context = useContext(CurrentPropertyContext);
	if (context === undefined) {
		throw new Error(
			"useCurrentProperty must be used within a CurrentPropertyProvider",
		);
	}
	return context;
};
