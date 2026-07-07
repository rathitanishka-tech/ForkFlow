"use client";

import { useState } from "react";
import { toast } from "sonner";
import { StepNavigation } from "@/components/onboarding/step-navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Floor, useOnboardingStore } from "@/lib/onboarding-store";
import { Plus, Trash2 } from "lucide-react";

export function FloorDetailsStep() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { floors, updateState, restaurantId } = useOnboardingStore();

  const handleNext = async () => {
    if (!restaurantId) {
      toast.error("Restaurant information is missing. Please go back.");
      return;
    }

    setIsLoading(true);
    try {
      const floorsToCreate = floors.filter((floor) => !floor.backendId);
      if (floorsToCreate.length > 0) {
        const promises = floorsToCreate.map((floor) =>
          fetch("/api/floors", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: floor.name, restaurantId }),
          }).then((res) => res.json()),
        );

        const results = await Promise.all(promises);
        const updatedFloors = floors.map((f) => {
          const created = results.find((r) => r.name === f.name);
          return created ? { ...f, backendId: created.id } : f;
        });
        updateState({ floors: updatedFloors as Floor[] });
      }
      toast.success("Floors saved successfully!");
      router.push(`/onboarding?step=4`);
    } catch (error) {
      toast.error("Failed to save floors.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFloor = () => {
    const newFloor = {
      id: `floor-${Date.now()}`,
      name: `Floor ${floors.length + 1}`,
      tables: [],
    };
    updateState({ floors: [...floors, newFloor] });
  };

  const handleRemoveFloor = (id: string) => {
    updateState({ floors: floors.filter((floor) => floor.id !== id) });
  };

  const handleFloorNameChange = (id: string, name: string) => {
    updateState({
      floors: floors.map((floor) =>
        floor.id === id ? { ...floor, name } : floor,
      ),
    });
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Floor Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Label>Define your restaurant's floors</Label>
          {floors.map((floor, index) => (
            <div key={floor.id} className="flex items-center gap-2">
              <Input
                value={floor.name}
                onChange={(e) =>
                  handleFloorNameChange(floor.id, e.target.value)
                }
              />
              {floors.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveFloor(floor.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button variant="outline" className="w-full" onClick={handleAddFloor}>
            <Plus className="mr-2 h-4 w-4" /> Add Floor
          </Button>
        </div>
        <StepNavigation
          currentStep={3}
          totalSteps={5}
          onNext={handleNext}
          nextLabel={isLoading ? "Saving..." : "Next"}
          nextDisabled={isLoading}
        />
      </CardContent>
    </Card>
  );
}
