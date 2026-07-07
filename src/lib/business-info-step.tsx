"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { StepNavigation } from "@/components/onboarding/step-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOnboardingStore } from "@/lib/onboarding-store";

export function BusinessInfoStep() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { businessName, ownerName, ownerEmail, updateState, businessId } =
    useOnboardingStore();

  const isNextDisabled = !businessName || !ownerName || !ownerEmail;

  const handleNext = async () => {
    if (businessId) {
      router.push(`/onboarding?step=2`);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/businesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName, ownerName, ownerEmail }),
      });

      if (!response.ok) throw new Error("Failed to create business.");

      const data = await response.json();
      updateState({ businessId: data.id });
      toast.success("Business information saved successfully!");
      router.push(`/onboarding?step=2`);
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
        <CardTitle>Business Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              placeholder="e.g., ForkFlow Hospitality Group"
              value={businessName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateState({ businessName: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ownerName">Owner's Full Name</Label>
            <Input
              id="ownerName"
              placeholder="e.g., Jane Doe"
              value={ownerName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateState({ ownerName: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ownerEmail">Owner's Email Address</Label>
            <Input
              id="ownerEmail"
              type="email"
              placeholder="e.g., jane.doe@example.com"
              value={ownerEmail}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateState({ ownerEmail: e.target.value })
              }
            />
          </div>
        </div>
        <StepNavigation
          currentStep={1}
          totalSteps={5}
          onNext={handleNext}
          nextLabel={isLoading ? "Saving..." : "Next"}
          nextDisabled={isNextDisabled || isLoading}
        />
      </CardContent>
    </Card>
  );
}
