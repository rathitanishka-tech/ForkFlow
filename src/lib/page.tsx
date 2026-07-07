import { Suspense } from "react";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

const steps = [
  {
    id: "01",
    name: "Business Information",
    description: "Tell us about your company.",
  },
  {
    id: "02",
    name: "Restaurant Details",
    description: "Describe your restaurant.",
  },
  {
    id: "03",
    name: "Floor Details",
    description: "Define your restaurant's floors.",
  },
  {
    id: "04",
    name: "Table Layout",
    description: "Design your seating arrangement.",
  },
  {
    id: "05",
    name: "Review & Publish",
    description: "Confirm your setup.",
  },
];

export default function OnboardingPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const step =
    typeof searchParams.step === "string" ? parseInt(searchParams.step, 10) : 1;

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-neutral-50 lg:py-10">
      <main className="flex w-full max-w-5xl flex-col rounded-lg bg-white shadow-lg lg:border lg:border-neutral-200">
        <div className="p-8">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Restaurant Onboarding
          </h1>
          <p className="mt-1 text-neutral-500">
            Follow the steps to set up your restaurant profile.
          </p>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <OnboardingWizard steps={steps} currentStep={step} />
        </Suspense>
      </main>
      <footer className="py-4 text-center text-sm text-neutral-500">
        <p>&copy; {new Date().getFullYear()} ForkFlow. All rights reserved.</p>
      </footer>
    </div>
  );
}
