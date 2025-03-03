"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import VenmoSignInButton from "@/components/venmo-sign-in-button";
import { Card } from "@/components/ui/card";

export default function PaymentsSettingsPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    const success = searchParams.get("success");

    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success(success);
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-semibold">Payment Settings</h1>

      <Card className="p-6">
        <h2 className="text-lg font-medium mb-4">Venmo Integration</h2>
        <p className="text-muted-foreground mb-6">
          Connect your Venmo account to enable seamless payments and transfers.
        </p>
        <VenmoSignInButton
          onSuccess={() => console.log("Connected!")}
          onError={(error) => {
            toast.error(error);
          }}
        />
      </Card>
    </div>
  );
}
