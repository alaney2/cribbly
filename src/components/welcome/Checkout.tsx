"use client"

import { useState } from 'react';

export function Checkout() {
  const [rent, setRent] = useState(0);
  const minimumPrice = 25;
  const percentageOfRent = 0.005;

  // Calculate price based on rent
  const calculatePrice = () => {
    const priceBasedOnRent = rent * percentageOfRent;
    return Math.max(priceBasedOnRent, minimumPrice);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-700">Checkout</h2>
        <p className="mt-2 text-gray-600">
          Purchase our property management software to efficiently manage your rental property.
          Receive a full refund within a month if you are not satisfied, but payment is required upfront.
          In the future, you&apos;ll have the option to manage additional properties.
        </p>
        <div className="mt-4">
          <label htmlFor="rent" className="block text-gray-700">Enter the rent of your property ($):</label>
          <input 
            type="number" 
            id="rent" 
            value={rent}
            onChange={e => setRent(Number(e.target.value))}
            className="w-full p-2 border rounded mt-1"
          />
        </div>
        <div className="mt-6">
          <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Checkout - ${calculatePrice().toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}
