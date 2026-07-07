"use client";

import { useRouter } from "next/navigation";
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
  const { restaurantName, restaurantAddress, cuisineType, updateState } =
    useOnboardingStore();

  const isNextDisabled = !restaurantName || !restaurantAddress || !cuisineType;

  const handleNext = () => {
    router.push(`/onboarding?step=3`);
  };

  const handleCuisineChange = (value: string | null) => {
    if (value) updateState({ cuisineType: value });
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
              onValueChange={(value: string | null) => {
                handleCuisineChange(value);
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
          nextDisabled={isNextDisabled}
          onNext={handleNext}
        />
      </CardContent>
    </Card>
  );
}
