"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  name: string;
  description: string;
}

interface ProgressStepperProps {
  steps: Step[];
  currentStep: number;
  orientation?: "horizontal" | "vertical";
}

export function ProgressStepper({
  steps,
  currentStep,
  orientation = "vertical",
}: ProgressStepperProps) {
  return (
    <nav aria-label="Progress">
      <ol
        className={cn(
          "flex",
          orientation === "vertical" ? "flex-col" : "flex-row",
        )}
      >
        {steps.map((step, stepIdx) => {
          const stepNumber = stepIdx + 1;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;

          return (
            <li key={step.name} className="relative flex-1 pb-10">
              {stepIdx !== steps.length - 1 && (
                <div
                  className="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-neutral-200"
                  aria-hidden="true"
                />
              )}
              <div className="group relative flex items-start">
                <span className="flex h-9 items-center">
                  <span
                    className={cn(
                      "relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                      isCompleted
                        ? "bg-sky-600 text-white"
                        : isCurrent
                          ? "border-2 border-sky-600 bg-white text-sky-600"
                          : "border-2 border-neutral-300 bg-white text-neutral-500",
                    )}
                  >
                    {isCompleted ? <Check className="h-5 w-5" /> : step.id}
                  </span>
                </span>
                <span className="ml-4 flex min-w-0 flex-col">
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      isCurrent ? "text-sky-600" : "text-neutral-700",
                    )}
                  >
                    {step.name}
                  </span>
                  <span className="text-sm text-neutral-500">
                    {step.description}
                  </span>
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
