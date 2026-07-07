"use client";

import { ProgressStepper } from "./progress-stepper";
import { BusinessInfoStep } from "./steps/business-info-step";
import { FloorDetailsStep } from "./steps/floor-details-step";
import { RestaurantInfoStep } from "./steps/restaurant-info-step";
import { ReviewStep } from "./steps/review-step";
import { TableLayoutStep } from "./steps/table-layout-step";

interface Step {
  id: string;
  name: string;
  description: string;
}

interface OnboardingWizardProps {
  steps: Step[];
  currentStep: number;
}

export function OnboardingWizard({
  steps,
  currentStep,
}: OnboardingWizardProps) {
  const stepComponents: { [key: number]: React.ReactNode } = {
    1: <BusinessInfoStep />,
    2: <RestaurantInfoStep />,
    3: <FloorDetailsStep />,
    4: <TableLayoutStep />,
    5: <ReviewStep />,
  };

  const ActiveStepComponent = stepComponents[currentStep] || (
    <div>Step not found</div>
  );

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
      <div className="px-8 lg:col-span-1 lg:px-0 lg:pl-8">
        <ProgressStepper
          steps={steps}
          currentStep={currentStep}
          orientation="vertical"
        />
      </div>
      <div className="px-8 pb-8 lg:col-span-3">{ActiveStepComponent}</div>
    </div>
  );
}
