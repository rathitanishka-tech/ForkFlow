"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ReservationWithGuest } from "@/modules/reservation/reservation.types";
import { toast } from "sonner";
import { MoreHorizontal, Loader2 } from "lucide-react";

type ReservationAction = "confirm" | "seat" | "complete" | "cancel" | "no-show";

type ReservationActionsProps = {
  reservation: ReservationWithGuest;
  onActionSuccess: () => void;
};

export function ReservationActions({
  reservation,
  onActionSuccess,
}: ReservationActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<ReservationAction | null>(
    null,
  );

  const handleAction = async (action: ReservationAction) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/reservations/${reservation.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action.replace("-", " ")} reservation.`);
      }

      toast.success(`Reservation successfully ${action.replace("-", " ")}ed.`);
      onActionSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred.",
      );
    } finally {
      setIsLoading(false);
      setDialogOpen(false);
      setCurrentAction(null);
    }
  };

  const openConfirmationDialog = (action: ReservationAction) => {
    setCurrentAction(action);
    setDialogOpen(true);
  };

  const renderActions = () => {
    switch (reservation.status) {
      case "PENDING":
        return (
          <>
            <DropdownMenuItem onClick={() => handleAction("confirm")}>
              Confirm
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openConfirmationDialog("cancel")}>
              Cancel
            </DropdownMenuItem>
          </>
        );
      case "CONFIRMED":
        return (
          <>
            <DropdownMenuItem onClick={() => handleAction("seat")}>
              Seat Guest
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openConfirmationDialog("cancel")}>
              Cancel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openConfirmationDialog("no-show")}>
              No Show
            </DropdownMenuItem>
          </>
        );
      case "SEATED":
        return (
          <DropdownMenuItem onClick={() => openConfirmationDialog("complete")}>
            Complete Dining
          </DropdownMenuItem>
        );
      default:
        return null;
    }
  };

  const actions = renderActions();
  if (!actions) return null;

  const dialogTitles: Record<string, string> = {
    complete: "Complete Dining?",
    cancel: "Cancel Reservation?",
    "no-show": "Mark as No-Show?",
  };

  const dialogDescriptions: Record<string, string> = {
    complete:
      "This will mark the dining session as completed and set the table to available.",
    cancel: "This will cancel the reservation and release the table.",
    "no-show": "This will mark the guest as a no-show and release the table.",
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost" className="h-8 w-8 p-0 ml-auto mt-4 flex">
            <span className="sr-only">Open menu</span>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          {actions}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {currentAction ? dialogTitles[currentAction] : ""}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {currentAction ? dialogDescriptions[currentAction] : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Back</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => currentAction && handleAction(currentAction)}
              disabled={isLoading}
              className={
                currentAction === "cancel" || currentAction === "no-show"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
