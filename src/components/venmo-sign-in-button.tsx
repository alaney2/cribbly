"use client";

import { useState } from "react";

interface VenmoSignInButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function VenmoSignInButton({
  onSuccess,
  onError,
}: VenmoSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/venmo/authenticate");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to connect to Venmo");
      }

      onSuccess?.();
    } catch (error: any) {
      onError?.(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignIn}
      disabled={isLoading}
      className="flex items-center justify-center px-4 py-2 bg-[#008CFF] text-white font-semibold rounded-lg hover:bg-[#0070CC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
      ) : (
        <svg
          className="w-5 h-5 mr-2"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          role="img"
        >
          <path d="M17.461 7.391c0.326-2.099-1.151-3.24-3.359-3.24-1.889 0-3.491 1.186-3.491 2.89 0 1.811 1.443 2.439 3.221 3.045 1.654 0.563 2.167 0.934 2.167 1.776 0 0.766-0.607 1.32-1.654 1.32-1.607 0-2.307-0.749-2.307-2.19h-3.359c-0.047 2.699 1.98 4.24 5.526 4.24 3.359 0 5.151-1.471 5.151-3.701 0-1.424-0.793-2.354-2.167-2.96-1.42-0.633-2.587-0.914-2.587-1.776 0-0.633 0.514-1.098 1.373-1.098 1.14 0 1.607 0.633 1.607 1.694h2.879z" />
        </svg>
      )}
      {isLoading ? "Connecting..." : "Connect Venmo"}
    </button>
  );
}
