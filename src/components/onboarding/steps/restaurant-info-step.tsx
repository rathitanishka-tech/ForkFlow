"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { StepNavigation } from "@/components/onboarding/step-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOnboardingStore } from "@/lib/onboarding-store";

export function RestaurantInfoStep() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    restaurantName,
    restaurantAddress,
    cuisineType,
    updateState,
    businessId,
    restaurantId,
  } = useOnboardingStore();

  const isNextDisabled = !restaurantName || !restaurantAddress || !cuisineType;

  const handleNext = async () => {
    if (restaurantId) {
      router.push(`/onboarding?step=3`);
      return;
    }

    if (!businessId) {
      toast.error("Business information is missing. Please go back.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: restaurantName,
          address: restaurantAddress,
          cuisine: cuisineType,
          businessId,
        }),
      });

      if (!response.ok) throw new Error("Failed to create restaurant.");

      const data = await response.json();
      updateState({ restaurantId: data.id });
      toast.success("Restaurant details saved successfully!");
      router.push(`/onboarding?step=3`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Restaurant Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="restaurantName">Restaurant Name</Label>
            <Input
              id="restaurantName"
              placeholder="e.g., The Gourmet Garden"
              value={restaurantName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateState({ restaurantName: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="restaurantAddress">Address</Label>
            <Input
              id="restaurantAddress"
              placeholder="e.g., 123 Culinary Lane, Foodville"
              value={restaurantAddress}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateState({ restaurantAddress: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Cuisine Type</Label>
            <Select
              value={cuisineType}
              onValueChange={(value) => {
                if (value) updateState({ cuisineType: value });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a cuisine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="italian">Italian</SelectItem>
                <SelectItem value="indian">Indian</SelectItem>
                <SelectItem value="mexican">Mexican</SelectItem>
                <SelectItem value="chinese">Chinese</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <StepNavigation
          currentStep={2}
          totalSteps={5}
          onNext={handleNext}
          nextLabel={isLoading ? "Saving..." : "Next"}
          nextDisabled={isNextDisabled || isLoading}
        />
      </CardContent>
    </Card>
  );
}
