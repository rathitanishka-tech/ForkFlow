"use client";

import { useRouter } from "next/navigation";
import { StepNavigation } from "@/components/onboarding/step-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOnboardingStore } from "@/lib/onboarding-store";

export function BusinessInfoStep() {
  const router = useRouter();
  const { businessName, ownerName, ownerEmail, updateState } =
    useOnboardingStore();

  const isNextDisabled = !businessName || !ownerName || !ownerEmail;

  const handleNext = () => {
    // This step only collects data via on-the-fly state updates.
    // The `onNext` handler's responsibility is to navigate.
    router.push(`/onboarding?step=2`);
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
          nextDisabled={isNextDisabled}
          onNext={handleNext}
        />
      </CardContent>
    </Card>
  );
}
