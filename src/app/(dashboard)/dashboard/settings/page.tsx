"use client";

import * as React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SettingsPage() {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isWarningOpen, setIsWarningOpen] = React.useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch("/api/restaurant/current", {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete restaurant");
      }
      
      toast.success("Restaurant deleted successfully.");
      // Force a hard reload to clear any cached states and redirect to onboarding
      window.location.href = "/onboarding";
    } catch {
      toast.error("Could not delete restaurant.");
      setIsDeleting(false);
      setIsWarningOpen(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col justify-between gap-4 rounded-[1.6rem] border border-border bg-card px-5 py-5 shadow-xl sm:flex-row sm:items-center sm:px-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-normal text-foreground">Settings</h1>
          <p className="mt-2 text-sm text-muted-foreground">Manage your restaurant preferences and danger zone actions.</p>
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-destructive/20 bg-card p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-destructive flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" /> Danger Zone
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Deleting your restaurant is a permanent action. All menus, tables, floors, orders, and analytics will be permanently wiped. You will be redirected to create a new restaurant.
        </p>

        <div className="mt-6">
          <Button variant="destructive" onClick={() => setIsWarningOpen(true)}>
            Delete Restaurant
          </Button>
        </div>
      </div>

      {isWarningOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[1.5rem] bg-card p-6 border border-border shadow-2xl">
            <div className="flex items-center gap-3 text-destructive mb-4">
              <AlertTriangle className="h-8 w-8" />
              <h2 className="text-xl font-bold">Are you absolutely sure?</h2>
            </div>
            
            <p className="text-muted-foreground text-sm mb-6">
              This action cannot be undone. This will permanently delete your restaurant, wipe all associated data (tables, menus, orders, analytics), and remove your owner access.
            </p>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setIsWarningOpen(false)} disabled={isDeleting}>
                Cancel
              </Button>
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Yes, delete my restaurant"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
