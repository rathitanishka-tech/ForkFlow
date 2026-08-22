import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCurrentRestaurant, RestaurantNotFoundError } from "@/lib/server-restaurant";

export default async function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authState = await auth();
  if (!authState.userId) {
    redirect("/sign-in");
  }

  // If the user already has a restaurant, don't let them onboard again right now
  try {
    await getCurrentRestaurant();
    redirect("/dashboard");
  } catch (error) {
    if (error instanceof RestaurantNotFoundError) {
      // Good, they need to onboard
    } else {
      throw error;
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 text-foreground sm:px-6 lg:px-8">
      {children}
    </div>
  );
}
