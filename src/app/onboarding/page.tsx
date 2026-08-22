"use client";

import { useTransition } from "react";
import { createRestaurantAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function OnboardingPage() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        const result = await createRestaurantAction(formData);
        if (result?.error) {
          toast.error(result.error);
        }
      } catch (err) {
        toast.error("An unexpected error occurred. Please try again.");
      }
    });
  };

  return (
    <Card className="w-full max-w-md bg-card border-border shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
          Welcome to ForkFlow
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Let&apos;s set up your first restaurant to get started.
        </CardDescription>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Restaurant Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. The Rustic Spoon"
              required
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="propertyType">Property Type</Label>
            <Select name="propertyType" defaultValue="LEASED" required>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OWNED">Owned</SelectItem>
                <SelectItem value="LEASED">Leased</SelectItem>
                <SelectItem value="RENTED">Rented</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up...
              </>
            ) : (
              "Create Restaurant"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
