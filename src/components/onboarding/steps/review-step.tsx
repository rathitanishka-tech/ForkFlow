"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { StepNavigation } from "@/components/onboarding/step-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOnboardingStore } from "@/lib/onboarding-store";

function ReviewItem({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-neutral-500">{label}</p>
      <p className="text-base font-semibold text-neutral-900">
        {value || "Not provided"}
      </p>
    </div>
  );
}

export function ReviewStep() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    businessName,
    ownerName,
    ownerEmail,
    restaurantName,
    restaurantAddress,
    cuisineType,
    floors,
    reset,
  } = useOnboardingStore();

  const totalTables = floors.reduce(
    (acc, floor) => acc + floor.tables.length,
    0,
  );

  const handleFinish = async () => {
    setIsLoading(true);
    try {
      // This is a placeholder for a final "publish" action if needed.
      // For example, updating the restaurant status.
      // await fetch(`/api/restaurants/${restaurantId}/publish`, { method: 'POST' });

      toast.success("Onboarding complete! Welcome to ForkFlow.");
      reset(); // Clear the onboarding state
      router.push("/dashboard"); // Navigate to the dashboard
    } catch (error) {
      toast.error("Failed to finalize setup. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Review & Publish</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4 rounded-lg border border-neutral-200 p-4">
            <h3 className="font-semibold">Business Information</h3>
            <ReviewItem label="Business Name" value={businessName} />
            <ReviewItem label="Owner Name" value={ownerName} />
            <ReviewItem label="Owner Email" value={ownerEmail} />
          </div>
          <div className="space-y-4 rounded-lg border border-neutral-200 p-4">
            <h3 className="font-semibold">Restaurant Details</h3>
            <ReviewItem label="Restaurant Name" value={restaurantName} />
            <ReviewItem label="Address" value={restaurantAddress} />
            <ReviewItem label="Cuisine" value={cuisineType} />
            <ReviewItem label="Floors" value={floors.length} />
            <ReviewItem label="Total Tables" value={totalTables} />
          </div>
        </div>
        <StepNavigation
          currentStep={5}
          totalSteps={5}
          onNext={handleFinish}
          nextLabel={isLoading ? "Finishing..." : "Finish & Go to Dashboard"}
          nextDisabled={isLoading}
        />
      </CardContent>
    </Card>
  );
}
