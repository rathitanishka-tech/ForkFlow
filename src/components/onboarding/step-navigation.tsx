"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void | Promise<void>;
  onBack?: () => void;

  nextLabel?: string;
  backLabel?: string;

  nextDisabled?: boolean;
  backDisabled?: boolean;

  loading?: boolean;
}

export function StepNavigation({
  currentStep,
  totalSteps,
  onNext,
  nextDisabled = false,
}: StepNavigationProps) {
  const router = useRouter();

  const handleNext = async () => {
    if (onNext) await onNext();
    if (currentStep < totalSteps) {
      router.push(`/onboarding?step=${currentStep + 1}`);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      router.push(`/onboarding?step=${currentStep - 1}`);
    }
  };

  return (
    <div className="mt-8 flex justify-between border-t border-neutral-200 pt-6">
      <Button
        variant="outline"
        onClick={handleBack}
        disabled={currentStep === 1}
      >
        Back
      </Button>
      <Button onClick={handleNext} disabled={nextDisabled}>
        {currentStep === totalSteps ? "Finish" : "Next"}
      </Button>
    </div>
  );
}
